#!/usr/bin/env node
// scripts/categorize_games.js
// Auto-categorize games based on title patterns

const fs = require('fs');
const path = require('path');

// Get repo root (parent of scripts dir)
const scriptDir = path.dirname(path.resolve(__filename));
const repoRoot = path.dirname(scriptDir);

const gamesJsonPath = path.join(repoRoot, 'public', 'games.json');
const games = JSON.parse(fs.readFileSync(gamesJsonPath, 'utf8'));

const categoryPatterns = {
  'Retro': /NES|SNES|Genesis|Sega|Atari|Arcade|Emulator|ROM|GBA|PSX|NES|ROM/i,
  'Clicker': /Clicker|Idle|Tycoon|Miner|Empire|Merchant|Trader|Builder|Manager|Farm|Factory|Incremental/i,
  'Action': /Shoot|Shooter|Gun|Weapon|Bomb|War|Battle|Combat|Fight|Duel|Strike|Attack|Raid|Assault|Blaster|Laser|Cannon|Rocket|Grenade|Mine|Trap|Snipe|Slasher|Mad|Rampage|Mayhem|Fury|Rampage/i,
  'Sports': /Soccer|Football|Basketball|Baseball|Tennis|Golf|Bowling|Hockey|Cricket|Volleyball|Badminton|Ping.Pong|Boxing|Wrestling|Karate|Skateboard|Snowboard|Skiing|Surfing|Billiards|Snooker|Dart|Curling|Lacrosse|Rugby|Handball|Dodgeball|Kickball|Kickboxing|MMA|UFC|Judo|Taekwondo|Sumo|Luge|Bobsled|Speedskating|Racquetball/i,
  'Puzzle': /Tetris|Sokoban|Portal|Bejeweled|Candy|Match|Block|Tile|Pipe|Maze|Puzzle|Chess|Checkers|Connect|Cube|Rubik|Solitaire|Mahjong|Sudoku|Crossword|Picross|Minesweeper|Jigsaw|Slider|Collapse|Blast|Bubble|Pop|Breaker/i,
  'Racing': /Race|Racing|Racer|Car|Drift|Drag|Rally|Speed|Track|Circuit|Grand|Turismo|Driver|Motorcycle|Bike|Truck|Bus|Taxi|Shuttle|Flight|Plane|Jet|Copter|Helicopter|Ship|Boat|Submarine|Highway|Road/i,
  'Platformer': /Mario|Sonic|Jump|Climb|Run|Fall|Platform|Parkour|Rope|Swing|Grapple|Jetpack|Wings|Flight|Sky|Tower|Ladder/i,
  'Multiplayer': /Battle|Royale|Arena|PvP|Online|Versus|Vs|Deathmatch|Team|Squad|Co.Op|Cooperative|Slither|Wormo|Agario|Agar|io|Krunker|versus|1v1|2v2/i,
  'RPG': /RPG|Roleplay|Dragon|Quest|Final.Fantasy|Fantasy|Dungeon|Crawler|Hack.Slash|ARPG|JRPG|Elder|Scroll|Fallout|Witcher|Skyrim|Diablo|Torchlight|Persona|Chrono|Legend/i,
  'Adventure': /Quest|Adventure|Journey|Explore|Cavern|Pyramid|Temple|Castle|Story|Legend|Tale|Saga|Epic|Odyssey|Expedition|Room|Escape/i,
  'Casual': /Candy|Sushi|Cafe|Restaurant|Diner|Kitchen|Cooking|Bake|Bakery|Pet|Cute|Adorable|Baby|Kitten|Puppy|Animal|Farm|Garden|Flower|Gardening|Papa|Diner/i,
};

const categories = new Set(Object.keys(categoryPatterns));

for(const game of games){
  for(const [cat, pattern] of Object.entries(categoryPatterns)){
    if(pattern.test(game.title)){
      game.category = cat;
      break;
    }
  }
  if(!game.category){
    game.category = 'Other';
  }
}

fs.writeFileSync(gamesJsonPath, JSON.stringify(games, null, 2), 'utf8');
console.log(`Categorized ${games.length} games.`);
console.log('Categories:', Array.from(categories).sort());

// Summary
const summary = {};
for(const game of games){
  summary[game.category] = (summary[game.category] || 0) + 1;
}
console.log('\nCategory breakdown:');
for(const [cat, count] of Object.entries(summary).sort((a, b) => b[1] - a[1])){
  console.log(`  ${cat}: ${count}`);
}
