#!/usr/bin/env node
// scripts/fix_game_titles.js
// Maps game IDs to human-readable titles using intelligent conversion

const fs = require('fs');

// Human-readable title mappings for known games
const titleMap = {
  'clhappywheels': 'Happy Wheels',
  'clslither': 'Slither.io',
  'clsurviv': 'Surviv.io',
  'clagario': 'Agar.io',
  'cldiepie': 'Diep.io',
  'clspaceba': 'Spacebar Clicker',
  'cl2048': '2048',
  'clfla': 'Flappy Bird',
  'clpac': 'Pac-Man',
  'cldon': 'Donkey Kong',
  'clsuper': 'Super',
  'clson': 'Sonic',
  'clzel': 'Legend of Zelda',
  'clmet': 'Metroid',
  'clcas': 'Castlevania',
  'clbom': 'Bomberman',
  'clfin': 'Final Fantasy',
  'cldra': 'Dragon',
  'clmeg': 'Mega Man',
  'clstr': 'Street Fighter',
  'clmor': 'Mortal Kombat',
  'cltor': 'Tomb Raider',
  'clres': 'Resident Evil',
  'clsil': 'Silent Hill',
  'cldoo': 'DOOM',
  'clqua': 'Quake',
  'clhal': 'Half Life',
  'clcou': 'Counter Strike',
  'clcs': 'Counter Strike',
  'clgta': 'Grand Theft Auto',
  'clmin': 'Minecraft',
  'clter': 'Terraria',
  'clsta': 'Stardew Valley',
  'clcel': 'Celeste',
  'clhol': 'Hollow Knight',
  'clcup': 'Cuphead',
  'clsmash': 'Super Smash Bros',
  'clpok': 'Pokémon',
  'cldig': 'Digimon',
  'clyu': 'Yu Gi Oh',
  'clmag': 'Magic',
  'clcol': 'Colosseum',
  'clblo': 'Bloons',
  'clfnf': 'Friday Night Funkin',
  'clpap': 'Papa',
};

function idToReadableTitle(id) {
  // Check if we have a mapping
  const lcId = id.toLowerCase();
  for(const [prefix, name] of Object.entries(titleMap)){
    if(lcId.startsWith(prefix)){
      return name;
    }
  }
  
  // Smart conversion from camelCase/lowercase
  let title = id.replace(/^cl/, ''); // Remove 'cl' prefix
  
  // Add spaces intelligently:
  // Before uppercase letters that follow lowercase
  title = title.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Between letter and number
  title = title.replace(/([a-zA-Z])(\d)/g, '$1 $2');
  title = title.replace(/(\d)([a-zA-Z])/g, '$1 $2');
  
  // Handle underscores and hyphens as word separators
  title = title.replace(/[_-]/g, ' ');
  
  // Split and clean
  const words = title
    .split(/\s+/)
    .filter(w => w && w.length > 0)
    .map(w => {
      // If it's all caps and longer than 1 char, keep as acronym
      if(w.length > 1 && /^[A-Z]+$/.test(w)) return w;
      // Otherwise: capitalize first, lowercase rest
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });
  
  return words.join(' ') || id;
}

const games = JSON.parse(fs.readFileSync('public/games.json', 'utf8'));

// Update titles
for(const game of games){
  game.title = idToReadableTitle(game.id);
  // Update thumbnail text to match new title
  game.thumbnail = `https://via.placeholder.com/400x240?text=${encodeURIComponent(game.title)}`;
}

fs.writeFileSync('public/games.json', JSON.stringify(games, null, 2), 'utf8');
console.log(`Updated ${games.length} game titles.`);

// Show samples
console.log('\nSample titles:');
games.slice(0, 10).forEach(g => console.log(`  ${g.id} → ${g.title}`));

// Check for specific games
const happy = games.find(g => g.id === 'clhappywheels');
if(happy) console.log(`\n✓ Found: ${happy.id} → ${happy.title}`);
const slither = games.find(g => g.id.includes('slither'));
if(slither) console.log(`✓ Found: ${slither.id} → ${slither.title}`);
