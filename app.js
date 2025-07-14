let menu = 'mm'
let addstate = 'lection'
let currentKeyValue = ''
let currentValueValue = ''
let currentTValueValue = ''
let currentLectionValue = ''
let selectedLection = ''
let dataToTrain = []
let shuffledKeys = []
let db

document.addEventListener('keydown', async e => {
  const sel = document.getElementById('selection')
  sel.innerText = e.key
  sel.style.color = ['a','t','A','T','-','Enter'].includes(e.key) ? 'blue' : 'red'

  // MAIN MENU
  if (menu === 'mm') {
    if ((e.key === 'a' || e.key === 'A')) {
      showAddMenu()
    } else if ((e.key === 't' || e.key === 'T')) {
      showTrainMenu()
    }
  }

  // BACK TO MAIN
  if (e.key === '-') {
    hideAddMenu()
    hideTrainMenu()
    showMainMenu()
    sel.innerText = ''
  }

  // ADD MENU
  if (menu === 'am') handleAddMenu(e)

  // TRAIN MENU
  if (menu === 'tm') await handleTrainMenu(e)
})

// ——— Menu show/hide helpers ———

function showMainMenu() {
  document.getElementById('mm').style.display = 'block'
  menu = 'mm'
}

function hideAddMenu() {
  document.getElementById('am').style.display = 'none'
}

function hideTrainMenu() {
  document.getElementById('tm').style.display = 'none'
}

function showAddMenu() {
  hideTrainMenu()
  hideMainMenu()
  document.getElementById('am').style.display = 'block'
  menu = 'am'
  addstate = 'lection'
  currentLectionValue = ''
  currentKeyValue = ''
  currentValueValue = ''
  document.getElementById('lection').innerText = ''
  document.getElementById('key').innerText = ''
  document.getElementById('valuevalue').innerText = ''
  document.getElementById('value').style.display = 'none'
}

function showTrainMenu() {
  hideAddMenu()
  hideMainMenu()
  document.getElementById('tm').style.display = 'block'
  menu = 'tm'
  trainInit()
}

function hideMainMenu() {
  document.getElementById('mm').style.display = 'none'
}

// ——— Add menu logic ———

function handleAddMenu(e) {
  if (addstate === 'lection') {
    if (e.key === 'Backspace') currentLectionValue = currentLectionValue.slice(0,-1)
    else if (e.key === 'Enter') {
      addstate = 'key'
      document.getElementById('lectiont').style.color = 'white'
      e.preventDefault()
    }
    else if (e.key.length === 1) currentLectionValue += e.key
    document.getElementById('lection').innerText = currentLectionValue
  }
  else if (addstate === 'key') {
    if (e.key === 'Backspace') currentKeyValue = currentKeyValue.slice(0,-1)
    else if (e.key === 'Enter') {
      addstate = 'value'
      document.getElementById('key').style.color = 'white'
      document.getElementById('value').style.display = 'block'
      e.preventDefault()
    }
    else if (e.key.length === 1) currentKeyValue += e.key
    document.getElementById('key').innerText = currentKeyValue
  }
  else if (addstate === 'value') {
    if (e.key === 'Backspace') currentValueValue = currentValueValue.slice(0,-1)
    else if (e.key === 'Enter') {
      writeData(currentKeyValue, currentValueValue, currentLectionValue)
      currentKeyValue = ''
      currentValueValue = ''
      addstate = 'key'
      document.getElementById('key').innerText = ''
      document.getElementById('key').style.color = 'blue'
      document.getElementById('value').style.display = 'none'
      document.getElementById('valuevalue').innerText = ''
      e.preventDefault()
    }
    else if (e.key.length === 1) currentValueValue += e.key
    document.getElementById('valuevalue').innerText = currentValueValue
  }
}

// ——— Train menu logic ———

let trainstate = 'lection'
async function trainInit() {
  trainstate = 'lection'
  currentLectionValue = ''
  selectedLection = ''
  document.getElementById('tlection').innerText = ''
  document.getElementById('tlectiont').style.color = 'white'
  document.getElementById('tkey').innerText = ''
  document.getElementById('tvalue').innerText = '???'
  document.getElementById('trainfooter').innerText = mkbanner('0/0',45)
}

async function handleTrainMenu(e) {
  if (trainstate === 'lection') {
    if (e.key === 'Backspace') currentLectionValue = currentLectionValue.slice(0,-1)
    else if (e.key === 'Enter') {
      const lections = await readAllLections()
      if (lections.includes(currentLectionValue)) {
        selectedLection = currentLectionValue
        document.getElementById('tlectiont').style.color = 'white'
        document.getElementById('tlection').innerText = selectedLection
        dataToTrain = await readLectionData(selectedLection)
        shuffledKeys = dataToTrain.map(x=>x.key).sort(()=>Math.random()-.5)
        trainstate = 'quiz'
        nextQuestion()
      } else {
        document.getElementById('tlectiont').style.color = 'red'
      }
      e.preventDefault()
    }
    else if (e.key.length === 1) currentLectionValue += e.key
    document.getElementById('tlection').innerText = currentLectionValue
  }
  else if (trainstate === 'quiz') {
    if (e.key === 'Backspace') currentTValueValue = currentTValueValue.slice(0,-1)
    else if (e.key === 'Enter') {
      await checkAnswer()
      e.preventDefault()
    }
    else if (e.key.length===1||e.key===' ') currentTValueValue += e.key
    document.getElementById('tvalue').innerText = currentTValueValue||'???'
  }
}

function nextQuestion() {
  if (!shuffledKeys.length) {
    document.getElementById('trainfooter').innerText = mkbanner('Finished!',45)
    document.getElementById('tkey').innerText = ''
    document.getElementById('tvalue').innerText = ''
    return
  }
  const key = shuffledKeys.pop()
  currentTValueValue = ''
  document.getElementById('tkey').innerText = key
  document.getElementById('tvalue').innerText = '???'
  const done = dataToTrain.length - shuffledKeys.length
  document.getElementById('trainfooter').innerText = mkbanner(`${done}/${dataToTrain.length}`,45)
}

async function checkAnswer() {
  const key = document.getElementById('tkey').innerText
  const correct = await getData(key)
  const tval = currentTValueValue.trim()
  const tvElt = document.getElementById('tvalue')
  tvElt.style.color = tval===correct ? 'green' : 'red'
  setTimeout(()=>{
    tvElt.style.color = 'blue'
    nextQuestion()
  },500)
}

// ——— Banner init ———

function mkbanner(text,width) {
  const pad = width - text.length
  const l = Math.floor(pad/2), r = Math.ceil(pad/2)
  return '-'.repeat(l) + text + '-'.repeat(r)
}

document.getElementById('vocbanner').innerText = mkbanner('TinyVoc',45)
document.getElementById('addbanner').innerText = mkbanner('Add vocabulary',45)
document.getElementById('trainbanner').innerText = mkbanner('Train vocabulary',45)
document.getElementById('vocfooter').innerText = mkbanner('',45)
document.getElementById('addfooter').innerText = mkbanner('',45)
document.getElementById('trainfooter').innerText = mkbanner('0/0',45)

// ——— IndexedDB & data helpers ———

function initDB() {
  const req = indexedDB.open('vocTrainerDB',1)
  req.onupgradeneeded = e=>{
    db = e.target.result
    if (!db.objectStoreNames.contains('vocabulary')) {
      db.createObjectStore('vocabulary',{ keyPath:'key' })
    }
  }
  req.onsuccess = e=>{ db = e.target.result }
  req.onerror = e=>console.log('DB error',e)
}

function writeData(key,value,lection) {
  if (!db) return
  const tx = db.transaction('vocabulary','readwrite')
  const store = tx.objectStore('vocabulary')
  store.put({ key,value,lection })
}

function getData(key) {
  return new Promise((res,rej)=>{
    if (!db) return rej()
    const tx = db.transaction('vocabulary','readonly')
    const store = tx.objectStore('vocabulary')
    const rq = store.get(key)
    rq.onsuccess = ()=>res(rq.result?.value||'')
    rq.onerror = ()=>rej()
  })
}

function readAllData() {
  return new Promise((res,rej)=>{
    if (!db) return rej()
    const tx = db.transaction('vocabulary','readonly')
    const store = tx.objectStore('vocabulary')
    const rq = store.getAll()
    rq.onsuccess = ()=>res(rq.result)
    rq.onerror = ()=>rej()
  })
}

async function readAllLections() {
  const all = await readAllData()
  return [...new Set(all.map(x=>x.lection))]
}

async function readLectionData(lection) {
  const all = await readAllData()
  return all.filter(x=>x.lection===lection)
}

initDB()
