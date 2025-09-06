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
let currentLectionsValue = ""
let joinState = null
let currentDestinationValue = ""
let currentBroadcastValue = ""
let broadcastState = "main"
let recvPeer = null
let recvConn = null
let sendPeer = null
let sendConn = null
let docState = "toc"
let docNum = ""
let selectedLection = ""
let generateState = "transform"
let moveState = "source"
let gitState = "select"
let currentGitValue = ""
let dataToTrain = []
let shuffledKeys = []
let sessionAttempts = new Map();
let uniqueKeyChar = " "
let trainstate = "lection"
let wrongAttempts = new Map()
let currentKey = ""
let docPages = 24
let db
let currentSessionScore = 0
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
const menuDisplayEl = document.getElementById("barp1")
const clockDisplayEl = document.getElementById("barp2")

function updateClockDisplay() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  clockDisplayEl.innerText = `${hours}:${minutes}`
}

updateClockDisplay() // Initaliy set clock
setInterval(updateClockDisplay, 1000)

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
    "n",
    "N",
    "s",
    "S",
    "p",
    "P",
    "j",
    "J",
    "b",
    "B",
    "f",
    "F",
    "-",
    "Enter",
  ].includes(e.key)
    ? "#5294e2"
    : "red"

  // MAIN MENU
  if (menu === "mm") {
    if (e.key === "a" || e.key === "A") {
      showAddMenu(); return
    } else if (e.key === "t" || e.key === "T") {
      showTrainMenu(); return
    } else if (e.key === "e" || e.key === "E") {
      download(JSON.stringify(await readAllData())); return
    } else if (e.key === "i" || e.key === "I") {
      getFile(); return
    } else if (e.key === "v" || e.key === "V") {
      showViewMenu(); return
    } else if (e.key === "g" || e.key === "G") {
      showGenerateMenu(); return
    } else if (e.key === "m" || e.key === "M") {
      showMoveMenu(); return
    } else if (e.key === "l" || e.key === "L") {
      showLectionsMenu(); return
    } else if (e.key === "c" || e.key === "C") {
      showCorrectMenu(); return
    } else if (e.key === "n" || e.key === "N") {
      showGitMenu(); return
    } else if (e.key === "s" || e.key === "S") {
      showStatusMenu(); return
    } else if (e.key === "j" || e.key === "J") {
      showJoinMenu(); return
    } else if (e.key === "b" || e.key === "B") {
      showBroadcastMenu(); return
    } else if (e.key === "d" || e.key === "D") {
      showDocsMenu(); return
    } else if (e.key === "f" || e.key === "F") {
      showFigureMenu(); return
    }
  }
  // BACK TO MAIN
  if (e.key === "-") {
    const isInInputState = (
      (menu === "jm" && joinState === "lections") ||
      (menu === "nm" && gitState === "textField") ||
      (menu === "bm" && (broadcastState === "lections" || broadcastState === "peerid" || broadcastState === "send_lections"))
    )

    if (!isInInputState) {
      hideJoinMenu()
      hideAddMenu()
      hideTrainMenu()
      hideDocsMenu()
      hideViewMenu()
      hideGenerateMenu()
      hideMoveMenu()
      hideLectionsMenu()
      hideBroadcastMenu()
      hideCorrectMenu()
      showMainMenu()
      hideFigureMenu()
      hideGitMenu()
      hideStatusMenu()
      sel.innerText = ""
    }
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

  // GIT STATUS MENU
  if (menu === "sm") handleStatusMenu()

  // GIT MENU
  if (menu === "nm") handleGitMenu(e)

  // JOIN MENU
  if (menu === "jm") handleJoinMenu(e)

  // BROADCAST MENU
  if (menu === "bm") handleBroadcastMenu(e)

  // DOCS MENU
  if (menu === "dm") handleDocsMenu(e)
})

function setMenu(long, docpage) {
  document.getElementById("barp1").innerText = long
  if (docpage) {
    document.getElementById("barp15").innerHTML = "<strong id='bardoc'></strong>"
    document.getElementById("bardoc").innerText = docpage
  } else {
    document.getElementById("barp15").innerHTML = "<strong id='bardoc'>Error</strong> No Docs"
  }
}
// ——— Menu show/hide helpers ———
function showFigureMenu() {
  hideMainMenu()
  document.getElementById("fm").style.display = "block"
  handleFigureMenu()
  menu = "fm"
  setMenu("Figure Menu", "11")
}

function hideFigureMenu() {
  document.getElementById("fm").style.display = "none"
}

function showDocsMenu() {
  hideMainMenu()
  document.getElementById("dm").style.display = "block"
  hideAllDocElements()
  writeGP("currentDocPage", 0)
  document.getElementById("doctoc").style.display = "block"
  menu = "dm"
  setMenu("Docs Menu")
  for (let i = 1; i <= docPages; i++) {
    const pageId = "docpage" + String(i).padStart(2, '0')
    const pageElement = document.getElementById(pageId)
    if (pageElement) {
      pageElement.style.display = "none"
    }
  }
}

function hideDocsMenu() {
  document.getElementById("dm").style.display = "none"
}

function showBroadcastMenu() {
  hideMainMenu()
  document.getElementById("bm").style.display = "block"
  menu = "bm"
  setMenu("Broadcast Sub Menu", "10")
}

function hideBroadcastMenu() {
  document.getElementById("bm").style.display = "none"
}

function showStatusMenu() {
  hideMainMenu()
  document.getElementById("sm").style.display = "block"
  menu = "sm"
  setMenu("Git Status Menu", "12")
}

function hideStatusMenu() {
  document.getElementById("sm").style.display = "none"
}

function showJoinMenu() {
  hideMainMenu()
  document.getElementById("jm").style.display = "block"
  menu = "jm"
  setMenu("Lection Joining Menu", "09")
  joinState = "lections"
  currentLectionsValue = ""

  document.getElementById("joinstatus").innerText = "Enter lection specifications (comma-separated)"
  document.getElementById("joinstatus").style.color = "#5294e2"
  document.getElementById("lectionsj").innerText = ""
}

function hideJoinMenu() {
  document.getElementById("jm").style.display = "none"
}

function showGitMenu() {
  hideMainMenu()
  document.getElementById("nm").style.display = "block"
  document.getElementById("gitfooter").innerText = mkbanner("", 45, "-")
  menu = "nm"
  setMenu("Git Integration Sub Menu", "09")
}

function hideGitMenu() {
  document.getElementById("nm").style.display = "none"
}

function showMainMenu() {
  document.getElementById("mm").style.display = "block"
  menu = "mm"
  setMenu("Main Menu")
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
  hideGitMenu()
  document.getElementById("am").style.display = "block"
  menu = "am"
  setMenu("Add Vocabulary Menu", "02")
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
  currentIdCValue = ""
  currentKeyCValue = ""
  currentValueCValue = ""
  currentLectionCValue = ""
  correctState = "lection"
  document.getElementById("idc").innerText = ""
  document.getElementById("keyc").innerText = ""
  document.getElementById("valuec").innerText = ""
  document.getElementById("lectionc").innerText = ""
  menu = "cm"
  setMenu("Correct Vocabulary Menu", "08")
  hideMainMenu()
  document.getElementById("cm").style.display = "block"
}

async function showLectionsMenu() {
  document.getElementById("lm").style.display = "block"
  hideMainMenu()
  // Render articles
  document.getElementById("lectionview").innerHTML = ""
  const lections = await readAllLections()

  for (const item of lections) {
    const p = document.createElement("p")
    p.innerText = `${item} - Last Average Attempt: ${await readGP(item + "_attempt_last")} - Last Success Score: ${await readGP(item + "_success_last")}%`
    document.getElementById("lectionview").appendChild(p)
  }
  menu = "lm"
  setMenu("Lections View", "07")
}

function showTrainMenu() {
  hideAddMenu()
  hideMainMenu()
  hideGenerateMenu()
  document.getElementById("tm").style.display = "block"
  menu = "tm"
  setMenu("Training Menu", "03")
  currentSessionScore = 0
  trainInit()
}

function showMoveMenu() {
  hideTrainMenu()
  hideAddMenu()
  hideGenerateMenu()
  hideMainMenu()
  document.getElementById("mvm").style.display = "block"
  menu = "mvm"
  setMenu("Move Vocabulary Menu", "06")
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
  setMenu("Generate Lection Menu", "05")
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
  transformEl.style.color = "#5294e2"
  actionEl.innerText = ""
  actionEl.style.color = "#5294e2"
  paramEl.innerText = ""
  paramEl.style.color = "#5294e2"
  param2El.innerText = ""
  param2El.style.color = "#5294e2"
}
async function showViewMenu() {
  hideMainMenu()
  document.getElementById("vm").style.display = "block"
  resetView()

  menu = "vm"
  setMenu("View Menu", "04")
  viewstate = "lection"
  currentLectionValue = ""
  const ilectionSelect = document.getElementById("ilectionSelect")
  ilectionSelect.innerText = ""
  ilectionSelect.style.color = "#5294e2"
}

// ——— Figure menu logic ———
async function handleFigureMenu() {
  const figuresEl = document.getElementById("figures");
  if (!figuresEl) return;

  figuresEl.innerHTML = "";

  const lections = await readAllLections();

  for (const item of lections) {
    const header = document.createElement("h3");
    header.innerText = item;
    header.style.marginTop = "20px";
    header.style.marginBottom = "15px";
    figuresEl.appendChild(header);

    let attempts = await readGP(item + "_attempt");
    let successes = await readGP(item + "_success");

    if (!Array.isArray(attempts)) attempts = [];
    if (!Array.isArray(successes)) successes = [];

    // Convert to numbers and filter out non-finite values
    const numericAttempts = attempts
      .map(v => typeof v === "number" ? v : Number(v))
      .filter(n => Number.isFinite(n));

    const numericSuccesses = successes
      .map(v => typeof v === "number" ? v : Number(v))
      .filter(n => Number.isFinite(n));

    const lastTwentyAttempts = numericAttempts.slice(-20);
    const lastTwentySuccesses = numericSuccesses.slice(-20);

    const chartsContainer = document.createElement("div");
    chartsContainer.style.display = "flex";
    chartsContainer.style.gap = "30px";
    chartsContainer.style.marginBottom = "20px";

    // Attempt Chart Container
    const attemptChartDiv = document.createElement("div");
    attemptChartDiv.style.flex = "1";

    if (lastTwentyAttempts.length > 0) {
      const attemptTitle = document.createElement("p");
      attemptTitle.innerText = "Average Attempts (Last 20 Sessions):";
      attemptTitle.style.fontWeight = "bold";
      attemptTitle.style.marginBottom = "5px";
      attemptChartDiv.appendChild(attemptTitle);

      const attemptChartText = asciichart.plot(lastTwentyAttempts, { height: 8 })
      const attemptChartLines = attemptChartText.split("\n");
      attemptChartLines.forEach(row => {
        const pr = document.createElement("p");
        pr.innerText = row;
        pr.style.fontFamily = "monospace";
        pr.style.fontSize = "12px";
        pr.style.margin = "0";
        pr.style.lineHeight = "1.2";
        attemptChartDiv.appendChild(pr);
      });

      const attemptSummary = document.createElement("p");
      attemptSummary.innerText = `Range: ${Math.min(...lastTwentyAttempts).toFixed(2)} - ${Math.max(...lastTwentyAttempts).toFixed(2)} attempts`;
      attemptSummary.style.fontSize = "11px";
      attemptSummary.style.color = "#666";
      attemptSummary.style.marginTop = "5px";
      attemptChartDiv.appendChild(attemptSummary);
    } else {
      const noAttemptData = document.createElement("p");
      noAttemptData.innerText = "Average Attempts (Last 5 Sessions):";
      noAttemptData.style.fontWeight = "bold";
      noAttemptData.style.marginBottom = "5px";
      attemptChartDiv.appendChild(noAttemptData);

      const noDataMsg = document.createElement("p");
      noDataMsg.innerText = "No attempt data available";
      noDataMsg.style.color = "gray";
      noDataMsg.style.fontStyle = "italic";
      attemptChartDiv.appendChild(noDataMsg);
    }

    // Success Chart Container
    const successChartDiv = document.createElement("div");
    successChartDiv.style.flex = "1";

    if (lastTwentySuccesses.length > 0) {
      const successTitle = document.createElement("p");
      successTitle.innerText = "Success Rate % (Last 20 Sessions):";
      successTitle.style.fontWeight = "bold";
      successTitle.style.marginBottom = "5px";
      successChartDiv.appendChild(successTitle);

      const successChartText = asciichart.plot(lastTwentySuccesses, { height: 8 });
      const successChartLines = successChartText.split("\n");
      successChartLines.forEach(row => {
        const pr = document.createElement("p");
        pr.innerText = row;
        pr.style.fontFamily = "monospace";
        pr.style.fontSize = "12px";
        pr.style.margin = "0";
        pr.style.lineHeight = "1.2";
        successChartDiv.appendChild(pr);
      });

      const successSummary = document.createElement("p");
      successSummary.innerText = `Range: ${Math.min(...lastTwentySuccesses)}% - ${Math.max(...lastTwentySuccesses)}%`;
      successSummary.style.fontSize = "11px";
      successSummary.style.color = "#666";
      successSummary.style.marginTop = "5px";
      successChartDiv.appendChild(successSummary);
    } else {
      const noSuccessData = document.createElement("p");
      noSuccessData.innerText = "Success Rate % (Last 5 Sessions):";
      noSuccessData.style.fontWeight = "bold";
      noSuccessData.style.marginBottom = "5px";
      successChartDiv.appendChild(noSuccessData);

      const noDataMsg = document.createElement("p");
      noDataMsg.innerText = "No success data available";
      noDataMsg.style.color = "gray";
      noDataMsg.style.fontStyle = "italic";
      successChartDiv.appendChild(noDataMsg);
    }

    chartsContainer.appendChild(attemptChartDiv);
    chartsContainer.appendChild(successChartDiv);
    figuresEl.appendChild(chartsContainer);

    const separator = document.createElement("hr");
    separator.style.margin = "25px 0";
    separator.style.border = "none";
    separator.style.borderTop = "1px solid #ccc";
    figuresEl.appendChild(separator);
  }
}
// ——— Docs menu logic ———
async function handleDocsMenu(e) {
  console.log(typeof e.key)

  if (e.key === "t" || e.key === "T") {
    docState = "toc"
    hideAllDocElements()
    document.getElementById("doctoc").style.display = "block"
  } if (/^\d$/.test(e.key) && docState === "toc" && docNum.length === 0) {
    docState = "num"
    docNum += e.key
  } else if (/^\d$/.test(e.key) && docState === "num" && docNum.length === 1) {
    docState = "page"
    docNum += e.key

    const pageNum = parseInt(docNum)
    if (pageNum >= 1 && pageNum <= docPages) {
      showDocPage(pageNum)
    } else {
      docState = "toc"
      docNum = ""
    }

    docNum = ""
  } else if (e.key === "ArrowLeft") {
    const currentPage = await readGP("currentDocPage") || 1
    if (currentPage > 1) {
      const newPage = currentPage - 1
      showDocPage(newPage)
      await writeGP("currentDocPage", newPage)
    }
  } else if (e.key === "ArrowRight") {
    const currentPage = await readGP("currentDocPage") || 1
    if (currentPage < docPages) {
      const newPage = currentPage + 1
      showDocPage(newPage)
      await writeGP("currentDocPage", newPage)
    }
  }
}

function hideAllDocElements() {
  document.getElementById("doctoc").style.display = "none"
  for (let i = 1; i <= docPages; i++) {
    const pageId = "docpage" + String(i).padStart(2, '0')
    const pageElement = document.getElementById(pageId)
    if (pageElement) {
      pageElement.style.display = "none"
    }
  }
}

function showDocPage(pageNum) {
  docState = "page"
  hideAllDocElements()
  const pageId = "docpage" + String(pageNum).padStart(2, '0')
  const pageElement = document.getElementById(pageId)
  if (pageElement) {
    pageElement.style.display = "block"
    writeGP("currentDocPage", pageNum)
  } else {
    console.error(`Doc page element not found: ${pageId}`)
  }
}
// ——— Broadcast menu logic ———
async function handleBroadcastMenu(e) {
  if (broadcastState === "main") {
    if (e.key === "f") {
      document.getElementById("broadcast").style.display = "flex"
      document.getElementById("broadcastt").innerText = "lections: "
      broadcastState = "lections"
      currentBroadcastValue = ""
      document.getElementById("broadcasti").innerText = ""
    } else if (e.key === "w") {
      broadcastState = "webrtc"
    }
  } else if (broadcastState === "webrtc") {
    if (e.key === "Escape") {
      broadcastState = "main"
    } else if (e.key === "r") {
      recvPeer = new Peer()

      recvPeer.on("open", id => {
        document.getElementById("peerid").style.display = "block"
        document.getElementById("peerid").innerHTML = "peer-id " + id
      })

      recvPeer.on("connection", conn => {
        recvConn = conn
        recvConn.on("open", () => {
          document.getElementById("peerid").innerText += ". Connected"
        })

        recvConn.on("data", data => {
          hideBroadcastMenu()
          showMainMenu()
          try {
            let parsedData
            if (typeof data === 'string') {
              parsedData = JSON.parse(data)
            } else {
              parsedData = data
            }

            const vocabularyArray = parsedData.vocabulary || parsedData
            importData(vocabularyArray)
          } catch (error) {
            console.error("Failed to import received data:", error)
          }
        })

        recvPeer.on("error", err => {
          console.error(err)
          document.getElementById("peerid").innerText += ". Error check console for details"
        })
      })

      broadcastState = "main"
    } else if (e.key === "s") {
      document.getElementById("peerid").style.display = "block"
      document.getElementById("peerid").innerText = "Enter peer ID in URL hash"

      const handleHashChange = async () => {
        const hash = window.location.hash.substring(1)
        if (hash) {
          await writeGP("peerid", hash)
          document.getElementById("peerid").innerText = `Peer ID saved: ${hash}.`

          window.removeEventListener("hashchange", handleHashChange)

          document.getElementById("broadcast").style.display = "flex"
          document.getElementById("broadcastt").innerText = "lections: "
          broadcastState = "send_lections"
          currentBroadcastValue = ""
          document.getElementById("broadcasti").innerText = ""
        }
      }

      window.addEventListener("hashchange", handleHashChange)

      const currentHash = window.location.hash.substring(1)
      if (currentHash) {
        handleHashChange()
      }
    }
  } else if (broadcastState === "lections") {
    if (e.key === "Backspace") {
      currentBroadcastValue = currentBroadcastValue.slice(0, -1)
    } else if (e.key === "Enter") {
      if (currentBroadcastValue.trim()) {
        // Validate lections input
        const isValid = await validateLectionsInput(currentBroadcastValue)
        if (isValid) {
          document.getElementById("broadcasti").style.color = "white"
          const data = await getLectionData(currentBroadcastValue)
          download(data)
          document.getElementById("broadcast").style.display = "none"
          broadcastState = "main"
          currentBroadcastValue = ""
        } else {
          document.getElementById("broadcasti").style.color = "red"
        }
      }
    } else if (e.key === "Escape") {
      document.getElementById("broadcast").style.display = "none"
      broadcastState = "main"
      currentBroadcastValue = ""
    } else if (e.key.length === 1) {
      currentBroadcastValue += e.key
    }
    document.getElementById("broadcasti").innerText = currentBroadcastValue
  } else if (broadcastState === "send_lections") {
    if (e.key === "Backspace") {
      currentBroadcastValue = currentBroadcastValue.slice(0, -1)
    } else if (e.key === "Enter") {
      if (currentBroadcastValue.trim()) {
        // Validate lections input
        const isValid = await validateLectionsInput(currentBroadcastValue)
        if (isValid) {
          document.getElementById("broadcasti").style.color = "white"
          const data = await getLectionData(currentBroadcastValue)
          const peerid = await readGP("peerid")

          sendPeer = new Peer()
          sendPeer.on("open", () => {
            sendConn = sendPeer.connect(peerid)
            sendConn.on("open", () => {
              try {
                const parsedData = JSON.parse(data)
                sendConn.send(parsedData)
                document.getElementById("broadcast").style.display = "none"
                document.getElementById("peerid").style.display = "none"
                broadcastState = "main"
                currentBroadcastValue = ""
              } catch (error) {
                console.error("Failed to send data:", error)
                document.getElementById("broadcast").style.display = "none"
                document.getElementById("peerid").style.display = "none"
                broadcastState = "main"
                currentBroadcastValue = ""
              }
            })

            sendConn.on("error", (err) => {
              console.error("Connection error:", err)
              document.getElementById("broadcast").style.display = "none"
              document.getElementById("peerid").style.display = "none"
              broadcastState = "main"
              currentBroadcastValue = ""
            })
          })

          sendPeer.on("error", (err) => {
            console.error("Peer error:", err)
            document.getElementById("broadcast").style.display = "none"
            document.getElementById("peerid").style.display = "none"
            broadcastState = "main"
            currentBroadcastValue = ""
          })
        } else {
          document.getElementById("broadcasti").style.color = "red"
        }
      }
    } else if (e.key === "Escape") {
      document.getElementById("broadcast").style.display = "none"
      document.getElementById("peerid").style.display = "none"
      broadcastState = "main"
      currentBroadcastValue = ""
    } else if (e.key.length === 1) {
      currentBroadcastValue += e.key
    }
    document.getElementById("broadcasti").innerText = currentBroadcastValue
  }
}

async function validateLectionsInput(inputValue) {
  const trimmedInput = inputValue.trim().toLowerCase()

  if (trimmedInput === "all") {
    return true
  }

  const lectionNames = inputValue.split(",").map(name => name.trim()).filter(name => name.length > 0)

  const existingLections = await readAllLections()

  for (const lectionName of lectionNames) {
    if (!existingLections.includes(lectionName)) {
      return false
    }
  }

  return true
}

async function getLectionData(lectionString) {
  return new Promise(async (resolve, reject) => {
    try {
      const isAll = lectionString.toLowerCase().trim() === "all"
      const lectionNames = isAll ? [] : lectionString.split(',').map(name => name.trim())

      const tx = db.transaction(['vocabulary'], 'readonly')
      const store = tx.objectStore('vocabulary')
      const request = store.getAll()

      request.onsuccess = () => {
        let filteredData = request.result || []

        if (!isAll) {
          filteredData = filteredData.filter(item =>
            lectionNames.includes(item.lection)
          )
        }

        // Format the data for importData function
        // Assuming importData expects JSON format with vocabulary structure
        const formattedData = {
          vocabulary: filteredData.map(item => ({
            vocabWord: item.vocabWord,
            value: item.value,
            lection: item.lection,
            wrong: item.wrong || 0,
            right: item.right || 0,
            id: item.id
          }))
        }

        resolve(JSON.stringify(formattedData))
      }

      request.onerror = () => {
        reject(new Error(`Failed to retrieve lection data: ${request.error}`))
      }

    } catch (error) {
      reject(new Error(`Error processing lection string "${lectionString}": ${error.message}`))
    }
  })
}

function broadcastTextField(oldState = "main") {
  return new Promise((resolve, reject) => {
    currentBroadcastValue = ""
    document.getElementById("broadcasti").innerText = ""

    function cleanupTextField() {
      document.getElementById("broadcasti").innerText = ""
      currentBroadcastValue = ""
    }

    function textFieldHandler(e) {
      if (e.key === "Enter") {
        const valueToReturn = currentBroadcastValue
        cleanupTextField()
        document.removeEventListener("keydown", textFieldHandler)
        broadcastState = oldState
        resolve(valueToReturn)
        e.preventDefault()
      } else if (e.key === "Escape" || e.key === "-" || e.key === "/") {
        cleanupTextField()
        document.removeEventListener("keydown", textFieldHandler)
        broadcastState = oldState
        resolve(null)
        e.preventDefault()
      } else if (e.key === "Backspace") {
        currentBroadcastValue = currentBroadcastValue.slice(0, -1)
        document.getElementById("broadcasti").innerText = currentBroadcastValue
        e.preventDefault()
      } else if (e.key.length === 1) {
        currentBroadcastValue += e.key
        document.getElementById("broadcasti").innerText = currentBroadcastValue
        e.preventDefault()
      }
    }

    document.addEventListener("keydown", textFieldHandler)
  })
}

// ——— Join menu logic ———

async function handleJoinMenu(e) {
  if (joinState == "lections") {
    if (e.key === "Backspace") {
      currentLectionsValue = currentLectionsValue.slice(0, -1);
    } else if (e.key === "Enter") {
      joinState = null; // prevent any new input

      try {
        document.getElementById("joinstatus").innerText = "Processing lections...";
        document.getElementById("joinstatus").style.color = "#5294e2";

        // parse lections and join
        const joinedVocabulary = [];
        const processedIds = new Set();

        const lectionSpecs = currentLectionsValue.split(",").map(spec => spec.trim()).filter(spec => spec.length > 0);

        for (const spec of lectionSpecs) {
          try {
            // parse single lection spec
            let lectionName, rangeSpec;

            // Check if has brackets
            const bracketMatch = spec.match(/^(.+?)\[(.+)\]$/);
            if (bracketMatch) {
              lectionName = bracketMatch[1].trim();
              rangeSpec = bracketMatch[2].trim();
            } else {
              lectionName = spec.trim();
              rangeSpec = null;
            }

            // get lection vocabulary 
            const allVocabulary = await new Promise((resolve, reject) => {
              const tx = db.transaction(['vocabulary'], 'readonly');
              const store = tx.objectStore('vocabulary');
              const request = store.getAll();

              request.onsuccess = () => {
                const filtered = (request.result || []).filter(item => item.lection === lectionName);
                resolve(filtered);
              };

              request.onerror = () => {
                reject(new Error(`Failed to retrieve lection "${lectionName}"`));
              };
            });

            if (allVocabulary.length === 0) {
              throw new Error(`Lection "${lectionName}" not found or empty`);
            }

            // Sort by id
            allVocabulary.sort((a, b) => (a.id || 0) - (b.id || 0));

            let vocabularyItems = allVocabulary;

            // filter by range (if specified)
            if (rangeSpec) {
              if (rangeSpec.includes('-')) {
                // Range format: "1-14", "4-", "-4"
                const parts = rangeSpec.split('-');
                const startStr = parts[0].trim();
                const endStr = parts[1].trim();

                if (startStr === '' && endStr !== '') {
                  // Format: [-4] - from beginning to id 4
                  const endId = parseInt(endStr);
                  if (isNaN(endId)) {
                    throw new Error(`Invalid end range "${endStr}"`);
                  }
                  vocabularyItems = allVocabulary.filter(item => (item.id || 0) <= endId);

                } else if (startStr !== '' && endStr === '') {
                  // Format: [4-] - from id 4 to end
                  const startId = parseInt(startStr);
                  if (isNaN(startId)) {
                    throw new Error(`Invalid start range "${startStr}"`);
                  }
                  vocabularyItems = allVocabulary.filter(item => (item.id || 0) >= startId);

                } else if (startStr !== '' && endStr !== '') {
                  // Format: [1-14] - from id 1 to id 14
                  const startId = parseInt(startStr);
                  const endId = parseInt(endStr);
                  if (isNaN(startId) || isNaN(endId)) {
                    throw new Error(`Invalid range "${rangeSpec}"`);
                  }
                  if (startId > endId) {
                    throw new Error(`Start id ${startId} cannot be greater than end id ${endId}`);
                  }
                  vocabularyItems = allVocabulary.filter(item => {
                    const itemId = item.id || 0;
                    return itemId >= startId && itemId <= endId;
                  });

                } else {
                  throw new Error(`Invalid range format "${rangeSpec}"`);
                }

              } else {
                // Single id format: [4]
                const targetId = parseInt(rangeSpec);
                if (isNaN(targetId)) {
                  throw new Error(`Invalid id "${rangeSpec}"`);
                }
                vocabularyItems = allVocabulary.filter(item => (item.id || 0) === targetId);
              }
            }

            // Add items to joined vocabulary, avoiding duplicates
            for (const item of vocabularyItems) {
              const uniqueKey = `${item.vocabWord}-${item.value}`;
              if (!processedIds.has(uniqueKey)) {
                processedIds.add(uniqueKey);
                joinedVocabulary.push(item);
              }
            }

          } catch (error) {
            console.error(`Error processing lection spec "${spec}":`, error);
            throw new Error(`Failed to process "${spec}": ${error.message}`);
          }
        }

        if (joinedVocabulary.length > 0) {
          // generate unique lection name
          document.getElementById("joinstatus").innerText = "Generating unique lection name...";

          let baseName = "lection";
          let suffix = "j";
          let attemptName = baseName + suffix;

          // Keep adding 'j' until we find a unique name
          let foundUniqueName = false;
          while (!foundUniqueName) {
            const exists = await new Promise((resolve, reject) => {
              const tx = db.transaction(['vocabulary'], 'readonly');
              const store = tx.objectStore('vocabulary');
              const request = store.getAll();

              request.onsuccess = () => {
                // Check if any items exist with this lection name
                const hasLection = (request.result || []).some(item => item.lection === attemptName);
                resolve(hasLection);
              };

              request.onerror = () => {
                console.error(`Error checking if lection "${attemptName}" exists:`, request.error);
                reject(request.error);
              };
            });

            if (!exists) {
              foundUniqueName = true;
            } else {
              suffix += "j";
              attemptName = baseName + suffix;
            }
          }

          console.log(`Generated unique lection name: ${attemptName}`);
          const newLectionName = attemptName;

          // save joined lection
          // Get the next available ID for the new lection
          const nextId = await new Promise((resolve, reject) => {
            const tx = db.transaction(['vocabulary'], 'readonly');
            const store = tx.objectStore('vocabulary');
            const request = store.getAll();

            request.onsuccess = () => {
              const allItems = request.result;
              let maxId = 0;
              for (const item of allItems) {
                if (item.id && item.id > maxId) {
                  maxId = item.id;
                }
              }
              resolve(maxId + 1);
            };

            request.onerror = () => {
              reject(new Error('Failed to get next vocabulary ID'));
            };
          });

          // Save each vocabulary item with the new lection name
          await new Promise((resolve, reject) => {
            const tx = db.transaction(['vocabulary'], 'readwrite');
            const store = tx.objectStore('vocabulary');

            tx.onerror = (event) => {
              reject(new Error(`Transaction error: ${event.target.error}`));
            };

            for (let i = 0; i < joinedVocabulary.length; i++) {
              const item = { ...joinedVocabulary[i] };
              item.id = nextId + i;
              item.lection = newLectionName;
              // Reset stats for the new lection
              item.right = 0;
              item.wrong = 0;
              item.weight = 1;

              store.add(item);
            }

            tx.oncomplete = () => {
              console.log(`Successfully saved ${joinedVocabulary.length} items to lection "${newLectionName}"`);
              resolve();
            };
          });

          document.getElementById("joinstatus").innerText = `Successfully created lection "${newLectionName}" with ${joinedVocabulary.length} items!`;
          document.getElementById("joinstatus").style.color = "green";
        } else {
          document.getElementById("joinstatus").innerText = "No vocabulary items found to join";
          document.getElementById("joinstatus").style.color = "red";
        }

        // Reset
        currentLectionsValue = "";
        joinState = "lections";

      } catch (error) {
        document.getElementById("joinstatus").innerText = "Error: " + error.message;
        document.getElementById("joinstatus").style.color = "red";
        joinState = "lections";
      }

    } else if (e.key.length === 1) {
      currentLectionsValue += e.key;
    }
  }
  document.getElementById("lectionsj").innerText = currentLectionsValue;
}

// ——— Git menu logic ———  
async function handleGitMenu(e) {
  const clearUI = () => {
    const branchList = document.getElementById("branchlist")
    const gitLog = document.getElementById("gitlog")
    if (branchList) branchList.innerHTML = ""
    if (gitLog) gitLog.innerText = ""
  }

  if (gitState === "select") {
    if (e.key === "i" || e.key === "I") {
      clearUI()
      try {
        const isInitialized = await readGit("git")
        if (isInitialized) {
          setGitFooter("Git is already initialized")
        } else {
          // Initialize git
          await writeGit("git", true)
          await writeGit("trackedFiles", [])  // store as array, no JSON string
          await writeGit("commits", [])
          await writeGit("branches", ["master"])
          await writeGit("currentBranch", "master")
          // Save current DB state under branch_master (not branch_main due to your branch name)
          await writeGit("branch_master", await readAllData())
          setGitFooter("Initialized Git")
        }
      } catch (error) {
        console.error("Git initialization error:", error)
        setGitFooter("Failed to initialize Git")
      }
    } else if (e.key === "a" || e.key === "A") {
      clearUI()
      try {
        const isInitialized = await readGit("git")
        if (!isInitialized) {
          setGitFooter("Git not initialized.")
          return
        }

        let trackedFiles = await readGit("trackedFiles")
        if (!Array.isArray(trackedFiles)) trackedFiles = []

        const newFile = await gitTextField("file")

        if (newFile === null || newFile.trim() === "") {
          setGitFooter("File add cancelled")
          return
        }

        const allLections = await readAllLections()
        if (!allLections.includes(newFile)) {
          setGitFooter(`File '${newFile}' does not exist`)
          return
        }

        if (trackedFiles.includes(newFile)) {
          setGitFooter(`'${newFile}' already tracked`)
          return
        }

        trackedFiles.push(newFile)
        await writeGit("trackedFiles", trackedFiles)
        setGitFooter(`Added '${newFile}'`)

      } catch (error) {
        console.error("Failed to add file to tracking:", error)
        setGitFooter("Failed to add file")
      }
    } else if (e.key === "c" || e.key === "C") {
      clearUI()
      try {
        const isInitialized = await readGit("git")
        if (!isInitialized) {
          setGitFooter("Git not initialized.")
          return
        }

        const commitMessage = await gitTextField("Commit Message")
        if (!commitMessage?.trim()) {
          setGitFooter("Commit cancelled")
          return
        }

        let trackedFiles = await readGit("trackedFiles")
        if (!Array.isArray(trackedFiles)) trackedFiles = []

        if (trackedFiles.length === 0) {
          setGitFooter("Nothing to commit")
          return
        }

        const trackedDataPromises = trackedFiles.map(lectionName => readLectionData(lectionName))
        const trackedDataArrays = await Promise.all(trackedDataPromises)
        const trackedVocabularyData = trackedDataArrays.flat()

        const commitHash = toHash(JSON.stringify(trackedVocabularyData) + commitMessage + Date.now())

        let commits = await readGit("commits")
        if (!Array.isArray(commits)) commits = []

        commits.push({
          hash: commitHash,
          message: commitMessage,
          time: Date.now(),
          files: trackedFiles,
          entryCount: trackedVocabularyData.length
        })

        await writeGit("commits", commits)
        await writeGit(commitHash, trackedVocabularyData)

        setGitFooter(`Committed: ${commitHash.substring(0, 7)}`)

      } catch (error) {
        console.error("Commit failed:", error)
        setGitFooter("Commit failed")
      }
    } else if (e.key === "l" || e.key === "L") {
      clearUI()
      const commits = await readGit("commits") || []
      const gitLog = document.getElementById("gitlog")
      if (!gitLog) return;

      commits.forEach(item => {
        const log1 = document.createElement("p")
        const log2 = document.createElement("p")
        const br1 = document.createElement("br")
        const log4 = document.createElement("p")
        const br2 = document.createElement("br")

        log1.innerText = "commit " + item.hash
        log1.style.color = "orange" // mimick git style
        log2.innerText = "Date: " + new Date(item.time).toString().slice(0, 24)
        log4.innerText = item.message
        log4.style.marginLeft = "20px"

        gitLog.appendChild(log1)
        gitLog.appendChild(log2)
        gitLog.appendChild(br1)
        gitLog.appendChild(log4)
        gitLog.appendChild(br2)
      })
    } else if (e.key === "h" || e.key === "H") {
      clearUI()
      const inputHash = await gitTextField("commit hash")
      if (!inputHash || inputHash.trim() === "") {
        setGitFooter("cherry-pick cancelled")
        return
      }

      const commits = await readGit("commits")
      if (!Array.isArray(commits)) {
        setGitFooter("No commits found")
        return
      }

      let foundCommit = null
      for (const commit of commits) {
        if (commit.hash === inputHash || commit.hash.startsWith(inputHash)) {
          foundCommit = commit
          break
        }
      }

      if (foundCommit) {
        const commitData = await readGit(foundCommit.hash)
        const currentData = await readAllData()

        const commitDataString = JSON.stringify(commitData.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)))
        const currentDataString = JSON.stringify(currentData.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)))

        if (commitDataString !== currentDataString) {
          const force = await gitTextField("Conflict! force? [y/n]")
          if (!force || !["y", "n"].includes(force.toLowerCase().trim())) {
            setGitFooter("Answer with 'y' or 'n'")
            return
          }

          if (force.toLowerCase().trim() === "y") {
            try {
              await deleteAllData()
              await importData(commitData)
              setGitFooter(`Cherry-picked: ${foundCommit.hash.substring(0, 7)}`)
            } catch (error) {
              console.error("Cherry-pick failed:", error)
              setGitFooter("Cherry-pick failed")
            }
          } else {
            setGitFooter("Cherry-pick aborted")
          }
        } else {
          setGitFooter("No differences")
        }
      } else {
        setGitFooter(`Commit hash not found`)
      }
    } else if (e.key === "b" || e.key === "B") {
      clearUI()
      // branch submenu entry
      gitState = "branch"
    } else if (e.key === "e" || e.key === "E") {
      clearUI()
      const branchName = await gitTextField("branch name")
      if (!branchName || !branchName.trim()) {
        setGitFooter("Branch switch cancelled")
        return
      }
      const branches = await readGit("branches") || []

      if (!branches.includes(branchName)) {
        setGitFooter(`Branch '${branchName}' does not exist`)
        return
      }

      const currentBranch = await readGit("currentBranch")

      if (currentBranch) {
        const currentData = await readAllData()
        await writeGit(`branch_${currentBranch}`, currentData)
      }

      const branchData = await readGit(`branch_${branchName}`)
      if (branchData) {
        await deleteAllData()
        await importData(branchData)
      }

      await writeGit("currentBranch", branchName)
      setGitFooter(`Switched to branch '${branchName}'`)
    } else if (e.key === "r" || e.key === "R") {
      clearUI()
      try {
        const isInitialized = await readGit("git")
        if (!isInitialized) {
          setGitFooter("Git not initialized.")
          return
        }

        let trackedFiles = await readGit("trackedFiles")
        if (!Array.isArray(trackedFiles)) trackedFiles = []

        const newFile = await gitTextField("file")

        if (newFile === null || newFile.trim() === "") {
          setGitFooter("File remove cancelled")
          return
        }

        const allLections = await readAllLections()
        if (!allLections.includes(newFile)) {
          setGitFooter(`File does not exist`)
          return
        }

        if (!trackedFiles.includes(newFile)) {
          setGitFooter(`file is not tracked`)
          return
        }

        const index = trackedFiles.indexOf(newFile)
        trackedFiles.pop(index)
        await writeGit("trackedFiles", trackedFiles)
        setGitFooter(`Removed file`)

      } catch (error) {
        console.error("Failed to remove file from tracking:", error)
        setGitFooter("Failed remove file")
      }
    }
  } else if (gitState === "branch") {
    const branchListContainer = document.getElementById("branchlist")
    if (branchListContainer) branchListContainer.innerHTML = ""

    if (e.key === "c" || e.key === "C") {
      const branchName = await gitTextField("branch name")
      if (!branchName || !branchName.trim()) {
        setGitFooter("Branch creation cancelled")
        gitState = "select"
        return
      }

      const branches = await readGit("branches") || []
      if (branches.includes(branchName)) {
        setGitFooter(`Branch '${branchName}' already exists`)
        gitState = "select"
        return
      }

      // Save current data before creating a new branch variable to store current state
      const currentData = await readAllData()

      branches.push(branchName)
      await writeGit("branches", branches)
      await writeGit(`branch_${branchName}`, currentData)

      setGitFooter(`Created branch '${branchName}'`)
      gitState = "select"
    } else if (e.key === "l" || e.key === "L") {
      const branches = await readGit("branches") || []
      const currentBranch = await readGit("currentBranch") || "main"

      const branchListContainer = document.getElementById("branchlist")
      if (branchListContainer) branchListContainer.innerHTML = ""

      for (const branch of branches) {
        const marker = branch === currentBranch ? "* " : "  "
        const branchElement = document.createElement("p")
        branchElement.innerText = `${marker}${branch}`
        branchListContainer.appendChild(branchElement)
      }
    } else if (e.key === "d" || e.key === "D") {
      const branchName = await gitTextField("branch name")
      if (!branchName || !branchName.trim()) {
        setGitFooter("Branch deletion cancelled")
        gitState = "select"
        return
      }
      const branches = await readGit("branches") || []
      const currentBranch = await readGit("currentBranch")

      if (branchName === "main" || branchName === "master") {
        setGitFooter("Cannot delete main or master branch")
        gitState = "select"
        return
      }

      if (branchName === currentBranch) {
        setGitFooter("Cannot delete current branch")
        gitState = "select"
        return
      }

      if (!branches.includes(branchName)) {
        setGitFooter(`Branch '${branchName}' does not exist`)
        gitState = "select"
        return
      }

      const updatedBranches = branches.filter(b => b !== branchName)
      await writeGit("branches", updatedBranches)
      await writeGit(`branch_${branchName}`, null)

      setGitFooter(`Deleted branch '${branchName}'`)
      gitState = "select"
    } else if (e.key === "Escape") {
      gitState = "select"
      setGitFooter("Back to git menu")
    }
  }
}
function toHash(str) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return (hash >>> 0).toString(16).substring(0, 7)
}

function gitTextField(prefix) {
  return new Promise((resolve) => {
    const paramm = document.getElementById("gitparamf")
    const paramText = document.getElementById("gitparam")
    const paramValue = document.getElementById("gitparamv")

    const originalGitState = gitState

    gitState = "textField"
    paramm.style.display = "block"
    paramText.innerHTML = prefix // allows HTML injection
    paramValue.innerText = ""
    currentGitValue = ""

    const textFieldHandler = (e) => {
      if (gitState !== "textField") return

      if (e.key === "Backspace") {
        currentGitValue = currentGitValue.slice(0, -1)
        paramValue.innerText = currentGitValue
        e.preventDefault()
      } else if (e.key === "Enter") {
        const value = currentGitValue
        cleanupTextField()
        document.removeEventListener("keydown", textFieldHandler)
        resolve(value)
        e.preventDefault()
      } else if (e.key === "Escape" || e.key === "-") {
        cleanupTextField()
        document.removeEventListener("keydown", textFieldHandler)
        resolve(null)
        e.preventDefault()
      } else if (e.key.length === 1) {
        currentGitValue += e.key
        paramValue.innerText = currentGitValue
        e.preventDefault()
      }
    }

    const cleanupTextField = () => {
      gitState = originalGitState
      paramm.style.display = "none"
      paramText.innerText = ""
      paramValue.innerText = ""
      currentGitValue = ""
    }

    // Add event listener for text field
    document.addEventListener("keydown", textFieldHandler)
  })
}
function setGitFooter(msg) {
  document.getElementById("gitfooter").innerText = mkbanner(msg, 45, "-")
}

// ——— Git Status menu logic ———
async function handleStatusMenu() {
  let gitState = false
  if (await readGit("git")) {
    gitState = true
    document.getElementById("gitstatus").innerText = "Enabled"
    document.getElementById("ifgit").style.display = "block"
    document.getElementById("modifiedfiles").innerHTML = ""
    // Render untrackedFiles
    const trackedFilesJson = await readGit("trackedFiles")
    const trackedFiles = trackedFilesJson ? trackedFilesJson : []
    const allFiles = await readAllLections()
    const untrackedFiles = allFiles.filter(file => !trackedFiles.includes(file))

    document.getElementById("untracked").innerHTML = ""
    untrackedFiles.forEach((item) => {
      const untrackedFileElement = document.createElement("p")
      untrackedFileElement.innerText = item
      untrackedFileElement.style.marginLeft = "20px"
      untrackedFileElement.style.color = "red"
      document.getElementById("untracked").appendChild(untrackedFileElement)
    })
    // Get modified files
    const commits = await readGit("commits") || []
    if (commits.length === 0) return await readAllLections()

    const lastCommitData = await readGit(commits[commits.length - 1].hash)
    if (!lastCommitData) return []

    const currentData = await readAllData()

    const groupByLection = (data) =>
      data.reduce((acc, item) => {
        if (!acc[item.lection]) acc[item.lection] = []
        acc[item.lection].push(item)
        return acc
      }, {})

    const lastCommitByLection = groupByLection(lastCommitData)
    const currentByLection = groupByLection(currentData)

    const allLections = [...new Set([...Object.keys(lastCommitByLection), ...Object.keys(currentByLection)])]

    const modifiedFiles = allLections.filter(lection =>
      JSON.stringify(lastCommitByLection[lection] || []) !== JSON.stringify(currentByLection[lection] || [])
    )
    // render modified files
    modifiedFiles.forEach((item) => {
      const modifiedElement = document.createElement("p")
      modifiedElement.innerText = "modified: " + item
      modifiedElement.style.marginLeft = "20px"
      modifiedElement.style.color = "red"
      document.getElementById("modifiedfiles").appendChild(modifiedElement)
    })
  } else {
    gitState = false
    document.getElementById("gitstatus").innerText = "Disabled"
    document.getElementById("ifgit").style.display = "none"
  }
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
        document.getElementById("idc").style.color = "#5294e2"
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
          document.getElementById("keyc").style.color = "#5294e2"
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
      document.getElementById("valuec").style.color = "#5294e2"
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
      document.getElementById("idc").style.color = "#5294e2"
      document.getElementById("keyc").style.color = "#5294e2"
      document.getElementById("valuec").style.color = "#5294e2"

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
      document.getElementById("key").style.color = "#5294e2"
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
    const sortProp = param || "vocabWord"
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
    // Remove all over specified value
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

  return new Promise((resolve, reject) => {
    if (!db) return reject("Database not available")

    const tx = db.transaction("vocabulary", "readwrite")
    const store = tx.objectStore("vocabulary")

    tx.oncomplete = () => {
      console.log(`Successfully created ${result.length} entries in lection: ${target}`)
      document.getElementById("ttransto").innerText = target
      resolve(result)
    }

    tx.onerror = (event) => {
      console.error("Transaction failed:", event.target.error)
      reject(event.target.error)
    }

    result.forEach((item) => {
      const request = store.put({
        vocabWord: item.vocabWord,
        value: item.value,
        lection: target,
        weight: 1,
        wrong: 0,
        right: 0,
      })

      request.onerror = (event) => {
        console.error("Failed to add item:", item.vocabWord, event.target.error)
      }
    })
  })
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
  sessionAttempts.clear()
  currentSessionScore = 0
  trainstate = "lection"
  currentLectionValue = ""
  selectedLection = ""
  wrongAttempts.clear()
  currentKey = ""
  trainStats = {
    totalCorrect: 0,
    totalWrong: 0,
    hardestWord: { key: "", attempts: 0 },
    maxAttemptsPerWord: new Map()
  }
  document.getElementById("tlection").innerText = ""
  document.getElementById("tlectiont").style.color = "white"
  document.getElementById("tkey").innerText = ""
  document.getElementById("tkey").style.color = "#5294e2"
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
      document.getElementById("tvalue").style.color = "#5294e2"
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

    const lectionData = await readLectionData(selectedLection || currentLectionValue);
    let totalWrong = 0;
    let totalRight = 0;

    lectionData.forEach(word => {
      const right = word.right || 0;
      const wrong = word.wrong || 0;
      totalRight += right;
      totalWrong += wrong;
    });

    const attemptsArray = Array.from(sessionAttempts.values());
    const totalAttempts = attemptsArray.reduce((a, b) => a + b, 0);
    const totalVocabulary = dataToTrain.length;

    const avgAttempt = totalVocabulary > 0 ? (totalAttempts / totalVocabulary).toFixed(2) : "0.00"
    const successScore = Math.round(currentSessionScore / totalVocabulary * 100)

    document.getElementById("tkey").innerText = ""
    document.getElementById("tvalue").innerText = ""

    document.getElementById("stats").style.display = "block"
    document.getElementById("nstats").style.display = "none"

    document.getElementById("s1").innerText = trainStats.totalCorrect
    document.getElementById("s2").innerText = trainStats.totalWrong
    document.getElementById("s3").innerText = trainStats.hardestWord.key
    document.getElementById("s4").innerText = trainStats.hardestWord.attempts
    document.getElementById("s5").innerText = avgAttempt
    document.getElementById("s6").innerText = successScore

    {
      writeGP(currentLectionValue + "_success_last", successScore)
      const key = currentLectionValue + "_success"
      let history = await readGP(key)
      if (!Array.isArray(history)) history = []
      history.push(successScore)
      await writeGP(key, history)
    }

    {
      writeGP(currentLectionValue + "_attempt_last", avgAttempt)

      const key = currentLectionValue + "_attempt";
      let history = await readGP(key);
      if (!Array.isArray(history)) history = [];
      history.push(avgAttempt);
      await writeGP(key, history);
    }

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
  document.getElementById("trainfooter").innerText = mkBannerProgress(`${done}/${dataToTrain.length}`, 45, "-", "=", Math.round((done / dataToTrain.length) * 45))
}

async function checkAnswer() {
  const vocabWord = currentKey
  const correctValue = await getData(vocabWord)
  const tval = currentTValueValue.trim()
  const tvElt = document.getElementById("tvalue")
  sessionAttempts.set(vocabWord, (sessionAttempts.get(vocabWord) || 0) + 1)

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

  const currentWrongAttempts = wrongAttempts.get(vocabWord) || 0

  const newWrongAttempts = isCorrect ? currentWrongAttempts : currentWrongAttempts + 1

  const tx = db.transaction("vocabulary", "readwrite")
  const store = tx.objectStore("vocabulary")
  const index = store.index("vocabWord")
  const rq = index.get(vocabWord)

  rq.onsuccess = () => {
    const data = rq.result
    if (!data) return

    if (isCorrect) {
      if (currentWrongAttempts === 0) {
        currentSessionScore += 1
      } else if (currentWrongAttempts === 1) {
        currentSessionScore += 0.5
      }
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
      tvElt.style.color = "#5294e2"
      nextQuestion()
    }, 500)
  } else {
    trainStats.totalWrong++

    wrongAttempts.set(vocabWord, newWrongAttempts)

    const maxAttempts = Math.max(
      trainStats.maxAttemptsPerWord.get(vocabWord) || 0,
      newWrongAttempts
    )
    trainStats.maxAttemptsPerWord.set(vocabWord, maxAttempts)

    if (maxAttempts > trainStats.hardestWord.attempts) {
      trainStats.hardestWord = { key: vocabWord, attempts: maxAttempts }
    }

    if (newWrongAttempts >= 3) {
      trainstate = "showingSolution"
      currentSessionScore -= 1
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

      if (shuffledKeys.length > 0) {
        const insertPosition = Math.floor(shuffledKeys.length * 0.3)
        shuffledKeys.splice(insertPosition, 0, vocabWord)
      } else {
        shuffledKeys.push(vocabWord)
      }
    } else {
      setTimeout(() => {
        tvElt.style.color = "#5294e2"
        currentTValueValue = ""
        tvElt.innerText = "???"
      }, 500)
    }
  }
}

// ——— Banner init ———

function mkBannerProgress(text, width, sep, fillsep, fill) {
  const textLen = text.length
  const barLen = width

  const pad = barLen - textLen
  const lpad = Math.floor(pad / 2)
  const rpad = Math.ceil(pad / 2)

  const leftFill = Math.min(fill, lpad)
  const rightFill = Math.max(0, fill - leftFill)

  const left = fillsep.repeat(leftFill) + sep.repeat(lpad - leftFill)
  const right = fillsep.repeat(rightFill) + sep.repeat(rpad - rightFill)

  return left + text + right
}

function mkbanner(text, width, sep) {
  const pad = width - text.length
  const l = Math.floor(pad / 2),
    r = Math.ceil(pad / 2)
  return sep.repeat(l) + text + sep.repeat(r)
}

document.getElementById("statusheader").innerText = mkbanner("Git Status", 45, "-")
document.getElementById("correctbanner").innerText = mkbanner("Correct vocabulary", 45, "-")
document.getElementById("statsbanner").innerText = mkbanner("Training Statistics", 45, "=")
document.getElementById("vocbanner").innerText = mkbanner("TinyVoc", 45, "-")
document.getElementById("addbanner").innerText = mkbanner("Add vocabulary", 45, "-")
document.getElementById("trainbanner").innerText = mkbanner("Train vocabulary", 45, "-")
document.getElementById("viewbanner").innerText = mkbanner("View vocabulary", 45, "-")
document.getElementById("printfooter").innerText = mkbanner("Generated by TinyVoc", 50, "-")
document.getElementById("generateheader").innerText = mkbanner("Generate List", 45, "-")
document.getElementById("trainfooter").innerText = mkbanner("0/0", 45, "-")
document.getElementById("lectionviewheader").innerText = mkbanner("Lection View", 45, "-")
document.getElementById("moveheader").innerText = mkbanner("Move List", 45, "-")
document.getElementById("joinheader").innerText = mkbanner("Join Lections", 45, "-")
document.getElementById("broadcastheader").innerText = mkbanner("Broadcast", 45, "-")
document.getElementById("githeader").innerText = mkbanner("Git", 45, "-")
document.getElementById("docsheader").innerText = mkbanner("TinyVoc Docs", 45, "-")
document.getElementById("figureheader").innerText = mkbanner("Figure View", 45, "-")
document.getElementById("statsfooter").innerText = mkbanner("", 45, "=")
document.getElementById("movefooter").innerText = mkbanner("", 45, "-")
document.getElementById("correctfooter").innerText = mkbanner("", 45, "-")
document.getElementById("vocfooter").innerText = mkbanner("", 45, "-")
document.getElementById("statusfooter").innerText = mkbanner("", 45, "-")
document.getElementById("addfooter").innerText = mkbanner("", 45, "-")
document.getElementById("viewfooter").innerText = mkbanner("", 45, "-")
document.getElementById("generatefooter").innerText = mkbanner("", 45, "-")
document.getElementById("docsfooter").innerText = mkbanner("", 45, "-")
document.getElementById("lectionviewfooter").innerText = mkbanner("", 45, "-")
document.getElementById("broadcastfooter").innerText = mkbanner("", 45, "-")
document.getElementById("figurefooter").innerText = mkbanner("", 45, "-")
document.getElementById("gitfooter").innerText = mkbanner("", 45, "-")
document.getElementById("joinfooter").innerText = mkbanner("", 45, "-")

// ——— IndexedDB & data helpers ———

function initDB() {
  const req = indexedDB.open("vocTrainerDB", 6)
  req.onupgradeneeded = (e) => {
    db = e.target.result

    if (db.objectStoreNames.contains("vocabulary")) {
      db.deleteObjectStore("vocabulary")
    }

    const vocabStore = db.createObjectStore("vocabulary", {
      keyPath: "id",
      autoIncrement: true,
    })

    vocabStore.createIndex("vocabWord", "vocabWord", { unique: false })

    // Config table
    if (!db.objectStoreNames.contains("config")) {
      db.createObjectStore("config", { keyPath: "key" })
    }

    // Git table
    if (!db.objectStoreNames.contains("git")) {
      db.createObjectStore("git", { keyPath: "key" })
    }

    // General Purpose table
    if (!db.objectStoreNames.contains('GeneralPurpose')) {
      db.createObjectStore('GeneralPurpose', { keyPath: 'key' })
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

async function writeGP(key, value) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(['GeneralPurpose'], 'readwrite')
      const store = tx.objectStore('GeneralPurpose')

      const data = {
        key: key,
        value: value,
        timestamp: Date.now()
      }

      const request = store.put(data)

      request.onsuccess = () => {
        console.log(`GP: Saved ${key}`)
        resolve(true)
      }

      request.onerror = () => {
        console.error(`GP: Failed to save ${key}:`, request.error)
        reject(request.error)
      }

      tx.onerror = () => {
        console.error(`GP: Transaction failed for ${key}:`, tx.error)
        reject(tx.error)
      }

    } catch (error) {
      console.error(`GP: Error writing ${key}:`, error)
      reject(error)
    }
  })
}

async function readGP(key) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(['GeneralPurpose'], 'readonly')
      const store = tx.objectStore('GeneralPurpose')
      const request = store.get(key)

      request.onsuccess = () => {
        if (request.result) {
          console.log(`GP: Retrieved ${key}`)
          resolve(request.result.value)
        } else {
          console.log(`GP: Key ${key} not found`)
          resolve(null)
        }
      }

      request.onerror = () => {
        console.error(`GP: Failed to read ${key}:`, request.error)
        reject(request.error)
      }

      tx.onerror = () => {
        console.error(`GP: Transaction failed for ${key}:`, tx.error)
        reject(tx.error)
      }

    } catch (error) {
      console.error(`GP: Error reading ${key}:`, error)
      reject(error)
    }
  })
}

function writeGit(key, value) {
  return new Promise((resolve, reject) => {
    if (!db) return reject("Database not available")

    const tx = db.transaction("git", "readwrite")
    const store = tx.objectStore("git")
    const request = store.put({ key, value })

    request.onsuccess = () => {
      console.log(`Git entry written: ${key} = ${value}`)
      resolve()
    }

    request.onerror = () => {
      console.error(`Failed to write git entry: ${key}`, request.error)
      reject(request.error)
    }
  })
}

function readGit(key) {
  return new Promise((resolve, reject) => {
    if (!db) return reject("Database not available")

    const tx = db.transaction("git", "readonly")
    const store = tx.objectStore("git")
    const request = store.get(key)

    request.onsuccess = () => {
      const result = request.result
      if (result) {
        resolve(result.value)
      } else {
        resolve(null) // Key not found
      }
    }

    request.onerror = () => {
      console.error(`Failed to read git entry: ${key}`, request.error)
      reject(request.error)
    }
  })
}

function readAllGit() {
  return new Promise((resolve, reject) => {
    if (!db) return reject("Database not available")

    const tx = db.transaction("git", "readonly")
    const store = tx.objectStore("git")
    const request = store.getAll()

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      console.error("Failed to read all git entries", request.error)
      reject(request.error)
    }
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
  return new Promise((resolve, reject) => {
    if (!db) return reject("Database not available")

    const tx = db.transaction("vocabulary", "readwrite")
    const store = tx.objectStore("vocabulary")
    const request = store.clear()

    request.onsuccess = () => {
      console.log("All data deleted successfully")
      resolve()
    }

    request.onerror = (e) => {
      console.error("Failed to delete data:", e.target.error)
      reject(e.target.error)
    }
  })
}

function importData(data) {
  return new Promise((resolve, reject) => {
    if (!db) return reject("Database not available")

    if (!data || !Array.isArray(data) || data.length === 0) {
      return reject("Invalid or empty data array")
    }

    const tx = db.transaction("vocabulary", "readwrite")
    const store = tx.objectStore("vocabulary")
    let completed = 0
    let skipped = 0
    const total = data.length
    let hasError = false

    tx.oncomplete = () => {
      if (!hasError) {
        console.log(`Import completed: ${completed} imported, ${skipped} skipped/updated`)
        resolve({ imported: completed, skipped: skipped })
      }
    }

    tx.onerror = (e) => {
      hasError = true
      console.error("Import transaction failed:", e.target.error)
      reject(e.target.error)
    }

    data.forEach((item, index) => {
      try {
        const itemToStore = {
          vocabWord: item.vocabWord || "",
          value: item.value || "",
          lection: item.lection || "",
          weight: item.weight || 1,
          wrong: item.wrong || 0,
          right: item.right || 0
        }

        const vocabIndex = store.index("vocabWord")
        const checkRequest = vocabIndex.get(itemToStore.vocabWord)

        checkRequest.onsuccess = () => {
          const existingEntry = checkRequest.result

          if (existingEntry) {
            const updateRequest = store.put({
              ...itemToStore,
              id: existingEntry.id
            })

            updateRequest.onsuccess = () => {
              skipped++
              completed++
              console.log(`Updated existing entry: ${itemToStore.vocabWord}`)
            }

            updateRequest.onerror = (e) => {
              console.error(`Failed to update item ${index}:`, itemToStore, e.target.error)
              completed++
            }
          } else {
            const addRequest = store.add(itemToStore)

            addRequest.onsuccess = () => {
              completed++
              console.log(`Added new entry: ${itemToStore.vocabWord}`)
            }

            addRequest.onerror = (e) => {
              console.error(`Failed to add item ${index}:`, itemToStore, e.target.error)
              completed++
            }
          }
        }

        checkRequest.onerror = (e) => {
          console.error(`Failed to check existing item ${index}:`, itemToStore, e.target.error)
          completed++
        }

      } catch (error) {
        console.error(`Error processing item ${index}:`, item, error)
        completed++
      }
    })
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
  fileInput.value = ""

  fileInput.onchange = () => {
    const file = fileInput.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      let importedData
      let keydownHandler

      try {
        importedData = JSON.parse(e.target.result)

        if (!Array.isArray(importedData)) {
          throw new Error("Data must be an array")
        }

        fileInput.style.display = "none"
        importText.style.display = "block"
        importText.innerHTML =
          `Found ${importedData.length} entries. <br>` +
          "<strong>ADD (b)</strong>: Keep all existing data + add new entries<br>" +
          "<strong>OVERWRITE (o)</strong>: Delete everything + import these entries<br>" +
          "<strong>ESC</strong>: Cancel"

        keydownHandler = async (ev) => {
          document.removeEventListener("keydown", keydownHandler)

          try {
            if (ev.key === "b" || ev.key === "B") {
              importText.innerHTML = "ADD MODE: Adding new vocabulary (existing data safe)..."
              importText.style.color = "#5294e2"

              const result = await addOnlyImportData(importedData)

              importText.innerHTML =
                `ADD MODE Complete!<br>` +
                `• ${result.added} new entries added<br>` +
                `• ${result.skipped} duplicates skipped<br>` +
                `• All existing data preserved<br>` +
                `Reloading in 3 seconds...`
              importText.style.color = "green"

              setTimeout(() => location.reload(), 3000)

            } else if (ev.key === "o" || ev.key === "O") {
              importText.innerHTML = "OVERWRITE MODE: This will delete ALL existing data!"
              importText.style.color = "red"

              setTimeout(async () => {
                try {
                  await overwriteImportData(importedData)

                  importText.innerHTML =
                    `OVERWRITE Complete!<br>` +
                    `All old data deleted<br>` +
                    `${importedData.length} new entries imported<br>` +
                    `Reloading in 2 seconds...`
                  importText.style.color = "green"

                  setTimeout(() => location.reload(), 2000)
                } catch (error) {
                  importText.innerHTML = `OVERWRITE Failed: ${error.message}`
                  importText.style.color = "red"
                  setTimeout(() => location.reload(), 3000)
                }
              }, 1000)

            } else if (ev.key === "Escape") {
              importText.style.display = "none"
              fileInput.style.display = "block"
              return
            } else {
              document.addEventListener("keydown", keydownHandler)
              return
            }
          } catch (error) {
            console.error("Import operation failed:", error)
            importText.innerHTML = `Import failed: ${error.message}<br>Press any key to reload.`
            importText.style.color = "red"

            const errorHandler = () => {
              document.removeEventListener("keydown", errorHandler)
              location.reload()
            }
            document.addEventListener("keydown", errorHandler)
          }
        }

        document.addEventListener("keydown", keydownHandler)

      } catch (error) {
        console.error("File parsing error:", error)
        importText.style.display = "block"
        fileInput.style.display = "none"
        importText.innerHTML = "Invalid file format. Press any key to try again."
        importText.style.color = "red"

        const parseErrorHandler = () => {
          document.removeEventListener("keydown", parseErrorHandler)
          importText.style.color = ""
          getFile()
        }
        document.addEventListener("keydown", parseErrorHandler)
      }
    }

    reader.readAsText(file)
  }
}

function addOnlyImportData(data) {
  return new Promise((resolve, reject) => {
    if (!db) return reject("Database not available")

    if (!data || !Array.isArray(data) || data.length === 0) {
      return reject("Invalid or empty data array")
    }

    console.log("ADD MODE: Starting safe import - no existing data will be deleted")

    let processed = 0
    let added = 0
    let skipped = 0
    const total = data.length
    const results = []

    const processNextItem = (index) => {
      if (index >= total) {
        console.log(`ADD MODE completed: ${added} added, ${skipped} skipped (duplicates)`)
        resolve({ added, skipped, total: processed })
        return
      }

      const item = data[index]

      // Create clean object without ID
      const cleanItem = {
        vocabWord: (item.vocabWord || "").toString(),
        value: (item.value || "").toString(),
        lection: (item.lection || "").toString(),
        weight: item.weight || 1,
        wrong: item.wrong || 0,
        right: item.right || 0
      }

      const tx = db.transaction("vocabulary", "readonly")
      const store = tx.objectStore("vocabulary")
      const vocabIndex = store.index("vocabWord")
      const checkRequest = vocabIndex.get(cleanItem.vocabWord)

      checkRequest.onsuccess = () => {
        if (checkRequest.result) {
          console.log(`Skipping existing vocabulary: ${cleanItem.vocabWord}`)
          skipped++
          processed++
          processNextItem(index + 1)
        } else {
          const addTx = db.transaction("vocabulary", "readwrite")
          const addStore = addTx.objectStore("vocabulary")
          const addRequest = addStore.add(cleanItem)

          addRequest.onsuccess = () => {
            console.log(`Added new vocabulary: ${cleanItem.vocabWord}`)
            added++
            processed++
            processNextItem(index + 1)
          }

          addRequest.onerror = (e) => {
            console.log(`Failed to add ${cleanItem.vocabWord}:`, e.target.error)
            skipped++
            processed++
            processNextItem(index + 1)
          }
        }
      }

      checkRequest.onerror = (e) => {
        console.error(`Error checking vocabulary ${cleanItem.vocabWord}:`, e.target.error)
        skipped++
        processed++
        processNextItem(index + 1)
      }
    }

    // Start processing
    processNextItem(0)
  })
}

function overwriteImportData(data) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("OVERWRITE MODE: Deleting all existing data first")
      await deleteAllData()

      console.log("OVERWRITE MODE: Adding new data")
      await addOnlyImportData(data)

      resolve()
    } catch (error) {
      reject(error)
    }
  })
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
    const newVocabWord = item.vocabWord + uniqueKeyChar
    store.put({
      vocabWord: newVocabWord,
      value: item.value,
      lection: outputLection,
      weight: item.weight || 1,
      wrong: 0,
      right: 0,
    })
  })

  return result
}
initDB()
