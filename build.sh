#!/usr/bin/env bash
# Rebuild status/main.js (classic IIFE) from status/src/main.js.
# Needs esbuild and the @openchamber/sdk that ships with the installed OpenChamber.
# Usage: ESBUILD=/path/to/esbuild ./build.sh
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
esbuild="${ESBUILD:-esbuild}"
sdk_modules="${OPENCHAMBER_NODE_MODULES:-$HOME/.local/lib/node_modules/@openchamber/web/node_modules}"
NODE_PATH="$sdk_modules" "$esbuild" "$here/status/src/main.js" \
  --bundle --format=iife --platform=browser --target=es2020 --minify \
  --outfile="$here/status/main.js"
