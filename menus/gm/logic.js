// logic.js - logic for generate menu
import { vars } from "../../scripts/vars.js"
import { GenerateList } from "./generateList.js"
import { readAllLections } from "../../scripts/dbHelpers/read.js"

async function handleGenerateMenu(e) {
  const transformEl = document.getElementById("transformt")
  const actionEl = document.getElementById("actiont")
  const paramEl = document.getElementById("paramt")
  const param2El = document.getElementById("param2t")
  const param2Inp = document.getElementById("param2")
  const param1Inp = document.getElementById("param")

  if (vars.generateState === "transform") {
    if (e.key === "Backspace") {
      vars.currentTransformValue = vars.currentTransformValue.slice(0, -1)
    } else if (e.key === "Enter") {
      const lections = await readAllLections()
      if (lections.includes(vars.currentTransformValue)) {
        vars.currentLectionValue = vars.currentTransformValue
        transformEl.style.color = "white"
        vars.generateState = "action"
      } else {
        transformEl.style.color = "red"
      }
      e.preventDefault()
    } else if (e.key.length === 1) {
      vars.currentTransformValue += e.key
    }

    transformEl.innerText = vars.currentTransformValue
  } else if (vars.generateState === "action") {
    if (e.key === "Backspace") {
      vars.currentActionValue = vars.currentActionValue.slice(0, -1)
    } else if (e.key === "Enter") {
      const n = Number(vars.currentActionValue)
      if (!isNaN(n) && vars.AvabialeModes.includes(n)) {
        actionEl.innerText = vars.GenerateModesDescription[n]
        actionEl.style.color = "white"
        const needed = vars.GenerateModesParams[n]
        if (needed === 0) {
          GenerateList(n, null, null, vars.currentLectionValue)
        } else if (needed === 1) {
          param1Inp.style.display = "block"
          vars.generateState = "param"
        } else {
          param1Inp.style.display = "block"
          param2Inp.style.display = "block"
          vars.generateState = "param"
        }
      } else {
        actionEl.style.color = "red"
      }
      e.preventDefault()
    } else if (e.key.length === 1) {
      vars.currentActionValue += e.key
    }
    actionEl.innerText = vars.currentActionValue
  } else if (vars.generateState === "param") {
    if (e.key === "Backspace") {
      vars.currentParamValue = vars.currentParamValue.slice(0, -1)
    } else if (e.key === "Enter") {
      paramEl.style.color = "white"
      const actionNum = Number(vars.currentActionValue)
      if (GenerateModesParams[actionNum] === 1) {
        GenerateList(actionNum, vars.currentParamValue, null, vars.currentLectionValue)
      } else {
        vars.generateState = "param2"
      }
      e.preventDefault()
    } else if (e.key.length === 1) {
      vars.currentParamValue += e.key
    }
    paramEl.innerText = vars.currentParamValue
  } else if (vars.generateState === "param2") {
    if (e.key === "Backspace") {
      vars.currentParam2Value = vars.currentParam2Value.slice(0, -1)
    } else if (e.key === "Enter") {
      param2El.style.color = "white"
      const actionNum = Number(vars.currentActionValue)
      GenerateList(
        actionNum,
        vars.currentParamValue,
        vars.currentParam2Value,
        vars.currentLectionValue,
      )
      e.preventDefault()
    } else if (e.key.length === 1) {
      vars.currentParam2Value += e.key
    }
    param2El.innerText = vars.currentParam2Value
  }
}

export { handleGenerateMenu }
