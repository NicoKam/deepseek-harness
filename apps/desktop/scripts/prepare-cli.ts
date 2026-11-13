/** Package terminal launch scripts that reuse the installed Electron runtime. */

import { chmodSync, copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/** Linux launcher: the Host runs on the bundled Node and its dsh tree sits outside app.asar. */
const LINUX_LAUNCHER = `#!/bin/sh
# Run the installed CLI without changing the invoking shell or working directory.
set -e
launcher=$0
while [ -L "$launcher" ]; do
  directory=$(CDPATH= cd -- "$(dirname -- "$launcher")" && pwd -P)
  target=$(readlink "$launcher")
  case "$target" in
    /*) launcher=$target ;;
    *) launcher=$directory/$target ;;
  esac
done
resources=$(CDPATH= cd -- "$(dirname -- "$launcher")/../../.." && pwd -P)
exec "$resources/runtime/primary-runtime/dependencies/node/bin/node" --expose-internals \
  "$resources/app/dsh/node_modules/@deepseek-ai/dsh-desktop-host/lib/cli.js" "$@"
`

/**
 * Copy the platform launcher into the application's public command directory.
 * @param destination - Physical runtime/cli directory prepared for the application.
 * @param platform - Target Desktop operating system.
 */
export function prepareDesktopCli(destination: string, platform: string): void {
  const name = platform === 'win32' ? 'dsh.cmd' : 'dsh'
  const command = join(destination, 'bin', name)
  mkdirSync(join(destination, 'bin'), { recursive: true })
  if (platform === 'linux') writeFileSync(command, LINUX_LAUNCHER, { mode: 0o755 })
  else copyFileSync(join(import.meta.dirname, '..', 'cli', name), command)
  if (platform !== 'win32') chmodSync(command, 0o755)
}
