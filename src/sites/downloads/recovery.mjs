// @ts-check

import { stat } from 'node:fs/promises';
import path from 'node:path';

import {
  pathExists,
  readJsonFile,
  readTextFile,
} from '../../infra/io.mjs';

const SUCCESS_QUEUE_STATUSES = new Set([
  'completed',
  'done',
  'downloaded',
  'passed',
  'skipped',
  'success',
]);

function normalizeError(error) {
  return error?.message ?? String(error);
}

export function queueKey(entry = {}) {
  return entry.id ?? entry.resourceId ?? entry.key ?? entry.url ?? entry.result?.resourceId ?? entry.result?.url ?? null;
}

export function isSuccessfulQueueStatus(status) {
  return SUCCESS_QUEUE_STATUSES.has(String(status ?? '').toLowerCase());
}

async function readJsonArtifact(filePath, label) {
  if (!await pathExists(filePath)) {
    return {
      label,
      path: filePath,
      exists: false,
      ok: false,
      reason: `${label}-missing`,
    };
  }
  try {
    return {
      label,
      path: filePath,
      exists: true,
      ok: true,
      value: await readJsonFile(filePath),
    };
  } catch (error) {
    return {
      label,
      path: filePath,
      exists: true,
      ok: false,
      reason: `${label}-invalid-json`,
      error: normalizeError(error),
    };
  }
}

async function readJsonLinesArtifact(filePath, label) {
  if (!await pathExists(filePath)) {
    return {
      label,
      path: filePath,
      exists: false,
      ok: false,
      reason: `${label}-missing`,
      value: [],
    };
  }
  try {
    const text = await readTextFile(filePath);
    const rows = [];
    const lines = text.split(/\r?\n/u);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index].trim();
      if (!line) {
        continue;
      }
      try {
        rows.push(JSON.parse(line));
      } catch (error) {
        return {
          label,
          path: filePath,
          exists: true,
          ok: false,
          reason: `${label}-invalid-jsonl`,
          error: `line ${index + 1}: ${normalizeError(error)}`,
          value: [],
        };
      }
    }
    return {
      label,
      path: filePath,
      exists: true,
      ok: true,
      value: rows,
    };
  } catch (error) {
    return {
      label,
      path: filePath,
      exists: true,
      ok: false,
      reason: `${label}-read-failed`,
      error: normalizeError(error),
      value: [],
    };
  }
}

function normalizeQueueArtifact(raw) {
  if (Array.isArray(raw)) {
    return raw;
  }
  if (Array.isArray(raw?.queue)) {
    return raw.queue;
  }
  return null;
}

function normalizeMediaManifestEntries(raw) {
  if (Array.isArray(raw)) {
    return raw;
  }
  if (Array.isArray(raw?.entries)) {
    return raw.entries;
  }
  if (Array.isArray(raw?.files)) {
    return raw.files;
  }
  return [];
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value ?? '').trim()).filter(Boolean))];
}

function entryKeys(entry = {}) {
  return uniqueStrings([
    entry.id,
    entry.resourceId,
    entry.key,
    entry.downloadKey,
    entry.url,
    entry.sourceUrl,
    entry.result?.id,
    entry.result?.resourceId,
    entry.result?.key,
    entry.result?.downloadKey,
    entry.result?.url,
  ]);
}

function buildEntryMap(entries) {
  const mapped = new Map();
  for (const entry of entries ?? []) {
    for (const key of entryKeys(entry)) {
      if (!mapped.has(key)) {
        mapped.set(key, entry);
      }
    }
  }
  return mapped;
}

function resolveArtifactPath(value, baseDir) {
  const text = String(value ?? '').trim();
  if (!text) {
    return null;
  }
  return path.isAbsolute(text) ? text : path.resolve(baseDir, text);
}

function sourceArtifactPath(manifest, key, baseDir) {
  const source = manifest?.artifacts?.source;
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return null;
  }
  return resolveArtifactPath(source[key], baseDir);
}

function preferQueueArtifact(candidates) {
  const usable = candidates.find((candidate) => candidate.artifact.ok && Array.isArray(candidate.queue) && candidate.queue.length > 0);
  if (usable) {
    return usable;
  }
  return candidates.find((candidate) => candidate.artifact.ok && Array.isArray(candidate.queue))
    ?? candidates.find((candidate) => candidate.artifact.exists)
    ?? candidates[0];
}

function pushProblem(problems, problem) {
  if (!problems.some((entry) => entry.reason === problem.reason && entry.path === problem.path)) {
    problems.push(problem);
  }
}

function validateManifestQueueConsistency(manifest, queue, problems) {
  if (!manifest || !Array.isArray(queue)) {
    return;
  }
  const expected = Number(manifest.counts?.expected);
  if (Number.isFinite(expected) && expected !== queue.length) {
    pushProblem(problems, {
      reason: 'manifest-queue-count-mismatch',
      detail: `manifest expected ${expected}, queue has ${queue.length}`,
    });
  }

  const queueKeys = new Set(queue.map((entry) => queueKey(entry)).filter(Boolean));
  for (const file of Array.isArray(manifest.files) ? manifest.files : []) {
    const key = queueKey(file);
    if (key && !queueKeys.has(key)) {
      pushProblem(problems, {
        reason: 'manifest-queue-resource-mismatch',
        resourceId: file.resourceId ?? file.id ?? null,
        url: file.url ?? null,
        detail: `manifest file ${key} is not present in queue`,
      });
      return;
    }
  }
}

function validateDownloadsQueueConsistency(downloads, queue, problems) {
  if (!Array.isArray(downloads) || !Array.isArray(queue)) {
    return;
  }
  const queueKeys = new Set(queue.map((entry) => queueKey(entry)).filter(Boolean));
  for (const row of downloads) {
    const key = queueKey(row);
    if (key && !queueKeys.has(key)) {
      pushProblem(problems, {
        reason: 'queue-downloads-resource-mismatch',
        resourceId: row.resourceId ?? row.id ?? null,
        url: row.url ?? null,
        detail: `download record ${key} is not present in queue`,
      });
      return;
    }
  }
}

function resolveTerminalRecoveryState({ mode, oldStateExists, manifestArtifact, queueArtifact, downloadsArtifact, queue, failedQueueEntries, problems }) {
  const blockingProblem = problems.find((problem) => [
    'downloads-invalid-jsonl',
    'downloads-read-failed',
    'manifest-invalid-json',
    'media-manifest-invalid-json',
    'media-queue-invalid-json',
    'source-downloads-invalid-jsonl',
    'source-downloads-read-failed',
    'source-manifest-invalid-json',
    'source-manifest-missing',
    'source-media-manifest-invalid-json',
    'source-media-manifest-missing',
    'source-media-queue-invalid-json',
    'source-media-queue-missing',
    'source-queue-invalid-json',
    'source-queue-missing',
    'manifest-queue-count-mismatch',
    'manifest-queue-resource-mismatch',
    'queue-downloads-resource-mismatch',
    'queue-invalid-json',
    'queue-invalid-shape',
    'media-queue-invalid-shape',
    'source-media-queue-invalid-shape',
    'source-queue-invalid-shape',
  ].includes(problem.reason));

  if (blockingProblem) {
    return {
      status: 'failed',
      reason: blockingProblem.reason,
      detail: blockingProblem.detail ?? blockingProblem.error,
    };
  }

  if (mode !== 'retry-failed') {
    return null;
  }

  if (!oldStateExists) {
    return {
      status: 'skipped',
      reason: 'retry-state-missing',
      detail: 'No previous manifest, queue, or downloads artifact exists for this run directory.',
    };
  }

  if (!queueArtifact.exists) {
    return {
      status: 'failed',
      reason: 'retry-queue-missing',
      detail: 'retry-failed requires a previous queue.json, media-queue.json, or source queue artifact.',
    };
  }

  if (!Array.isArray(queue)) {
    return {
      status: 'failed',
      reason: 'queue-invalid-shape',
      detail: 'queue.json must be an array or an object with a queue array.',
    };
  }

  if (downloadsArtifact.exists && !downloadsArtifact.ok) {
    return {
      status: 'failed',
      reason: downloadsArtifact.reason,
      detail: downloadsArtifact.error,
    };
  }

  if (manifestArtifact.exists && !manifestArtifact.ok) {
    return {
      status: 'failed',
      reason: manifestArtifact.reason,
      detail: manifestArtifact.error,
    };
  }

  if (failedQueueEntries.length === 0) {
    return {
      status: 'skipped',
      reason: 'retry-failed-none',
      detail: 'The previous queue has no failed resources to retry.',
    };
  }

  return null;
}

export async function loadDownloadRecoveryState(layout, resources = [], mode = 'none') {
  if (mode === 'none') {
    return {
      enabled: false,
      mode,
      queue: [],
      downloads: [],
      previousByKey: new Map(),
      downloadsByKey: new Map(),
      manifestFilesByKey: new Map(),
      mediaManifestByKey: new Map(),
      failedQueueEntries: [],
      failedQueueKeys: new Set(),
      recognizedArtifacts: [],
      problems: [],
      terminal: null,
    };
  }

  const [manifestArtifact, genericQueueArtifact, mediaQueueArtifact, downloadsArtifact, mediaManifestArtifact] = await Promise.all([
    readJsonArtifact(layout.manifestPath, 'manifest'),
    readJsonArtifact(layout.queuePath, 'queue'),
    readJsonArtifact(path.join(layout.runDir, 'media-queue.json'), 'media-queue'),
    readJsonLinesArtifact(layout.downloadsJsonlPath, 'downloads'),
    readJsonArtifact(path.join(layout.runDir, 'media-manifest.json'), 'media-manifest'),
  ]);

  const problems = [];
  const pushArtifactProblem = (artifact) => {
    if (artifact.exists && !artifact.ok) {
      pushProblem(problems, {
        reason: artifact.reason,
        path: artifact.path,
        error: artifact.error,
      });
    }
  };
  pushArtifactProblem(manifestArtifact);
  pushArtifactProblem(genericQueueArtifact);
  pushArtifactProblem(mediaQueueArtifact);
  pushArtifactProblem(mediaManifestArtifact);
  if (downloadsArtifact.exists && !downloadsArtifact.ok) {
    pushProblem(problems, {
      reason: downloadsArtifact.reason,
      path: downloadsArtifact.path,
      error: downloadsArtifact.error,
    });
  }

  const manifest = manifestArtifact.ok ? manifestArtifact.value : null;
  const sourceBaseDir = path.dirname(layout.manifestPath);
  const sourceManifestPath = sourceArtifactPath(manifest, 'manifest', sourceBaseDir);
  const sourceQueuePath = sourceArtifactPath(manifest, 'queue', sourceBaseDir);
  const sourceMediaQueuePath = sourceArtifactPath(manifest, 'mediaQueue', sourceBaseDir);
  const sourceDownloadsPath = sourceArtifactPath(manifest, 'downloadsJsonl', sourceBaseDir);
  const sourceMediaManifestPath = sourceArtifactPath(manifest, 'mediaManifest', sourceBaseDir);
  const [
    sourceManifestArtifact,
    sourceQueueArtifact,
    sourceMediaQueueArtifact,
    sourceDownloadsArtifact,
    sourceMediaManifestArtifact,
  ] = await Promise.all([
    sourceManifestPath ? readJsonArtifact(sourceManifestPath, 'source-manifest') : Promise.resolve({ label: 'source-manifest', exists: false, ok: false }),
    sourceQueuePath ? readJsonArtifact(sourceQueuePath, 'source-queue') : Promise.resolve({ label: 'source-queue', exists: false, ok: false }),
    sourceMediaQueuePath ? readJsonArtifact(sourceMediaQueuePath, 'source-media-queue') : Promise.resolve({ label: 'source-media-queue', exists: false, ok: false }),
    sourceDownloadsPath ? readJsonLinesArtifact(sourceDownloadsPath, 'source-downloads') : Promise.resolve({ label: 'source-downloads', exists: false, ok: false, value: [] }),
    sourceMediaManifestPath ? readJsonArtifact(sourceMediaManifestPath, 'source-media-manifest') : Promise.resolve({ label: 'source-media-manifest', exists: false, ok: false }),
  ]);
  pushArtifactProblem(sourceManifestArtifact);
  pushArtifactProblem(sourceQueueArtifact);
  pushArtifactProblem(sourceMediaQueueArtifact);
  pushArtifactProblem(sourceMediaManifestArtifact);
  for (const artifact of [sourceManifestArtifact, sourceQueueArtifact, sourceMediaQueueArtifact, sourceMediaManifestArtifact]) {
    if (artifact.path && !artifact.exists) {
      pushProblem(problems, {
        reason: artifact.reason,
        path: artifact.path,
      });
    }
  }
  if (sourceDownloadsArtifact.exists && !sourceDownloadsArtifact.ok) {
    pushProblem(problems, {
      reason: sourceDownloadsArtifact.reason,
      path: sourceDownloadsArtifact.path,
      error: sourceDownloadsArtifact.error,
    });
  }

  const queueCandidates = [
    {
      kind: 'queue',
      artifact: genericQueueArtifact,
      queue: genericQueueArtifact.ok ? normalizeQueueArtifact(genericQueueArtifact.value) : [],
    },
    {
      kind: 'media-queue',
      artifact: mediaQueueArtifact,
      queue: mediaQueueArtifact.ok ? normalizeQueueArtifact(mediaQueueArtifact.value) : [],
    },
    {
      kind: 'source-queue',
      artifact: sourceQueueArtifact,
      queue: sourceQueueArtifact.ok ? normalizeQueueArtifact(sourceQueueArtifact.value) : [],
    },
    {
      kind: 'source-media-queue',
      artifact: sourceMediaQueueArtifact,
      queue: sourceMediaQueueArtifact.ok ? normalizeQueueArtifact(sourceMediaQueueArtifact.value) : [],
    },
  ];
  for (const candidate of queueCandidates) {
    if (candidate.artifact.ok && !Array.isArray(candidate.queue)) {
      pushProblem(problems, {
        reason: `${candidate.kind}-invalid-shape`,
        path: candidate.artifact.path,
        detail: `${path.basename(candidate.artifact.path)} must be an array or an object with a queue array.`,
      });
    }
  }

  const selectedQueue = preferQueueArtifact(queueCandidates);
  const queue = selectedQueue.artifact.ok ? selectedQueue.queue : [];
  const normalizedQueue = Array.isArray(queue) ? queue : [];
  const sourceDownloads = sourceDownloadsArtifact.ok ? sourceDownloadsArtifact.value : [];
  const downloads = [
    ...(downloadsArtifact.ok ? downloadsArtifact.value : []),
    ...sourceDownloads,
  ];
  const sourceManifest = sourceManifestArtifact.ok ? sourceManifestArtifact.value : null;
  const mediaManifestEntries = [
    ...(mediaManifestArtifact.ok ? normalizeMediaManifestEntries(mediaManifestArtifact.value) : []),
    ...(sourceMediaManifestArtifact.ok ? normalizeMediaManifestEntries(sourceMediaManifestArtifact.value) : []),
  ];

  if (selectedQueue.kind === 'queue') {
    validateManifestQueueConsistency(manifest, normalizedQueue, problems);
  }
  validateDownloadsQueueConsistency(downloads, normalizedQueue, problems);

  const previousByKey = buildEntryMap(normalizedQueue);
  const downloadsByKey = buildEntryMap((downloads ?? []).filter((entry) => entry?.ok === true));
  const manifestFilesByKey = buildEntryMap([
    ...(Array.isArray(manifest?.files) ? manifest.files : []),
    ...(Array.isArray(sourceManifest?.files) ? sourceManifest.files : []),
  ]);
  const mediaManifestByKey = buildEntryMap(mediaManifestEntries.filter((entry) => entry?.ok !== false));
  const failedQueueEntries = normalizedQueue.filter((entry) => String(entry?.status ?? '').toLowerCase() === 'failed');
  const failedQueueKeys = new Set(failedQueueEntries.map((entry) => queueKey(entry)).filter(Boolean));
  const recognizedArtifacts = [
    manifestArtifact,
    genericQueueArtifact,
    mediaQueueArtifact,
    downloadsArtifact,
    mediaManifestArtifact,
    sourceManifestArtifact,
    sourceQueueArtifact,
    sourceMediaQueueArtifact,
    sourceDownloadsArtifact,
    sourceMediaManifestArtifact,
  ].filter((artifact) => artifact.exists).map((artifact) => ({
    label: artifact.label,
    path: artifact.path,
    ok: artifact.ok,
  }));
  const oldStateExists = recognizedArtifacts.length > 0;

  return {
    enabled: true,
    mode,
    oldStateExists,
    artifacts: {
      manifest: manifestArtifact,
      queue: selectedQueue.artifact,
      genericQueue: genericQueueArtifact,
      mediaQueue: mediaQueueArtifact,
      downloads: downloadsArtifact,
      mediaManifest: mediaManifestArtifact,
      sourceManifest: sourceManifestArtifact,
      sourceQueue: sourceQueueArtifact,
      sourceMediaQueue: sourceMediaQueueArtifact,
      sourceDownloads: sourceDownloadsArtifact,
      sourceMediaManifest: sourceMediaManifestArtifact,
    },
    manifest,
    sourceManifest,
    queue: normalizedQueue,
    queueKind: selectedQueue.kind,
    downloads,
    previousByKey,
    downloadsByKey,
    manifestFilesByKey,
    mediaManifestByKey,
    failedQueueEntries,
    failedQueueKeys,
    resourceCount: resources.length,
    recognizedArtifacts,
    problems,
    terminal: resolveTerminalRecoveryState({
      mode,
      oldStateExists,
      manifestArtifact,
      queueArtifact: selectedQueue.artifact,
      downloadsArtifact,
      queue,
      failedQueueEntries,
      problems,
    }),
  };
}

function buildArtifactCandidates(resource, queueEntry, recoveryState) {
  const keys = uniqueStrings([queueKey(resource), resource.url]);
  const mapCandidates = (map) => keys.map((key) => map?.get(key)).filter(Boolean);
  return [
    ...mapCandidates(recoveryState.downloadsByKey),
    ...mapCandidates(recoveryState.manifestFilesByKey),
    ...mapCandidates(recoveryState.mediaManifestByKey),
    queueEntry?.result,
    isSuccessfulQueueStatus(queueEntry?.status) ? queueEntry : null,
  ].filter(Boolean);
}

async function validateArtifactCandidate(candidate) {
  const filePath = candidate?.filePath;
  if (!filePath) {
    return {
      ok: false,
      reason: 'recovery-artifact-missing',
      detail: 'No filePath was recorded for the recovered resource.',
    };
  }
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return {
        ok: false,
        reason: 'recovery-artifact-not-file',
        filePath,
        detail: 'Recovered filePath exists but is not a file.',
      };
    }
    const expectedBytes = Number(candidate.bytes);
    if (Number.isFinite(expectedBytes) && expectedBytes >= 0 && fileStat.size !== expectedBytes) {
      return {
        ok: false,
        reason: 'recovery-artifact-size-mismatch',
        filePath,
        detail: `recorded ${expectedBytes} bytes, found ${fileStat.size}`,
      };
    }
    return {
      ok: true,
      filePath,
      bytes: fileStat.size,
    };
  } catch {
    return {
      ok: false,
      reason: 'recovery-artifact-missing',
      filePath,
      detail: 'Recovered filePath does not exist.',
    };
  }
}

export async function recoverCompletedResource(resource, queueEntry, recoveryState, reason = 'resume-existing-download') {
  const candidates = buildArtifactCandidates(resource, queueEntry, recoveryState);
  const problems = [];
  for (const candidate of candidates) {
    const checked = await validateArtifactCandidate(candidate);
    if (!checked.ok) {
      problems.push({
        ...checked,
        resourceId: resource.id,
        url: resource.url,
      });
      continue;
    }
    return {
      result: {
        ok: true,
        skipped: true,
        reason,
        resourceId: resource.id,
        url: resource.url,
        filePath: checked.filePath,
        bytes: checked.bytes,
        mediaType: candidate.mediaType ?? resource.mediaType,
        sha256: candidate.sha256 ?? null,
      },
      problem: null,
    };
  }

  if (isSuccessfulQueueStatus(queueEntry?.status) || candidates.length > 0) {
    return {
      result: null,
      problem: problems[0] ?? {
        reason: 'recovery-artifact-missing',
        resourceId: resource.id,
        url: resource.url,
        filePath: queueEntry?.filePath ?? null,
        detail: 'The previous successful resource has no reusable artifact.',
      },
    };
  }

  return {
    result: null,
    problem: null,
  };
}
