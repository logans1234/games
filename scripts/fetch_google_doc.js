#!/usr/bin/env node
// scripts/fetch_google_doc.js
// Fetches the Google Doc and tries to extract game categories

const https = require('https');

const docId = '1_FmH3BlSBQI7FGgAQL59-ZPe8eCxs35wel6JUyVaG8Q';
const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;

console.log('Fetching Google Doc...');
console.log('URL:', exportUrl);

https.get(exportUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if(res.statusCode !== 200){
      console.error(`HTTP ${res.statusCode}: Could not fetch doc. Make sure it's publicly accessible.`);
      console.error('Response:', data.substring(0, 500));
      process.exit(1);
    }
    
    console.log('Doc fetched successfully. First 1000 chars:');
    console.log(data.substring(0, 1000));
    console.log('\n---\n');
    
    // Try to parse categories from the doc
    // Look for patterns like "Category: Puzzle" or "Game | Category"
    const lines = data.split('\n');
    const categories = new Set();
    const gameCategories = {};
    
    for(const line of lines){
      const match = line.match(/^\s*[A-Za-z0-9\s]+\s*\|\s*([A-Za-z\s]+)$/);
      if(match){
        const cat = match[1].trim();
        if(cat && cat.length > 0 && cat.length < 50){
          categories.add(cat);
        }
      }
    }
    
    console.log('Extracted categories:', Array.from(categories));
    process.exit(0);
  });
}).on('error', (e) => {
  console.error('Fetch error:', e.message);
  process.exit(1);
});
