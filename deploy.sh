#!/usr/bin/env bash

# Simple deploy script for static/front-end projects (Vite build)
# - Clones or updates the repo in the target dir
# - Runs npm ci and npm run build
# - Leaves the built assets in the repo's dist/ (serve that dir on the server)

set -Eeuo pipefail

REPO_URL=""
DEPLOY_DIR=""
BRANCH="main"
ALLOWED_REPO=""
SSH_KEY_FILE=""
SSH_KEY_CONTENT=""

usage() {
  cat <<EOF
Usage: $0 --repo <url> --dir <abs_path> [--branch <name>] [--allowed-repo <url>] [--ssh-key-file <path>] [--ssh-key-content "<key>"]
EOF
}

if [[ $# -eq 0 ]]; then
  usage
  exit 1
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    -r|--repo) REPO_URL="${2:-}"; shift 2 ;;
    -d|--dir) DEPLOY_DIR="${2:-}"; shift 2 ;;
    -b|--branch) BRANCH="${2:-}"; shift 2 ;;
    --allowed-repo) ALLOWED_REPO="${2:-}"; shift 2 ;;
    --ssh-key-file) SSH_KEY_FILE="${2:-}"; shift 2 ;;
    --ssh-key-content) SSH_KEY_CONTENT="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
done

if [[ -z "$REPO_URL" || -z "$DEPLOY_DIR" ]]; then
  echo "❌ --repo and --dir are required" >&2
  usage
  exit 1
fi

if [[ -n "$ALLOWED_REPO" && "$REPO_URL" != "$ALLOWED_REPO" ]]; then
  echo "❌ Repository not allowed. Expected: $ALLOWED_REPO" >&2
  exit 1
fi

if [[ "$DEPLOY_DIR" == "/" || -z "$DEPLOY_DIR" || "$DEPLOY_DIR" != /* ]]; then
  echo "❌ --dir must be a non-empty absolute path" >&2
  exit 1
fi

TMP_SSH_KEY=""
if [[ -n "$SSH_KEY_CONTENT" ]]; then
  TMP_SSH_KEY=$(mktemp -p "${TMPDIR:-/tmp}" deploy_ssh_key.XXXXXX)
  umask 077
  printf "%s\n" "$SSH_KEY_CONTENT" > "$TMP_SSH_KEY"
  umask 022
  chmod 600 "$TMP_SSH_KEY" 2>/dev/null || true
  SSH_KEY_FILE="$TMP_SSH_KEY"
  trap '[[ -n "$TMP_SSH_KEY" && -f "$TMP_SSH_KEY" ]] && rm -f "$TMP_SSH_KEY"' EXIT
fi

if [[ -n "$SSH_KEY_FILE" ]]; then
  chmod 600 "$SSH_KEY_FILE" 2>/dev/null || true
  export GIT_SSH_COMMAND="ssh -i '$SSH_KEY_FILE' -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
fi

mkdir -p "$DEPLOY_DIR"

if [[ ! -d "$DEPLOY_DIR/.git" ]]; then
  echo "📥 Cloning $REPO_URL into $DEPLOY_DIR (branch $BRANCH)..."
  git clone --branch "$BRANCH" --depth 1 "$REPO_URL" "$DEPLOY_DIR"
else
  echo "🔄 Updating repository..."
  cd "$DEPLOY_DIR"
  git fetch origin
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
fi

cd "$DEPLOY_DIR"

echo "📦 Installing dependencies..."
npm ci --no-audit

echo "🛠 Building..."
npm run build

echo "📌 Deployed revision: $(git rev-parse --short HEAD)"
echo "✅ Deploy completed."
