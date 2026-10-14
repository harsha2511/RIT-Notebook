#!/usr/bin/env bash
# One-click local setup and run for RIT Notebook.
# Checks Node.js, installs packages when needed, then starts the dev server and opens the browser.
# The site has no backend, database or API keys, so nothing else needs to be set up.

set -e
cd "$(dirname "$0")"

# 1. Node.js 18+ (installs it with Homebrew if missing)
if ! command -v node >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    echo "Node.js not found. Installing it with Homebrew..."
    brew install node
  else
    echo "Node.js is not installed. Get it from https://nodejs.org (LTS), then run this file again."
    exit 1
  fi
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Node.js $(node -v) is too old. Version 18 or newer is needed: https://nodejs.org"
  exit 1
fi

# 2. Packages: install on first run, or again when package.json / package-lock.json changed
if [ ! -d node_modules ] || [ package.json -nt node_modules ] || [ package-lock.json -nt node_modules ]; then
  echo "Installing packages..."
  npm install
  touch node_modules
fi

# 3. Start the site and open it in the browser (Ctrl+C to stop)
echo "Starting RIT Notebook (the link is printed below; usually http://localhost:5173)..."
npm run dev -- --open
