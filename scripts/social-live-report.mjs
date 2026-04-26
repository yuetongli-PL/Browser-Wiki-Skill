// @ts-check

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  HELP,
  buildReport,
  parseArgs,
  writeReport,
} from '../tools/social-live-report-core.mjs';

export {
  buildReport,
  parseArgs,
  writeReport,
};

export async function main(argv) {
  const options = parseArgs(argv);
  if (options.help) {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  const report = await buildReport(options);
  const outputs = await writeReport(options, report);
  if (outputs) {
    process.stdout.write(`JSON: ${outputs.jsonPath}\nMarkdown: ${outputs.markdownPath}\n`);
  } else {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  }
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (entryPath && entryPath === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error?.message ?? String(error));
    process.exitCode = 1;
  });
}
