let menu = "mm"
let addstate = "key"
let currentKeyValue = ""
let currentValueValue = ""
let currentTValueValue = ""
let currentRandomKey = ""
let db

document.addEventListener("keydown", async e => {
  const selection = document.getElementById("selection")
  selection.innerText = e.key
  selection.style.color = ["a", "t", "A", "T", "-", "Enter"].includes(e.key) ? "blue" : "red"

  if ((e.key === "a" || e.key === "A") && menu === "mm") {
    document.getElementById("mm").style.display = "none"
    document.getElementById("am").style.display = "block"
    menu = "am"

    currentKeyValue = ""
    currentValueValue = ""
    document.getElementById("key").innerText = ""
    document.getElementById("valuevalue").innerText = ""
    addstate = "key"
    document.getElementById("value").style.display = "none"

  } else if ((e.key === "t" || e.key === "T") && menu === "mm") {
    document.getElementById("mm").style.display = "none"
    document.getElementById("tm").style.display = "block"
    menu = "tm"

    // Get a random key 
    const allData = await readAllData()
    if (allData.length > 0) {
      const randomIndex = Math.floor(Math.random() * allData.length)
      currentRandomKey = allData[randomIndex].key
      document.getElementById("tkey").innerText = currentRandomKey
      document.getElementById("tvalue").innerText = "???"
      currentTValueValue = ""
    } else {
      document.getElementById("tkey").innerText = "No vocabulary yet!"
      document.getElementById("tvalue").innerText = ""
    }
  }

  if (e.key === "-") {
    if (menu === "am") {
      document.getElementById("am").style.display = "none"
    } else if (menu === "tm") {
      document.getElementById("tm").style.display = "none"
    }
    document.getElementById("mm").style.display = "block"
    selection.innerText = ""
    menu = "mm"
  }

  // Add Menu Logic
  if (menu === "am") {
    if (addstate === "key") {
      if (e.key === "Backspace") {
        currentKeyValue = currentKeyValue.slice(0, -1)
      } else if (e.key === " ") {
        currentKeyValue += " "
      } else if (e.key === "Enter") {
        addstate = "value"
        document.getElementById("key").style.color = "white"
        document.getElementById("value").style.display = "block"
        e.preventDefault()
      } else if (e.key.length === 1) {
        currentKeyValue += e.key
      }
      document.getElementById("key").innerText = currentKeyValue

    } else if (addstate === "value") {
      if (e.key === "Backspace") {
        currentValueValue = currentValueValue.slice(0, -1)
      } else if (e.key === " ") {
        currentValueValue += " "
      } else if (e.key === "Enter") {
        writeData(currentKeyValue, currentValueValue)

        // Reset after submission
        currentKeyValue = ""
        currentValueValue = ""
        addstate = "key"
        document.getElementById("key").innerText = ""
        document.getElementById("key").style.color = "blue"
        document.getElementById("value").style.display = "none"
        document.getElementById("valuevalue").innerText = ""
        e.preventDefault()
      } else if (e.key.length === 1) {
        currentValueValue += e.key
      }

      document.getElementById("valuevalue").innerText = currentValueValue
    }
  }

  // Training Menu Logic
  if (menu === "tm") {
    if (currentRandomKey) {
      if (e.key === "Enter") {
        // Check the answer
        const correctValue = await getData(currentRandomKey)
        if (currentTValueValue.trim() === correctValue) {
          document.getElementById("tvalue").style.color = "green"
          document.getElementById("tvalue").innerText = "Correct!"
        } else {
          document.getElementById("tvalue").style.color = "red"
          document.getElementById("tvalue").innerText = `Incorrect!`
        }
        setTimeout(async () => {
          // Get a new random key
          const allData = await readAllData()
          if (allData.length > 0) {
            const randomIndex = Math.floor(Math.random() * allData.length)
            currentRandomKey = allData[randomIndex].key
            document.getElementById("tkey").innerText = currentRandomKey
            document.getElementById("tvalue").innerText = "???"
            currentTValueValue = ""
            document.getElementById("tvalue").style.color = "blue"

          }
        }, 350)
        e.preventDefault()
      } else if (e.key === "Backspace") {
        currentTValueValue = currentTValueValue.slice(0, -1)
        document.getElementById("tvalue").innerText = currentTValueValue || "???"
      } else if (e.key === " ") {
        currentTValueValue += " "
        document.getElementById("tvalue").innerText = currentTValueValue
      } else if (e.key.length === 1) {
        currentTValueValue += e.key
        document.getElementById("tvalue").innerText = currentTValueValue
      }
    }
  }
})

function mkbanner(thing, lthing) {
  const padding = lthing - thing.length
  const left = Math.floor(padding / 2)
  const right = Math.ceil(padding / 2)
  return '-'.repeat(left) + thing + '-'.repeat(right)
}

// Initialize banners
document.getElementById("vocbanner").innerText = mkbanner("TinyVoc", 45)
document.getElementById("addbanner").innerText = mkbanner("Add vocabulary", 45)
document.getElementById("trainbanner").innerText = mkbanner("Train vocabulary", 45)
document.getElementById("trainfooter").innerText = mkbanner("", 45)
document.getElementById("vocfooter").innerText = mkbanner("", 45)
document.getElementById("addfooter").innerText = mkbanner("", 45)

// IndexedDB functions
function initDB() {
  const request = indexedDB.open("vocTrainerDB", 1)

  request.onerror = e => console.log("DB error", e)

  request.onupgradeneeded = e => {
    db = e.target.result
    if (!db.objectStoreNames.contains("vocabulary")) {
      db.createObjectStore("vocabulary", { keyPath: "key" })
    }
  }

  request.onsuccess = e => {
    db = e.target.result
    console.log("DB initialized")
  }
}

function writeData(key, value) {
  if (!db) {
    console.log("DB not initialized yet")
    return
  }
  const tx = db.transaction(["vocabulary"], "readwrite")
  const store = tx.objectStore("vocabulary")
  const data = { key: key, value: value }
  store.put(data)

  tx.oncomplete = () => console.log("Data written:", data)
  tx.onerror = e => console.log("Write error", e)
}

function getData(key) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("DB not initialized")
      return
    }
    const tx = db.transaction(["vocabulary"], "readonly")
    const store = tx.objectStore("vocabulary")
    const request = store.get(key)

    request.onsuccess = () => {
      resolve(request.result ? request.result.value : null)
    }
    request.onerror = e => reject(e)
  })
}

async function readAllData() {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("DB not initialized")
      return
    }
    const tx = db.transaction(["vocabulary"], "readonly")
    const store = tx.objectStore("vocabulary")
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = e => reject(e)
  })
}

initDB()