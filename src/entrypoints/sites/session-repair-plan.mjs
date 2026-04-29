// @ts-check

import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildSessionRepairPlan,
  inspectSessionHealth,
} from '../../sites/downloads/session-manager.mjs';

const HELP = `Usage:
  node src/entrypoints/sites/session-repair-plan.mjs --site <site> [options]

Dry-run by default. This command prints session repair guidance only; it does
not execute login, keepalive, profile rebuild, or live smoke work.

Options:
  --site <siteKey>                  Site key, for example bilibili, douyin, x, instagram.
  --host <host>                     Optional host override.
  --status <status>                 Inject health status for dry-run planning.
  --reason <reason>                 Inject health reason/risk cause.
  --risk-signal <signal>            Add a risk signal. Can be repeated.
  --profile-path <path>             Forwarded to health inspection when no status is injected.
  --json                            Print JSON only.
  --execute                         Reserved; currently rejected to keep repair ops gated.
  -h, --help                        Show this help.
`;

function readValue(argv, index, flag) {
  if (index + 1 >= argv.length) {
    throw new Error(`Missing value for ${flag}`);
  }
  return { value: argv[index + 1], nextIndex: index + 1 };
}

export function parseArgs(argv) {
  const options = {
    riskSignals: [],
    json: false,
    execute: false,
    help: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    switch (arg) {
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '--json':
        options.json = true;
        break;
      case '--execute':
        options.execute = true;
        break;
      case '--site':
      case '--host':
      case '--status':
      case '--reason':
      case '--profile-path':
      case '--risk-signal': {
        const read = readValue(argv, index, arg);
        if (arg === '--risk-signal') {
          options.riskSignals.push(read.value);
        } else {
          const key = arg.slice(2).replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());
          options[key] = read.value;
        }
        index = read.nextIndex;
        break;
      }
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function injectedHealth(options = {}) {
  if (!options.status && !options.reason && options.riskSignals.length === 0) {
    return null;
  }
  return {
    siteKey: options.site,
    host: options.host,
    status: options.status ?? 'blocked',
    reason: options.reason ?? options.status ?? 'blocked',
    riskSignals: options.riskSignals,
  };
}

export async function buildSessionRepairPlanResult(options = {}, deps = {}) {
  if (options.help) {
    return { help: HELP };
  }
  if (!options.site) {
    throw new Error('Missing required --site');
  }
  if (options.execute) {
    throw new Error('--execute is not implemented; repair ops require a separate approval path');
  }
  const health = injectedHealth(options)
    ?? await (deps.inspectSessionHealth ?? inspectSessionHealth)(options.site, {
      host: options.host,
      profilePath: options.profilePath,
      sessionRequirement: 'optional',
    }, deps);
  const repairPlan = health.repairPlan ?? buildSessionRepairPlan(health);
  return {
    dryRun: true,
    siteKey: health.siteKey ?? options.site,
    host: health.host ?? options.host,
    status: health.status,
    reason: health.reason,
    riskSignals: health.riskSignals ?? [],
    repairPlan,
  };
}

function render(result) {
  if (result.help) {
    return result.help;
  }
  const plan = result.repairPlan ?? {};
  return [
    'Session Repair Plan',
    `- Site: ${result.siteKey}`,
    `- Status: ${result.status ?? 'unknown'}`,
    `- Reason: ${result.reason ?? 'none'}`,
    `- Dry-run: ${result.dryRun}`,
    `- Suggested action: ${plan.action ?? 'none'}`,
    `- Suggested command: ${plan.command ?? 'none'}`,
    `- Requires approval: ${plan.requiresApproval === true}`,
  ].join('\n') + '\n';
}

export async function main(argv = process.argv.slice(2), deps = {}) {
  const options = parseArgs(argv);
  const result = await buildSessionRepairPlanResult(options, deps);
  const output = options.json ? `${JSON.stringify(result, null, 2)}\n` : render(result);
  deps.stdout?.write ? deps.stdout.write(output) : process.stdout.write(output);
  return result;
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (entryPath && entryPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error?.message ?? String(error)}\n`);
    process.exitCode = 1;
  });
}
