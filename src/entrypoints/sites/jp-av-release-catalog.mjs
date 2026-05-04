// @ts-check

import process from 'node:process';
import path from 'node:path';
import { execFile as execFileCallback } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { initializeCliUtf8, writeJsonStdout } from '../../infra/cli.mjs';
import { collectJpAvReleaseCatalog } from '../../sites/jp-av-catalog/queries/release-catalog.mjs';

const USER_AGENT = 'Mozilla/5.0 Browser-Wiki-Skill jp-av release catalog';
const execFile = promisify(execFileCallback);

function parseArgs(argv) {
  const flags = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      continue;
    }
    const [rawKey, inlineValue] = token.split('=', 2);
    const key = rawKey.replace(/^--/u, '');
    if (inlineValue !== undefined) {
      flags[key] = inlineValue;
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      flags[key] = next;
      index += 1;
    } else {
      flags[key] = true;
    }
  }
  return {
    startDate: String(flags.start ?? flags['start-date'] ?? '2026-01-01'),
    endDate: String(flags.end ?? flags['end-date'] ?? '2026-05-04'),
    concurrency: flags.concurrency ? Number.parseInt(String(flags.concurrency), 10) : 6,
    maxPages: flags['max-pages'] ? Number.parseInt(String(flags['max-pages']), 10) : 80,
  };
}

async function fetchHtmlWithFetch(url, { encoding = 'utf-8' } = {}) {
  const signal = typeof AbortSignal?.timeout === 'function'
    ? AbortSignal.timeout(30000)
    : undefined;
  const response = await fetch(url, {
    signal,
    headers: {
      'user-agent': USER_AGENT,
      'accept-language': 'ja,en;q=0.8,zh-CN;q=0.7',
      'cache-control': 'no-cache',
    },
  });
  if (!response.ok) {
    throw new Error(`Fetch failed: ${url} -> ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  return new TextDecoder(encoding).decode(buffer);
}

async function fetchHtmlWithCurl(url, { encoding = 'utf-8' } = {}) {
  const { stdout } = await execFile('curl.exe', [
    '--silent',
    '--show-error',
    '--location',
    '--compressed',
    '--max-time',
    '30',
    '--user-agent',
    USER_AGENT,
    '--header',
    'Accept-Language: ja,en;q=0.8,zh-CN;q=0.7',
    url,
  ], {
    encoding: 'buffer',
    maxBuffer: 40 * 1024 * 1024,
  });
  return new TextDecoder(encoding).decode(stdout);
}

async function fetchHtml(url, options = {}) {
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await fetchHtmlWithFetch(url, options);
    } catch (error) {
      lastError = error;
      try {
        return await fetchHtmlWithCurl(url, options);
      } catch (curlError) {
        lastError = curlError;
      }
    }
  }
  throw lastError;
}

export async function main(argv = process.argv.slice(2)) {
  initializeCliUtf8();
  const options = parseArgs(argv);
  const catalog = await collectJpAvReleaseCatalog({
    ...options,
    fetchHtml,
  });
  writeJsonStdout(catalog);
  return catalog;
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (entryPath && entryPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
