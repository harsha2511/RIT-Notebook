import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import prefixer from 'postcss-prefix-selector'

// Each stylesheet in src/styles/pages/ came from a separate HTML page and styles
// global things like `body` and `.navbar`. Scope every rule to its page wrapper
// (`.page-<file name>`) so the pages can live side by side in one app.
const scopePageStyles = prefixer({
  prefix: '.page',
  includeFiles: [/src[\\/]styles[\\/]pages[\\/]/],
  transform(_prefix, selector, _prefixed, filePath) {
    const scope = `.page-${path.basename(filePath, '.css')}`
    if (/^(html|body|:root)$/.test(selector)) return scope
    if (/^(html|body)\s/.test(selector)) return selector.replace(/^(html|body)/, scope)
    return `${scope} ${selector}`
  },
})

export default defineConfig({
  plugins: [react()],
  css: { postcss: { plugins: [scopePageStyles] } },
})
