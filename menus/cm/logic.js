// logic.js - logic for correct menu
import { vars } from "../../scripts/vars.js"
import { readAllLections, readLectionData } from "../../scripts/dbHelpers/read.js"
import { updateVocabularyEntry } from "../mvm/updateVocabularyEntry.js"
import { createInputHandler } from "../../scripts/inputHandler.js"

const handleCorrectMenu = createInputHandler({
  getCurrentState: () => vars.correctState,

  getCurrentValue: (state) => {
    switch (state) {
      case "lection": return vars.currentLectionCValue
      case "id": return vars.currentIdCValue
      case "key": return vars.currentKeyCValue
      case "value": return vars.currentValueCValue
      default: return ""
    }
  },

  setCurrentValue: (state, value) => {
    switch (state) {
      case "lection": vars.currentLectionCValue = value; break
      case "id": vars.currentIdCValue = value; break
      case "key": vars.currentKeyCValue = value; break
      case "value": vars.currentValueCValue = value; break
    }
  },

  getElement: (state) => {
    switch (state) {
      case "lection": return document.getElementById("lectionc")
      case "id": return document.getElementById("idc")
      case "key": return document.getElementById("keyc")
      case "value": return document.getElementById("valuec")
      default: return null
    }
  },

  onEnter: async (state, value, element) => {
    switch (state) {
      case "lection": {
        const lections = await readAllLections()
        if (lections.includes(value)) {
          element.style.color = "white"
          vars.correctState = "id"
          document.getElementById("idc").style.color = "#5294e2"
        } else {
          element.style.color = "#ea4f4f"
        }
        return { preventDefault: true }
      }

      case "id": {
        const idNum = parseInt(value)
        if (!isNaN(idNum)) {
          const lectionData = await readLectionData(vars.currentLectionCValue)
          const entry = lectionData.find(item => item.id === idNum)
          if (entry) {
            element.style.color = "white"
            vars.correctState = "key"
            document.getElementById("keyc").style.color = "#5294e2"

            vars.currentKeyCValue = entry.vocabWord
            vars.currentValueCValue = entry.value

            document.getElementById("keyc").innerText = vars.currentKeyCValue
            document.getElementById("valuec").innerText = vars.currentValueCValue
          } else {
            element.style.color = "#ea4f4f"
          }
        } else {
          element.style.color = "#ea4f4f"
        }
        return { preventDefault: true }
      }

      case "key":
        element.style.color = "white"
        vars.correctState = "value"
        document.getElementById("valuec").style.color = "#5294e2"
        return { preventDefault: true }

      case "value":
        await updateVocabularyEntry(
          parseInt(vars.currentIdCValue),
          vars.currentKeyCValue,
          vars.currentValueCValue
        )

        element.style.color = "white"
        vars.correctState = "id"
        vars.currentIdCValue = ""
        vars.currentKeyCValue = ""
        vars.currentValueCValue = ""

        document.getElementById("idc").innerText = ""
        document.getElementById("keyc").innerText = ""
        document.getElementById("valuec").innerText = ""
        document.getElementById("idc").style.color = "#5294e2"
        document.getElementById("keyc").style.color = "#5294e2"
        document.getElementById("valuec").style.color = "#5294e2"
        return { preventDefault: true }
    }
  },

  updateDisplay: (_, value, element) => {
    if (element) element.innerText = value
  }
})

export { handleCorrectMenu }
