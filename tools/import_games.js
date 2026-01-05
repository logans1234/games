#!/usr/bin/env node
// import_games.js
// Usage: node tools/import_games.js [importDir]
// Copies .html game files from importDir into public/games/, extracts titles, and writes public/games.json

const fs = require('fs')
const path = require('path')

const importDir = process.argv[2] || path.join(process.cwd(), 'import')
const outDir = path.join(process.cwd(), 'public', 'games')
const outJson = path.join(process.cwd(), 'public', 'games.json')

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

if(!fs.existsSync(importDir)){
  console.error('Import directory not found:', importDir)
  console.error('Create the directory and add your .html game files there, then re-run this script.')
  process.exit(1)
}

fs.mkdirSync(outDir, { recursive: true })

const files = fs.readdirSync(importDir).filter(f=>f.toLowerCase().endsWith('.html'))
if(files.length === 0){
  console.error('No .html files found in', importDir)
  process.exit(1)
}

const games = []
for(const f of files){
  const src = path.join(importDir, f)
  const html = fs.readFileSync(src, 'utf8')
  const inferredTitle = extractTitle(html, path.basename(f, '.html'))
  const id = slugify(inferredTitle || path.basename(f, '.html'))
  const outName = id + '.html'
  const dest = path.join(outDir, outName)
  fs.writeFileSync(dest, html)
  console.log('Imported', f, 'as', outName, `(title: ${inferredTitle})`)
  games.push({
    id,
    title: inferredTitle,
    category: '',
    author: '',
    thumbnail: `https://via.placeholder.com/400x240?text=${encodeURIComponent(inferredTitle)}`,
    path: path.posix.join('public', 'games', outName)
  })
}

fs.writeFileSync(outJson, JSON.stringify(games, null, 2), 'utf8')
console.log('Wrote', outJson, 'with', games.length, 'games')
