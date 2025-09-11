// logic.js - logic for correct menu
import { vars } from "../../scripts/vars.js"
import { readAllLections } from "../../scripts/dbHelpers/read.js"
import { readLectionData } from "../../scripts/dbHelpers/read.js"
import { updateVocabularyEntry } from "../mvm/updateVocabularyEntry.js"

async function handleCorrectMenu(e) {
  if (vars.correctState === "lection") {
    if (e.key === "Backspace") {
      vars.currentLectionCValue = vars.currentLectionCValue.slice(0, -1)
    } else if (e.key === "Enter") {
      const lections = await readAllLections()
      if (lections.includes(vars.currentLectionCValue)) {
        document.getElementById("lectionc").style.color = "white"
        vars.correctState = "id"
        document.getElementById("idc").style.color = "#5294e2"
      } else {
        document.getElementById("lectionc").style.color = "#ea4f4f"
      }
      e.preventDefault()
    } else if (e.key.length === 1) {
      vars.currentLectionCValue += e.key
    }
    document.getElementById("lectionc").innerText = vars.currentLectionCValue
  } else if (vars.correctState === "id") {
    if (e.key === "Backspace") {
      vars.currentIdCValue = vars.currentIdCValue.slice(0, -1)
    } else if (e.key === "Enter") {
      const idNum = parseInt(vars.currentIdCValue)
      if (!isNaN(idNum)) {
        const lectionData = await readLectionData(vars.currentLectionCValue)
        const entryExists = lectionData.find((item) => item.id === idNum)
        if (entryExists) {
          document.getElementById("idc").style.color = "white"
          vars.correctState = "key"
          document.getElementById("keyc").style.color = "#5294e2"
          vars.currentKeyCValue = entryExists.vocabWord
          vars.currentValueCValue = entryExists.value

          document.getElementById("keyc").innerText = vars.currentKeyCValue
          document.getElementById("valuec").innerText = vars.currentValueCValue
        } else {
          document.getElementById("idc").style.color = "#ea4f4f"
        }
      } else {
        document.getElementById("idc").style.color = "#ea4f4f"
      }
      e.preventDefault()
    } else if (e.key.length === 1) {
      vars.currentIdCValue += e.key
    }
    document.getElementById("idc").innerText = vars.currentIdCValue
  } else if (vars.correctState === "key") {
    if (e.key === "Backspace") {
      vars.currentKeyCValue = vars.currentKeyCValue.slice(0, -1)
    } else if (e.key === "Enter") {
      document.getElementById("keyc").style.color = "white"
      vars.correctState = "value"
      document.getElementById("valuec").style.color = "#5294e2"
      e.preventDefault()
    } else if (e.key.length === 1) {
      vars.currentKeyCValue += e.key
    }
    document.getElementById("keyc").innerText = vars.currentKeyCValue
  } else if (vars.correctState === "value") {
    if (e.key === "Backspace") {
      vars.currentValueCValue = vars.currentValueCValue.slice(0, -1)
    } else if (e.key === "Enter") {
      await updateVocabularyEntry(
        parseInt(vars.currentIdCValue),
        vars.currentKeyCValue,
        vars.currentValueCValue,
      )

      document.getElementById("valuec").style.color = "white"
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

      e.preventDefault()
    } else if (e.key.length === 1) {
      vars.currentValueCValue += e.key
    }
    document.getElementById("valuec").innerText = vars.currentValueCValue
  }
}
export { handleCorrectMenu }
