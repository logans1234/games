const resultsEl = document.getElementById('results')
const searchEl = document.getElementById('search')
const categoryFilter = document.getElementById('categoryFilter')
const modal = document.getElementById('playerModal')
const closeBtn = document.getElementById('closeBtn')
const gameFrame = document.getElementById('gameFrame')

let games = []
let fuse = null
let currentGame = null

async function loadGames(){
  const res = await fetch('public/games.json')
  games = await res.json()
  // populate categories
  const cats = new Set(games.map(g => g.category || 'Uncategorized'))
  for(const c of cats){
    const opt = document.createElement('option')
    opt.value = c
    opt.textContent = c
    categoryFilter.appendChild(opt)
  }

  // Fuse for name-only search
  fuse = new Fuse(games, { keys:['title'], threshold:0.3 })
  renderResults(games)
}

function renderResults(list){
  resultsEl.innerHTML = ''
  if(list.length === 0){ resultsEl.innerHTML = '<p style="padding:20px">No games found</p>'; return }
  for(const g of list){
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
      <img src="${g.thumbnail}" alt="${g.title}">
      <div><strong>${g.title}</strong></div>
      <div class="meta"><span>${g.category}</span><span>${g.author||''}</span></div>`
    card.addEventListener('click', ()=>openGame(g))
    resultsEl.appendChild(card)
  }
}

function openGame(g){
  currentGame = g
  gameFrame.src = g.path
  modal.classList.remove('hidden')
}

closeBtn.addEventListener('click', ()=>{ modal.classList.add('hidden'); gameFrame.src = '' ; currentGame = null })

// Download behavior removed — games play directly in the iframe without forced downloads.

searchEl.addEventListener('input', ()=>{
  const q = searchEl.value.trim()
  const cat = categoryFilter.value
  let filtered = games
  if(cat) filtered = filtered.filter(g=>g.category===cat)
  if(q.length===0) return renderResults(filtered)
  const res = fuse.search(q).map(r=>r.item)
  // maintain category filter on search results
  renderResults(res.filter(g=>!cat || g.category===cat))
})

categoryFilter.addEventListener('change', ()=>{
  const q = searchEl.value.trim()
  if(q.length>0){ searchEl.dispatchEvent(new Event('input')); return }
  const cat = categoryFilter.value
  if(!cat) return renderResults(games)
  renderResults(games.filter(g=>g.category===cat))
})

loadGames()
