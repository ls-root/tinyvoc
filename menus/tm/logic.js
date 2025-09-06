// logic.js - logic for train menu
import { vars } from "../../scripts/vars.js"
import { readAllLections, readLectionData } from "../../scripts/dbHelpers/read.js"
import { nextQuestion } from "./nextQuestion.js"
import { checkAnswer } from "./checkAnswer.js"

async function handleTrainMenu(e) {
  if (vars.trainstate === "lection") {
    if (e.key === "Backspace")
      vars.currentLectionValue = vars.currentLectionValue.slice(0, -1)
    else if (e.key === "Enter") {
      const lections = await readAllLections()
      if (lections.includes(vars.currentLectionValue)) {
        vars.selectedLection = vars.currentLectionValue
        document.getElementById("tlection").style.color = "white"
        document.getElementById("tlection").innerText = vars.selectedLection
        vars.dataToTrain = await readLectionData(vars.selectedLection)
        vars.shuffledKeys = vars.dataToTrain
          .map((x) => x.vocabWord) // Use vocabWord field
          .sort(() => Math.random() - 0.5)
        vars.wrongAttempts.clear()
        vars.trainstate = "quiz"
        nextQuestion()
      } else {
        document.getElementById("tlection").style.color = "red"
      }
      e.preventDefault()
    } else if (e.key.length === 1) vars.currentLectionValue += e.key
    document.getElementById("tlection").innerText = vars.currentLectionValue
  } else if (vars.trainstate === "quiz") {
    if (e.key === "Backspace")
      vars.currentTValueValue = vars.currentTValueValue.slice(0, -1)
    else if (e.key === "Enter") {
      await checkAnswer()
      e.preventDefault()
    } else if (e.key.length === 1 || e.key === " ") vars.currentTValueValue += e.key
    document.getElementById("tvalue").innerText = vars.currentTValueValue || "???"
  } else if (vars.trainstate === "showingSolution") {
    if (e.key === "Enter") {
      vars.trainstate = "quiz"
      vars.currentTValueValue = "" // Reset input
      document.getElementById("tvalue").style.color = "#5294e2"
      nextQuestion()
      e.preventDefault()
    }
  }
}

export { handleTrainMenu }
