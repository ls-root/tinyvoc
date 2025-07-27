let menu = "mm"
let addstate = "lection"
let viewstate = "none"
let currentKeyValue = ""
let currentValueValue = ""
let currentTValueValue = ""
let currentLectionValue = ""
let currentTransformValue = ""
let currentActionValue = ""
let currentParamValue = ""
let currentParam2Value = ""
let currentSourceValue = ""
let correctState = "lection"
let currentLectionCValue = ""
let currentIdCValue = ""
let currentKeyCValue = ""
let currentValueCValue = ""
let currentDestinationValue = ""
let selectedLection = ""
let generateState = "transform"
let moveState = "source"
let dataToTrain = []
let shuffledKeys = []
let uniqueKeyChar = " "
let trainstate = "lection"
let wrongAttempts = new Map()
let currentKey = ""
let db
let AvabialeModes = Array.from({ length: 5 }, (e, i) => i)
let trainStats = {
  totalCorrect: 0,
  totalWrong: 0,
  hardestWord: { key: "", attempts: 0 },
}
let GenerateModesDescription = {
  0: "Sort",
  1: "Reverse",
  2: "Remove all under specified value",
  3: "Remove all over specified value",
  4: "Strip down to specified value",
}
let GenerateModesParams = {
  0: 1,
  1: 0,
  2: 2,
  3: 2,
  4: 1,
}

document.addEventListener("keydown", async (e) => {
  // Prevent firefox from starting Quick Search with /
  if (e.key === "/") {
    e.preventDefault()
  }
  const sel = document.getElementById("selection")
  sel.innerText = e.key
  sel.style.color = [
    "a",
    "t",
    "A",
    "T",
    "e",
    "E",
    "i",
    "I",
    "v",
    "V",
    "g",
    "G",
    "m",
    "M",
    "l",
    "L",
    "c",
    "C",
    "-",
    "Enter",
  ].includes(e.key)
    ? "blue"
    : "red"

  // MAIN MENU
  if (menu === "mm") {
    if (e.key === "a" || e.key === "A") {
      showAddMenu()
    } else if (e.key === "t" || e.key === "T") {
      showTrainMenu()
    } else if (e.key === "e" || e.key === "E") {
      download(JSON.stringify(await readAllData()))
    } else if (e.key === "i" || e.key === "I") {
      getFile()
    } else if (e.key === "v" || e.key === "V") {
      showViewMenu()
    } else if (e.key === "g" || e.key === "G") {
      showGenerateMenu()
    } else if (e.key === "m" || e.key === "M") {
      showMoveMenu()
    } else if (e.key === "l" || e.key === "L") {
      showLectionsMenu()
    } else if (e.key === "c" || e.key === "C") {
      showCorrectMenu()
    }
  }

  // BACK TO MAIN
  if (e.key === "-") {
    hideAddMenu()
    hideTrainMenu()
    hideViewMenu()
    hideGenerateMenu()
    hideMoveMenu()
    hideLectionsMenu()
    hideCorrectMenu()
    showMainMenu()
    sel.innerText = ""
  }

  // ADD MENU
  if (menu === "am") handleAddMenu(e)

  // TRAIN MENU
  if (menu === "tm") await handleTrainMenu(e)

  // VIEW MENU
  if (menu === "vm") await handleViewMenu(e)

  // GENERATE MENU
  if (menu === "gm") handleGenerateMenu(e)

  // MOVE MENU
  if (menu === "mvm") handleMoveMenu(e)

  // CORRECT MENU
  if (menu === "cm") handleCorrectMenu(e)
})

// ——— Menu show/hide helpers ———

function showMainMenu() {
  document.getElementById("mm").style.display = "block"
  menu = "mm"
}

function hideAddMenu() {
  document.getElementById("am").style.display = "none"
}

function hideTrainMenu() {
  document.getElementById("tm").style.display = "none"
}

function hideGenerateMenu() {
  document.getElementById("gm").style.display = "none"
}

function hideCorrectMenu() {
  document.getElementById("cm").style.display = "none"
}

function hideLectionsMenu() {
  document.getElementById("lm").style.display = "none"
}

function hideMoveMenu() {
  document.getElementById("mvm").style.display = "none"
}

function showAddMenu() {
  hideTrainMenu()
  hideMainMenu()
  hideGenerateMenu()
  hideViewMenu()
  hideMoveMenu()
  hideCorrectMenu()
  document.getElementById("am").style.display = "block"
  menu = "am"
  addstate = "lection"
  currentLectionValue = ""
  currentKeyValue = ""
  currentValueValue = ""
  document.getElementById("lection").innerText = ""
  document.getElementById("key").innerText = ""
  document.getElementById("valuevalue").innerText = ""
  document.getElementById("value").style.display = "none"
}

function showCorrectMenu() {
  currentIdValue = ""
  currentKeyCValue = ""
  currentValueCValue = ""
  currentLectionCValue = ""
  document.getElementById("idc").innerText = ""
  document.getElementById("keyc").innerText = ""
  document.getElementById("valuec").innerText = ""
  document.getElementById("lectionc").innerText = ""
  menu = "cm"
  hideMainMenu()
  document.getElementById("cm").style.display = "block"
}

async function showLectionsMenu() {
  document.getElementById("lm").style.display = "block"
  hideMainMenu()
  // Render articles
  document.getElementById("lectionview").innerHTML = ""
  const lections = await readAllLections()
  lections.forEach((item) => {
    const p = document.createElement("p")
    p.innerText = item
    document.getElementById("lectionview").appendChild(p)
  })
  menu = "lm"
}

function showTrainMenu() {
  hideAddMenu()
  hideMainMenu()
  hideGenerateMenu()
  document.getElementById("tm").style.display = "block"
  menu = "tm"
  trainInit()
}

function showMoveMenu() {
  hideTrainMenu()
  hideAddMenu()
  hideGenerateMenu()
  hideMainMenu()
  document.getElementById("mvm").style.display = "block"
  menu = "mvm"
}

function hideMainMenu() {
  document.getElementById("mm").style.display = "none"
}

function hideViewMenu() {
  document.getElementById("vm").style.display = "none"
}

function showGenerateMenu() {
  document.getElementById("gm").style.display = "block"
  menu = "gm"
  hideMainMenu()

  currentTransformValue = ""
  currentActionValue = ""
  currentParamValue = ""
  currentParam2Value = ""
  generateState = "transform"

  const transformEl = document.getElementById("transformt")
  const actionEl = document.getElementById("actiont")
  const paramEl = document.getElementById("paramt")
  const param2El = document.getElementById("param2t")

  transformEl.innerText = ""
  transformEl.style.color = "blue"
  actionEl.innerText = ""
  actionEl.style.color = "blue"
  paramEl.innerText = ""
  paramEl.style.color = "blue"
  param2El.innerText = ""
  param2El.style.color = "blue"
}
async function showViewMenu() {
  hideMainMenu()
  document.getElementById("vm").style.display = "block"
  resetView()

  menu = "vm"
  viewstate = "lection"
  currentLectionValue = ""
  const ilectionSelect = document.getElementById("ilectionSelect")
  ilectionSelect.innerText = ""
  ilectionSelect.style.color = "blue"
}

// ——— Correct menu logic ———
async function handleCorrectMenu(e) {
  if (correctState === "lection") {
    if (e.key === "Backspace") {
      currentLectionCValue = currentLectionCValue.slice(0, -1)
    } else if (e.key === "Enter") {
      const lections = await readAllLections()
      if (lections.includes(currentLectionCValue)) {
        document.getElementById("lectionc").style.color = "white"
        correctState = "id"
        document.getElementById("idc").style.color = "blue"
      } else {
        document.getElementById("lectionc").style.color = "red"
      }
      e.preventDefault()
    } else if (e.key.length === 1) {
      currentLectionCValue += e.key
    }
    document.getElementById("lectionc").innerText = currentLectionCValue
  } else if (correctState === "id") {
    if (e.key === "Backspace") {
      currentIdCValue = currentIdCValue.slice(0, -1)
    } else if (e.key === "Enter") {
      const idNum = parseInt(currentIdCValue)
      if (!isNaN(idNum)) {
        const lectionData = await readLectionData(currentLectionCValue)
        const entryExists = lectionData.find((item) => item.id === idNum)
        if (entryExists) {
          document.getElementById("idc").style.color = "white"
          correctState = "key"
          document.getElementById("keyc").style.color = "blue"
          currentKeyCValue = entryExists.vocabWord
          currentValueCValue = entryExists.value

          document.getElementById("keyc").innerText = currentKeyCValue
          document.getElementById("valuec").innerText = currentValueCValue
        } else {
          document.getElementById("idc").style.color = "red"
        }
      } else {
        document.getElementById("idc").style.color = "red"
      }
      e.preventDefault()
    } else if (e.key.length === 1) {
      currentIdCValue += e.key
    }
    document.getElementById("idc").innerText = currentIdCValue
  } else if (correctState === "key") {
    if (e.key === "Backspace") {
      currentKeyCValue = currentKeyCValue.slice(0, -1)
    } else if (e.key === "Enter") {
      document.getElementById("keyc").style.color = "white"
      correctState = "value"
      document.getElementById("valuec").style.color = "blue"
      e.preventDefault()
    } else if (e.key.length === 1) {
      currentKeyCValue += e.key
    }
    document.getElementById("keyc").innerText = currentKeyCValue
  } else if (correctState === "value") {
    if (e.key === "Backspace") {
      currentValueCValue = currentValueCValue.slice(0, -1)
    } else if (e.key === "Enter") {
      await updateVocabularyEntry(
        parseInt(currentIdCValue),
        currentKeyCValue,
        currentValueCValue,
      )

      document.getElementById("valuec").style.color = "white"
      correctState = "id"
      currentIdCValue = ""
      currentKeyCValue = ""
      currentValueCValue = ""

      document.getElementById("idc").innerText = ""
      document.getElementById("keyc").innerText = ""
      document.getElementById("valuec").innerText = ""
      document.getElementById("idc").style.color = "blue"
      document.getElementById("keyc").style.color = "blue"
      document.getElementById("valuec").style.color = "blue"

      e.preventDefault()
    } else if (e.key.length === 1) {
      currentValueCValue += e.key
    }
    document.getElementById("valuec").innerText = currentValueCValue
  }
}
async function updateVocabularyEntry(id, newVocabWord, newValue) {
  return new Promise((resolve, reject) => {
    if (!db) return reject("Database not available")

    const tx = db.transaction("vocabulary", "readwrite")
    const store = tx.objectStore("vocabulary")
    const rq = store.get(id)

    rq.onsuccess = () => {
      const data = rq.result
      if (data) {
        data.vocabWord = newVocabWord
        data.value = newValue
        const updateRq = store.put(data)

        updateRq.onsuccess = () => {
          resolve()
        }
        updateRq.onerror = () => reject(updateRq.error)
      } else {
        reject("Entry not found")
      }
    }
    rq.onerror = () => reject(rq.error)
  })
}

// ——— View menu logic ---

async function handleViewMenu(e) {
  if (viewstate === "lection") {
    if (e.key === "Backspace")
      currentLectionValue = currentLectionValue.slice(0, -1)
    else if (e.key === "Enter") {
      const ilectionSelect = document.getElementById("ilectionSelect")
      ilectionSelect.style.color = "white"

      let data
      if (currentLectionValue.toLowerCase() === "all") {
        data = await readAllData()
      } else {
        const lections = await readAllLections()
        if (lections.includes(currentLectionValue)) {
          data = await readLectionData(currentLectionValue)
        } else {
          ilectionSelect.style.color = "red"
          return
        }
      }

      resetView()
      data.sort((a, b) => a.id - b.id)
      data.forEach((element) => {
        addToView(
          element.id,
          element.vocabWord,
          element.value,
          element.lection,
          element.right,
          element.wrong,
        )
      })

      viewstate = "done"
      e.preventDefault()
    } else if (e.key.length === 1) currentLectionValue += e.key
    document.getElementById("ilectionSelect").innerText = currentLectionValue
  }
}

// ——— Add menu logic ———

function handleAddMenu(e) {
  if (addstate === "lection") {
    if (e.key === "Backspace")
      currentLectionValue = currentLectionValue.slice(0, -1)
    else if (e.key === "Enter") {
      addstate = "key"
      document.getElementById("lectiont").style.color = "white"
      e.preventDefault()
    } else if (e.key.length === 1) currentLectionValue += e.key
    document.getElementById("lection").innerText = currentLectionValue
  } else if (addstate === "key") {
    if (e.key === "Backspace") currentKeyValue = currentKeyValue.slice(0, -1)
    else if (e.key === "Enter") {
      addstate = "value"
      document.getElementById("key").style.color = "white"
      document.getElementById("value").style.display = "block"

      e.preventDefault()
    } else if (e.key.length === 1) currentKeyValue += e.key
    document.getElementById("key").innerText = currentKeyValue
  } else if (addstate === "value") {
    if (e.key === "Backspace")
      currentValueValue = currentValueValue.slice(0, -1)
    else if (e.key === "Enter") {
      writeData(currentKeyValue, currentValueValue, currentLectionValue)
      currentKeyValue = ""
      currentValueValue = ""
      addstate = "key"
      document.getElementById("key").innerText = ""
      document.getElementById("key").style.color = "blue"
      document.getElementById("value").style.display = "none"
      document.getElementById("valuevalue").innerText = ""
      e.preventDefault()
    } else if (e.key.length === 1) currentValueValue += e.key
    document.getElementById("valuevalue").innerText = currentValueValue
  }
}

// --- Generate menu logic ---
async function handleGenerateMenu(e) {
  const transformEl = document.getElementById("transformt")
  const actionEl = document.getElementById("actiont")
  const paramEl = document.getElementById("paramt")
  const param2El = document.getElementById("param2t")
  const param2Inp = document.getElementById("param2")
  const param1Inp = document.getElementById("param")

  if (generateState === "transform") {
    if (e.key === "Backspace") {
      currentTransformValue = currentTransformValue.slice(0, -1)
    } else if (e.key === "Enter") {
      const lections = await readAllLections()
      if (lections.includes(currentTransformValue)) {
        currentLectionValue = currentTransformValue
        transformEl.style.color = "white"
        generateState = "action"
      } else {
        transformEl.style.color = "red"
      }
      e.preventDefault()
    } else if (e.key.length === 1) {
      currentTransformValue += e.key
    }
    y
    transformEl.innerText = currentTransformValue
  } else if (generateState === "action") {
    if (e.key === "Backspace") {
      currentActionValue = currentActionValue.slice(0, -1)
    } else if (e.key === "Enter") {
      const n = Number(currentActionValue)
      if (!isNaN(n) && AvabialeModes.includes(n)) {
        actionEl.innerText = GenerateModesDescription[n]
        actionEl.style.color = "white"
        const needed = GenerateModesParams[n]
        if (needed === 0) {
          GenerateList(n, null, null, currentLectionValue)
        } else if (needed === 1) {
          param1Inp.style.display = "block"
          generateState = "param"
        } else {
          param1Inp.style.display = "block"
          param2Inp.style.display = "block"
          generateState = "param"
        }
      } else {
        actionEl.style.color = "red"
      }
      e.preventDefault()
    } else if (e.key.length === 1) {
      currentActionValue += e.key
    }
    actionEl.innerText = currentActionValue
  } else if (generateState === "param") {
    if (e.key === "Backspace") {
      currentParamValue = currentParamValue.slice(0, -1)
    } else if (e.key === "Enter") {
      paramEl.style.color = "white"
      const actionNum = Number(currentActionValue)
      if (GenerateModesParams[actionNum] === 1) {
        GenerateList(actionNum, currentParamValue, null, currentLectionValue)
      } else {
        generateState = "param2"
      }
      e.preventDefault()
    } else if (e.key.length === 1) {
      currentParamValue += e.key
    }
    paramEl.innerText = currentParamValue
  } else if (generateState === "param2") {
    if (e.key === "Backspace") {
      currentParam2Value = currentParam2Value.slice(0, -1)
    } else if (e.key === "Enter") {
      param2El.style.color = "white"
      const actionNum = Number(currentActionValue)
      GenerateList(
        actionNum,
        currentParamValue,
        currentParam2Value,
        currentLectionValue,
      )
      e.preventDefault()
    } else if (e.key.length === 1) {
      currentParam2Value += e.key
    }
    param2El.innerText = currentParam2Value
  }
}

async function GenerateList(action, param, param2, lection) {
  console.log("Generating list")
  console.log("Action: ", action)
  console.log("Param: ", param)
  console.log("Param2: ", param2)
  alert(lection)
  const data = await readLectionData(lection)
  let result = []

  if (action == 0) {
    // Sort
    const sortProp = param || "key"
    result = [...data].sort((a, b) => {
      if (["right", "wrong", "weight"].includes(sortProp)) {
        return (a[sortProp] || 0) - (b[sortProp] || 0)
      }
      return String(a[sortProp]).localeCompare(String(b[sortProp]))
    })
  } else if (action == 1) {
    // Reverse
    console.log("data:", data)
    result = [...data].reverse()

    console.log("result:", result)
  } else if (action == 2) {
    // Remove all under specified value
    const num = Number(param)
    result = data.filter((entry) => Number(entry[param2]) > num)
  } else if (action == 3) {
    // Remove all ober specified value
    const num = Number(param)
    result = data.filter((entry) => Number(entry[param2]) < num)
  } else if (action == 4) {
    // Strip down to specified value (keep only top N entries)
    const n = Number(param)
    result = data.slice(0, n)
  }
  let target = lection + "t"
  const allLections = await readAllLections()
  while (allLections.includes(target)) {
    target += "t"
  }

  result.forEach((item) => {
    writeData(item.key, item.value, target)
  })

  document.getElementById("ttransto").innerText = target
  return result
}

// --- Move menu logic ---
async function handleMoveMenu(e) {
  const sourceEl = document.getElementById("tsource")
  const destinationEl = document.getElementById("tdest")

  if (moveState === "source") {
    if (e.key === "Backspace") {
      currentSourceValue = currentSourceValue.slice(0, -1)
    } else if (e.key === "Enter") {
      const lections = await readAllLections()
      if (lections.includes(currentSourceValue)) {
        sourceEl.style.color = "white"
        moveState = "destination"
      } else {
        sourceEl.style.color = "red"
      }
    } else if (e.key.length === 1) {
      currentSourceValue += e.key
    }
  } else if (moveState === "destination") {
    if (e.key === "Backspace") {
      currentDestinationValue = currentDestinationValue.slice(0, -1)
    } else if (e.key === "Enter") {
      destinationEl.style.color = "white"
      moveState = ""

      // IDK if this is really "prettier"
      document.getElementById("msuc").innerHTML =
        "Moved <strong>" +
        currentSourceValue +
        "</strong> -> <strong>" +
        currentDestinationValue +
        "</strong>"

      await renameLection(currentSourceValue, currentDestinationValue)
    } else if (e.key.length === 1) {
      currentDestinationValue += e.key
    }
  }
  destinationEl.innerText = currentDestinationValue
  sourceEl.innerText = currentSourceValue
}

// ——— Train menu logic ———

async function trainInit() {
  trainstate = "lection"
  currentLectionValue = ""
  selectedLection = ""
  wrongAttempts.clear()
  currentKey = ""
  trainStats = {
    totalCorrect: 0,
    totalWrong: 0,
    hardestWord: { key: "", attempts: 0 },
  }
  document.getElementById("tlection").innerText = ""
  document.getElementById("tlectiont").style.color = "white"
  document.getElementById("tkey").innerText = ""
  document.getElementById("tkey").style.color = "blue"
  document.getElementById("tvalue").innerText = "???"
  document.getElementById("trainfooter").innerText = mkbanner("0/0", 45, "-")
  document.getElementById("stats").style.display = "none"
  document.getElementById("nstats").style.display = "block"
}

async function handleTrainMenu(e) {
  if (trainstate === "lection") {
    if (e.key === "Backspace")
      currentLectionValue = currentLectionValue.slice(0, -1)
    else if (e.key === "Enter") {
      const lections = await readAllLections()
      if (lections.includes(currentLectionValue)) {
        selectedLection = currentLectionValue
        document.getElementById("tlection").style.color = "white"
        document.getElementById("tlection").innerText = selectedLection
        dataToTrain = await readLectionData(selectedLection)
        shuffledKeys = dataToTrain
          .map((x) => x.vocabWord) // Use vocabWord field
          .sort(() => Math.random() - 0.5)
        wrongAttempts.clear()
        trainstate = "quiz"
        nextQuestion()
      } else {
        document.getElementById("tlection").style.color = "red"
      }
      e.preventDefault()
    } else if (e.key.length === 1) currentLectionValue += e.key
    document.getElementById("tlection").innerText = currentLectionValue
  } else if (trainstate === "quiz") {
    if (e.key === "Backspace")
      currentTValueValue = currentTValueValue.slice(0, -1)
    else if (e.key === "Enter") {
      await checkAnswer()
      e.preventDefault()
    } else if (e.key.length === 1 || e.key === " ") currentTValueValue += e.key
    document.getElementById("tvalue").innerText = currentTValueValue || "???"
  } else if (trainstate === "showingSolution") {
    if (e.key === "Enter") {
      trainstate = "quiz"
      currentTValueValue = "" // Reset input
      document.getElementById("tvalue").style.color = "blue"
      nextQuestion()
      e.preventDefault()
    }
  }
}

async function nextQuestion() {
  if (!shuffledKeys.length) {
    document.getElementById("trainfooter").innerText = mkbanner(
      "Finished!",
      45,
      "-",
    )
    document.getElementById("tkey").innerText = ""
    document.getElementById("tvalue").innerText = ""

    document.getElementById("stats").style.display = "block"
    document.getElementById("nstats").style.display = "none"

    document.getElementById("s1").innerText = trainStats.totalCorrect
    document.getElementById("s2").innerText = trainStats.totalWrong
    document.getElementById("s3").innerText = trainStats.hardestWord.key
    document.getElementById("s4").innerText = trainStats.hardestWord.attempts

    console.log("=== Training Statistics ===")
    console.log(`Total Correct: ${trainStats.totalCorrect}`)
    console.log(`Total Wrong: ${trainStats.totalWrong}`)
    console.log(
      `Hardest Word: "${trainStats.hardestWord.key}" (${trainStats.hardestWord.attempts} wrong attempts)`,
    )
    console.log("===========================")

    return
  }
  const vocabWord = shuffledKeys[shuffledKeys.length - 1]
  currentKey = vocabWord
  currentTValueValue = ""

  const tx = db.transaction("vocabulary", "readonly")
  const store = tx.objectStore("vocabulary")
  const index = store.index("vocabWord")
  const rq = index.get(vocabWord)
  rq.onsuccess = () => {
    const data = rq.result
    const wrong = data?.wrong || 0
    const right = data?.right || 0
    document.getElementById("tkey").innerText =
      `${vocabWord} (${wrong},${right})`
  }

  document.getElementById("tvalue").innerText = "???"
  const done = dataToTrain.length - shuffledKeys.length
  document.getElementById("trainfooter").innerText = mkbanner(
    `${done}/${dataToTrain.length}`,
    45,
    "-",
  )
}

async function checkAnswer() {
  const vocabWord = currentKey
  const correctValue = await getData(vocabWord)
  const tval = currentTValueValue.trim()
  const tvElt = document.getElementById("tvalue")

  let isCorrect = false
  if (correctValue.includes(",")) {
    const correctParts = correctValue
      .split(",")
      .map((part) => part.trim().toLowerCase())
      .sort()
    const userParts = tval
      .split(",")
      .map((part) => part.trim().toLowerCase())
      .sort()
    isCorrect =
      correctParts.length === userParts.length &&
      correctParts.every((part, index) => part === userParts[index])
  } else {
    isCorrect = tval.toLowerCase() === correctValue.toLowerCase()
  }

  tvElt.style.color = isCorrect ? "green" : "red"

  // Update database stats
  const tx = db.transaction("vocabulary", "readwrite")
  const store = tx.objectStore("vocabulary")
  const index = store.index("vocabWord")
  const rq = index.get(vocabWord)
  rq.onsuccess = () => {
    const data = rq.result
    if (!data) return
    if (isCorrect) {
      data.right = (data.right || 0) + 1
      data.weight = Math.max(1, (data.weight || 1) - 1)
    } else {
      data.wrong = (data.wrong || 0) + 1
      data.weight = (data.weight || 1) + 1
    }
    store.put(data)
  }

  if (isCorrect) {
    trainStats.totalCorrect++
    wrongAttempts.delete(vocabWord)
    shuffledKeys.pop() // Remove current word
    setTimeout(() => {
      tvElt.style.color = "blue"
      nextQuestion()
    }, 500)
  } else {
    trainStats.totalWrong++
    const currentAttempts = wrongAttempts.get(vocabWord) || 0
    wrongAttempts.set(vocabWord, currentAttempts + 1)

    if (currentAttempts + 1 > trainStats.hardestWord.attempts) {
      trainStats.hardestWord = { key: vocabWord, attempts: currentAttempts + 1 }
    }

    if (currentAttempts + 1 >= 3) {
      trainstate = "showingSolution"
      currentTValueValue = correctValue
      tvElt.innerText = correctValue
      tvElt.style.color = "yellow"
      document.getElementById("trainfooter").innerText = mkbanner(
        "Press Enter to continue",
        45,
        "-",
      )

      wrongAttempts.delete(vocabWord)
      shuffledKeys.pop()

      if (shuffledKeys.length > 3) {
        const insertPosition = Math.floor(shuffledKeys.length * 0.3)
        shuffledKeys.splice(insertPosition, 0, vocabWord)
      } else if (shuffledKeys.length > 0) {
        shuffledKeys.unshift(vocabWord)
      }
    } else {
      setTimeout(() => {
        tvElt.style.color = "blue"
        currentTValueValue = ""
        tvElt.innerText = "???"
      }, 500)
    }
  }
}

// ——— Banner init ———

function mkbanner(text, width, sep) {
  const pad = width - text.length
  const l = Math.floor(pad / 2),
    r = Math.ceil(pad / 2)
  return sep.repeat(l) + text + sep.repeat(r)
}

document.getElementById("correctbanner").innerText = mkbanner(
  "Correct vocabulary",
  45,
  "-",
)
document.getElementById("correctfooter").innerText = mkbanner("", 45, "-")
document.getElementById("statsbanner").innerText = mkbanner(
  "Training Statistics",
  45,
  "=",
)
document.getElementById("statsfooter").innerText = mkbanner("", 45, "=")
document.getElementById("vocbanner").innerText = mkbanner("TinyVoc", 45, "-")
document.getElementById("addbanner").innerText = mkbanner(
  "Add vocabulary",
  45,
  "-",
)
// IDK if this is really "prettier"
document.getElementById("trainbanner").innerText = mkbanner(
  "Train vocabulary",
  45,
  "-",
)
document.getElementById("viewbanner").innerText = mkbanner(
  "View vocabulary",
  45,
  "-",
)
document.getElementById("printfooter").innerText = mkbanner(
  "Generated by TinyVoc",
  50,
  "-",
)
document.getElementById("generateheader").innerText = mkbanner(
  "Generate List",
  45,
  "-",
)
document.getElementById("lectionviewheader").innerText = mkbanner(
  "Lection View",
  45,
  "-",
)
document.getElementById("moveheader").innerText = mkbanner("Move List", 45, "-")
document.getElementById("movefooter").innerText = mkbanner("", 45, "-")
document.getElementById("vocfooter").innerText = mkbanner("", 45, "-")
document.getElementById("addfooter").innerText = mkbanner("", 45, "-")
document.getElementById("viewfooter").innerText = mkbanner("", 45, "-")
document.getElementById("generatefooter").innerText = mkbanner("", 45, "-")
document.getElementById("trainfooter").innerText = mkbanner("0/0", 45, "-")
document.getElementById("lectionviewfooter").innerText = mkbanner("", 45, "-")

// ——— IndexedDB & data helpers ———

function initDB() {
  const req = indexedDB.open("vocTrainerDB", 3)
  req.onupgradeneeded = (e) => {
    db = e.target.result

    if (db.objectStoreNames.contains("vocabulary")) {
      db.deleteObjectStore("vocabulary")
    }

    const vocabStore = db.createObjectStore("vocabulary", {
      keyPath: "id",
      autoIncrement: true,
    })

    vocabStore.createIndex("vocabWord", "vocabWord", { unique: true })

    if (!db.objectStoreNames.contains("config")) {
      db.createObjectStore("config", { keyPath: "key" })
    }
  }
  req.onsuccess = async (e) => {
    db = e.target.result

    const ignoreCase = await readConfig("ignoreCase").catch(() => null)
    if (ignoreCase === null) {
      writeConfig("ignoreCase", false)
    }
  }
  req.onerror = (e) => console.log("DB error", e)
}

function writeData(vocabWord, value, lection) {
  if (!db) return
  const tx = db.transaction("vocabulary", "readwrite")
  const store = tx.objectStore("vocabulary")
  store.put({
    vocabWord,
    value,
    lection,
    weight: 1,
    wrong: 0,
    right: 0,
    // id will be auto-generated
  })
}

function getData(vocabWord) {
  return new Promise((res, rej) => {
    if (!db) return rej()
    const tx = db.transaction("vocabulary", "readonly")
    const store = tx.objectStore("vocabulary")
    const index = store.index("vocabWord")
    const rq = index.get(vocabWord)
    rq.onsuccess = () => res(rq.result?.value || "")
    rq.onerror = () => rej()
  })
}

function readAllData() {
  return new Promise((res, rej) => {
    if (!db) return rej()
    const tx = db.transaction("vocabulary", "readonly")
    const store = tx.objectStore("vocabulary")
    const rq = store.getAll()
    rq.onsuccess = () => res(rq.result)
    rq.onerror = () => rej()
  })
}

async function readLectionData(lection) {
  const all = await readAllData()
  return all.filter((x) => x.lection === lection)
}

async function readAllLections() {
  const all = await readAllData()
  return [...new Set(all.map((x) => x.lection))]
}

function deleteAllData() {
  return new Promise((res, rej) => {
    if (!db) return rej()
    const tx = db.transaction("vocabulary", "readwrite")
    const store = tx.objectStore("vocabulary")
    const rq = store.clear()
    rq.onsuccess = () => res()
    rq.onerror = () => rej(rq.error)
  })
}

function importData(data) {
  return new Promise((resolve, reject) => {
    if (!db) return reject("Database not available")
    const tx = db.transaction("vocabulary", "readwrite")
    const store = tx.objectStore("vocabulary")

    data.forEach((item) => {
      store.put(item)
    })

    tx.oncomplete = () => resolve()
    tx.onerror = (e) => reject(e.target.error)
  })
}

function download(content) {
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "voc.tiny"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// View Helpers
function resetView() {
  document.getElementById("viewElement").innerHTML = ""
}

function addToView(id, key, value, lection, right, wrong) {
  const viewElement = document.getElementById("viewElement")
  const tr = document.createElement("tr")
  const tdId = document.createElement("td")
  const tdKey = document.createElement("td")
  const tdValue = document.createElement("td")
  const tdWrong = document.createElement("td")
  const tdRight = document.createElement("td")
  const tdLection = document.createElement("td")

  tdId.innerText = id
  tdKey.innerText = key
  tdValue.innerText = value
  tdLection.innerText = lection
  tdWrong.innerText = wrong
  tdRight.innerText = right

  tr.appendChild(tdId) // ID as first column
  tr.appendChild(tdKey)
  tr.appendChild(tdValue)
  tr.appendChild(tdLection)
  tr.appendChild(tdWrong)
  tr.appendChild(tdRight)

  viewElement.appendChild(tr)
}

function getFile() {
  const fileInput = document.getElementById("file")
  const importText = document.getElementById("iv")
  importText.style.display = "none"
  fileInput.style.display = "block"

  fileInput.onchange = () => {
    const file = fileInput.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result)

        fileInput.style.display = "none"
        importText.style.display = "block"
        importText.innerHTML =
          "Do you want to add <strong>(b)</strong> it or overwrite <strong>(o)</strong>?"

        const handler = async (ev) => {
          if (ev.key === "b" || ev.key === "B") {
            // Merge data
            await importData(importedData)
            location.reload()
          } else if (ev.key === "o" || ev.key === "O") {
            // Overwrite data
            await deleteAllData()
            await importData(importedData)
            location.reload()
          }
          document.removeEventListener("keydown", handler)
        }
        document.addEventListener("keydown", handler)
      } catch (error) {
        console.error("Import error:", error)
        importText.innerHTML = "Invalid file format. Press any key"
        const handler = () => location.reload()
        document.addEventListener("keydown", handler)
      }
    }
    reader.readAsText(file)
  }
}

async function renameLection(oldName, newName) {
  const all = await readAllData()
  const itemsToRename = all.filter((x) => x.lection === oldName)

  if (!itemsToRename.length) {
    console.log(`No entries found for lection "${oldName}"`)
    return
  }

  const tx = db.transaction("vocabulary", "readwrite")
  const store = tx.objectStore("vocabulary")

  itemsToRename.forEach((item) => {
    item.lection = newName
    store.put(item)
  })

  tx.oncomplete = () => {
    console.log(
      `Lection "${oldName}" renamed to "${newName}" (${itemsToRename.length} items updated)`,
    )
  }

  tx.onerror = (e) => {
    console.error("Rename failed:", e.target.error)
  }
}

function writeConfig(key, value) {
  if (!db) return
  const tx = db.transaction("config", "readwrite")
  const store = tx.objectStore("config")
  store.put({ key, value })
}

function readConfig(key) {
  return new Promise((res, rej) => {
    if (!db) return rej()
    const tx = db.transaction("config", "readonly")
    const store = tx.objectStore("config")
    const rq = store.get(key)
    rq.onsuccess = () => res(rq.result?.value || null)
    rq.onerror = () => rej()
  })
}

async function GenerateSpecialList(
  sourceLection,
  minFieldValue,
  maxEntries,
  fieldName,
  outputLection,
) {
  const data = await readLectionData(sourceLection)

  const result = data
    .filter((item) => (item[fieldName] || 0) >= minFieldValue)
    .sort((a, b) => (b[fieldName] || 0) - (a[fieldName] || 0))
    .slice(0, maxEntries)

  const tx = db.transaction("vocabulary", "readwrite")
  const store = tx.objectStore("vocabulary")

  result.forEach((item) => {
    const newKey = item.key + uniqueKeyChar
    store.put({
      key: newKey,
      value: item.value,
      lection: outputLection,
      weight: item.weight || 1,
      wrong: item.wrong || 0,
      right: item.right || 0,
    })
  })

  return result
}

initDB()
