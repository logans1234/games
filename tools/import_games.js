#!/usr/bin/env node
// import_games.js
// Usage: node tools/import_games.js [importDir]
// Copies .html game files from importDir into public/games/, extracts titles, and writes public/games.json

const fs = require('fs')
const path = require('path')

// Get the repo root directory (parent of tools dir)
const scriptDir = path.dirname(path.resolve(__filename))
const repoRoot = path.dirname(scriptDir)

const importDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(repoRoot, 'import')
const outDir = path.join(repoRoot, 'public', 'games')
const outJson = path.join(repoRoot, 'public', 'games.json')

function slugify(s){
  return s.toString().toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function extractTitle(html, fallback){
  const t1 = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if(t1 && t1[1]) return t1[1].trim()
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
  if(h1 && h1[1]) return h1[1].trim()
  return fallback
}

// Generic/placeholder titles to ignore in favor of filename
const genericTitles = new Set([
  'really cool flash game',
  'game',
  'untitled',
  'flash game',
  'html game'
]);

if(!fs.existsSync(importDir)){
  console.error('Import directory not found:', importDir)
  console.error('Create the directory and add your .html game files there, then re-run this script.')
  process.exit(1)
}

fs.mkdirSync(outDir, { recursive: true })

// Recursively collect .html files from importDir
function collectHtmlFiles(dir){
  const res = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for(const e of entries){
    const full = path.join(dir, e.name)
    if(e.isDirectory()){
      res.push(...collectHtmlFiles(full))
    } else if(e.isFile() && e.name.toLowerCase().endsWith('.html')){
      res.push(full)
    }
  }
  return res
}

const filePaths = collectHtmlFiles(importDir)
if(filePaths.length === 0){
  console.error('No .html files found in', importDir)
  process.exit(1)
}

const games = []
for(const fullPath of filePaths){
  const html = fs.readFileSync(fullPath, 'utf8')
  const f = path.basename(fullPath)
  const fileBaseName = path.basename(f, '.html')
  let extractedTitle = extractTitle(html, fileBaseName)

  // If title is generic, use the filename instead
  if(extractedTitle && genericTitles.has(extractedTitle.toLowerCase())){
    extractedTitle = fileBaseName
  }

  // Use original filename as ID (preserve cl* ids)
  const id = fileBaseName
  const outName = id + '.html'
  const dest = path.join(outDir, outName)
  fs.writeFileSync(dest, html)
  console.log('Imported', f, 'as', outName, `(title: ${extractedTitle})`)
  games.push({
    id,
    title: extractedTitle,
    category: '',
    author: '',
    thumbnail: `https://via.placeholder.com/400x240?text=${encodeURIComponent(extractedTitle)}`,
    path: path.posix.join('public', 'games', outName)
  })
}

fs.writeFileSync(outJson, JSON.stringify(games, null, 2), 'utf8')
console.log('Wrote', outJson, 'with', games.length, 'games')
