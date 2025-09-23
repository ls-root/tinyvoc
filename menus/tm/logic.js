// logic.js - logic for train menu
import { vars } from "../../scripts/vars.js"
import { readAllLections, readLectionData } from "../../scripts/dbHelpers/read.js"
import { createInputHandler } from "../../scripts/inputHandler.js"
import { nextQuestion } from "./nextQuestion.js"
import { checkAnswer } from "./checkAnswer.js"

const handleTrainMenu = createInputHandler({
  getCurrentState: () => vars.trainstate,

  getCurrentValue: (state) => {
    switch (state) {
      case "lection": return vars.currentLectionValue;
      case "quiz": return vars.currentTValueValue;
      default: return "";
    }
  },

  setCurrentValue: (state, value) => {
    switch (state) {
      case "lection": vars.currentLectionValue = value; break;
      case "quiz": vars.currentTValueValue = value; break;
    }
  },

  getElement: (state) => {
    switch (state) {
      case "lection": return document.getElementById("tlection");
      case "quiz": return document.getElementById("tvalue");
      default: return null;
    }
  },

  onEnter: async (state, value, element) => {
    switch (state) {
      case "lection": {
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
          document.getElementById("tlection").style.color = "#ea4f4f"
        }
        break;
      }

      case "quiz": {
        await checkAnswer()
        return { preventDefault: true };
      }

      case "showingSolution": {
        vars.trainstate = "quiz"
        vars.currentTValueValue = "" // Reset input
        document.getElementById("tvalue").style.color = "#5294e2"
        nextQuestion()
        return { preventDefault: true };
      }
    }
  },

  updateDisplay: (state, value, element) => {
    if (element) {
      if (state === "quiz") {
        element.innerText = value || "???";
      } else {
        element.innerText = value;
      }
    }
  }
})

export { handleTrainMenu }
