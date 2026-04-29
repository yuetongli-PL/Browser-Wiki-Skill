// @ts-check

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  HELP,
  buildAudit,
  parseArgs,
  writeAudit,
} from '../tools/download-release-audit-core.mjs';

export {
  buildAudit,
  parseArgs,
  writeAudit,
};

export async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help) {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  const audit = await buildAudit(options);
  const outputs = await writeAudit(options, audit);
  if (outputs) {
    process.stdout.write(`JSON: ${outputs.jsonPath}\nMarkdown: ${outputs.markdownPath}\n`);
  } else {
    process.stdout.write(`${JSON.stringify(audit, null, 2)}\n`);
  }
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (entryPath && entryPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error?.message ?? String(error));
    process.exitCode = 1;
  });
}
