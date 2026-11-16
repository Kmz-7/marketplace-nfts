import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const profile = process.argv[2] === 'mobile' ? 'mobile' : 'desktop'
const config = `lighthouserc.${profile}.json`
const cliPath = fileURLToPath(new URL('../node_modules/@lhci/cli/src/cli.js', import.meta.url))
const result = spawnSync(process.execPath, [cliPath, 'autorun', `--config=${config}`], {
  stdio: 'inherit',
  env: { ...process.env, CHROME_PATH: chromium.executablePath() },
})

process.exit(result.status ?? 1)
