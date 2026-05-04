// @ts-check

import process from 'node:process';
import path from 'node:path';
import { execFile as execFileCallback } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { initializeCliUtf8, writeJsonStdout } from '../../infra/cli.mjs';
import { collectMoodyzMonthCatalog } from '../../sites/moodyz/queries/month-catalog.mjs';

const USER_AGENT = 'Mozilla/5.0 Browser-Wiki-Skill moodyz catalog';
const execFile = promisify(execFileCallback);

function parseArgs(argv) {
  const flags = {};
  const positionals = [];
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      positionals.push(token);
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

  const monthText = String(flags.month ?? positionals[0] ?? '').trim();
  const match = monthText.match(/^(?<year>\d{4})-(?<month>\d{1,2})$/u);
  if (!match) {
    throw new Error('Usage: node src/entrypoints/sites/moodyz-month-catalog.mjs --month YYYY-MM');
  }
  return {
    year: Number.parseInt(match.groups.year, 10),
    month: Number.parseInt(match.groups.month, 10),
    concurrency: flags.concurrency ? Number.parseInt(String(flags.concurrency), 10) : 6,
  };
}

async function fetchHtml(url) {
  try {
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
    return await response.text();
  } catch (error) {
    const { stdout } = await execFile('curl.exe', [
      '--silent',
      '--show-error',
      '--location',
      '--compressed',
      '--user-agent',
      USER_AGENT,
      '--header',
      'Accept-Language: ja,en;q=0.8,zh-CN;q=0.7',
      url,
    ], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
    if (stdout?.trim()) {
      return stdout;
    }
    throw error;
  }
}

export async function main(argv = process.argv.slice(2)) {
  initializeCliUtf8();
  const options = parseArgs(argv);
  const catalog = await collectMoodyzMonthCatalog({
    year: options.year,
    month: options.month,
    concurrency: options.concurrency,
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
