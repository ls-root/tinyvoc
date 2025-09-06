// trainInit.js - initialize trainig
import { vars } from "../../scripts/vars.js"
import { mkbanner } from "../../scripts/sharedHelpers/banner.js"

async function trainInit() {
  vars.sessionAttempts.clear()
  vars.currentSessionScore = 0
  vars.trainstate = "lection"
  vars.currentLectionValue = ""
  vars.selectedLection = ""
  vars.wrongAttempts.clear()
  vars.currentKey = ""
  vars.trainStats = {
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
export { trainInit }
