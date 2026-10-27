#!/bin/bash
set -Eeuo pipefail
cd "${COZE_WORKSPACE_PATH:-.}"
exec node server/dist/main.js -p "${DEPLOY_RUN_PORT:-3000}"
