// logic.js - logic for generate menu
import { vars } from "../../scripts/vars.js"
import { GenerateList } from "./generateList.js"
import { readAllLections } from "../../scripts/dbHelpers/read.js"
import { createInputHandler } from "../../scripts/inputHandler.js"

const handleGenerateMenu = createInputHandler({
  getCurrentState: () => vars.generateState,

  getCurrentValue: (state) => {
    switch (state) {
      case "transform": return vars.currentTransformValue
      case "action": return vars.currentActionValue
      case "param": return vars.currentParamValue
      case "param2": return vars.currentParam2Value
      default: return ""
    }
  },

  setCurrentValue: (state, value) => {
    switch (state) {
      case "transform": vars.currentTransformValue = value; break
      case "action": vars.currentActionValue = value; break
      case "param": vars.currentParamValue = value; break
      case "param2": vars.currentParam2Value = value; break
    }
  },

  getElement: (state) => {
    switch (state) {
      case "transform": return document.getElementById("transformt")
      case "action": return document.getElementById("actiont")
      case "param": return document.getElementById("paramt")
      case "param2": return document.getElementById("param2t")
      default: return null
    }
  },
  onEnter: async (state, value, element) => {
    switch (state) {
      case "transform": {
        const lections = await readAllLections()
        if (lections.includes(vars.currentTransformValue)) {
          vars.currentLectionValue = vars.currentTransformValue
          document.getElementById("transformt").style.color = "white"
          vars.generateState = "action"
        } else {
          document.getElementById("transformt").style.color = vars.redColor
        }
        return { preventDefault: true }
      }
      case "action": {
        const n = Number(vars.currentActionValue)
        if (!isNaN(n) && vars.AvabialeModes.includes(n)) {
          document.getElementById("actiont").innerText = vars.GenerateModesDescription[n]
          document.getElementById("actiont").style.color = "white"
          const needed = vars.GenerateModesParams[n]
          if (needed === 0) {
            GenerateList(n, null, null, vars.currentLectionValue)
          } else if (needed === 1) {
            document.getElementById("param").style.display = "block"
            vars.generateState = "param"
          } else {
            document.getElementById("param").style.display = "block"
            document.getElementById("param2").style.display = "block"
            vars.generateState = "param"
          }
        } else {
          document.getElementById("actiont").style.color = "#ea4f4f"
        }
        return { preventDefault: true }
      }

      case "param": {
        document.getElementById("paramt").style.color = "white"
        const actionNum = Number(vars.currentActionValue)
        if (vars.GenerateModesParams[actionNum] === 1) {
          GenerateList(actionNum, vars.currentParamValue, null, vars.currentLectionValue)
        } else {
          vars.generateState = "param2"
        }
        return { preventDefault: true }
      }

      case "param2": {
        document.getElementById("param2t").style.color = "white"
        const actionNum = Number(vars.currentActionValue)
        GenerateList(
          actionNum,
          vars.currentParamValue,
          vars.currentParam2Value,
          vars.currentLectionValue,
        )
        return { preventDefault: true }
      }
    }
  },

  updateDisplay: (_, value, element) => {
    if (element) element.innerText = value
  }
})
export { handleGenerateMenu }
