// @ts-check

import path from 'node:path';

import {
  ensureDir,
  writeTextFile,
} from '../../infra/io.mjs';
import {
  prepareRedactedArtifactJson,
  prepareRedactedArtifactJsonWithAudit,
} from '../capability/security-guard.mjs';
import { compactSlug } from '../../shared/normalize.mjs';
import { timestampForRun } from './contracts.mjs';

export function buildDownloadRunId(plan = {}, date = new Date()) {
  const prefix = compactSlug(`${plan.siteKey ?? 'site'}-${plan.taskType ?? 'download'}`, 'download', 64);
  return `${timestampForRun(date)}-${prefix}`;
}

export async function buildDownloadRunLayout(plan = {}, options = {}) {
  const workspaceRoot = options.workspaceRoot ?? process.cwd();
  const runId = options.runId ?? plan.output?.runId ?? buildDownloadRunId(plan, options.date ?? new Date());
  const runRoot = path.resolve(
    workspaceRoot,
    options.runRoot
      ?? plan.output?.root
      ?? path.join('runs', 'downloads', plan.siteKey ?? 'unknown-site'),
  );
  const runDir = path.resolve(options.runDir ?? plan.output?.runDir ?? path.join(runRoot, runId));
  const filesDir = path.join(runDir, 'files');
  await ensureDir(filesDir);
  return {
    runId,
    runRoot,
    runDir,
    filesDir,
    manifestPath: path.join(runDir, 'manifest.json'),
    queuePath: path.join(runDir, 'queue.json'),
    downloadsJsonlPath: path.join(runDir, 'downloads.jsonl'),
    reportMarkdownPath: path.join(runDir, 'report.md'),
    redactionAuditPath: path.join(runDir, 'redaction-audit.json'),
    lifecycleEventPath: path.join(runDir, 'lifecycle-event.json'),
    lifecycleEventRedactionAuditPath: path.join(runDir, 'lifecycle-event-redaction-audit.json'),
    planPath: path.join(runDir, 'plan.json'),
    planRedactionAuditPath: path.join(runDir, 'plan-redaction-audit.json'),
    resolvedTaskPath: path.join(runDir, 'resolved-task.json'),
    standardTaskListPath: path.join(runDir, 'standard-task-list.json'),
  };
}

export async function writeRedactedDownloadJsonArtifact(filePath, value, options = {}) {
  const {
    auditPath,
    ...redactionOptions
  } = options;
  const prepared = auditPath
    ? prepareRedactedArtifactJsonWithAudit(value, redactionOptions)
    : prepareRedactedArtifactJson(value, redactionOptions);
  const { json } = prepared;
  await writeTextFile(filePath, json);
  if (auditPath) {
    await writeTextFile(auditPath, prepared.auditJson);
  }
}
