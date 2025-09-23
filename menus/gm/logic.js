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
// async function handleGenerateMenu(e) {
//   const document.getElementById("transformt") = document.getElementById("transformt")
//   const document.getElementById("actiont") = document.getElementById("actiont")
//   const document.getElementById("paramt") = document.getElementById("paramt")
//   const document.getElementById("param2t") = document.getElementById("param2t")
//   const param2Inp = document.getElementById("param2")
//   const param1Inp = document.getElementById("param")
//
//   if (vars.generateState === "transform") {
//     if (e.key === "Backspace") {
//       vars.currentTransformValue = vars.currentTransformValue.slice(0, -1)
//     } else if (e.key === "Enter") {
//       const lections = await readAllLections()
//       if (lections.includes(vars.currentTransformValue)) {
//         vars.currentLectionValue = vars.currentTransformValue
//         document.getElementById("transformt").style.color = "white"
//         vars.generateState = "action"
//       } else {
//         document.getElementById("transformt").style.color = "#ea4f4f"
//       }
//       e.preventDefault()
//     } else if (e.key.length === 1) {
//       vars.currentTransformValue += e.key
//     }
//
//     document.getElementById("transformt").innerText = vars.currentTransformValue
//   } else if (vars.generateState === "action") {
//     if (e.key === "Backspace") {
//       vars.currentActionValue = vars.currentActionValue.slice(0, -1)
//     } else if (e.key === "Enter") {
//       const n = Number(vars.currentActionValue)
//       if (!isNaN(n) && vars.AvabialeModes.includes(n)) {
//         document.getElementById("actiont").innerText = vars.GenerateModesDescription[n]
//         document.getElementById("actiont").style.color = "white"
//         const needed = vars.GenerateModesParams[n]
//         if (needed === 0) {
//           GenerateList(n, null, null, vars.currentLectionValue)
//         } else if (needed === 1) {
//           param1Inp.style.display = "block"
//           vars.generateState = "param"
//         } else {
//           param1Inp.style.display = "block"
//           param2Inp.style.display = "block"
//           vars.generateState = "param"
//         }
//       } else {
//         document.getElementById("actiont").style.color = "#ea4f4f"
//       }
//       e.preventDefault()
//     } else if (e.key.length === 1) {
//       vars.currentActionValue += e.key
//     }
//     document.getElementById("actiont").innerText = vars.currentActionValue
//   } else if (vars.generateState === "param") {
//     if (e.key === "Backspace") {
//       vars.currentParamValue = vars.currentParamValue.slice(0, -1)
//     } else if (e.key === "Enter") {
//       document.getElementById("paramt").style.color = "white"
//       const actionNum = Number(vars.currentActionValue)
//       if (GenerateModesParams[actionNum] === 1) {
//         GenerateList(actionNum, vars.currentParamValue, null, vars.currentLectionValue)
//       } else {
//         vars.generateState = "param2"
//       }
//       e.preventDefault()
//     } else if (e.key.length === 1) {
//       vars.currentParamValue += e.key
//     }
//     document.getElementById("paramt").innerText = vars.currentParamValue
//   } else if (vars.generateState === "param2") {
//     if (e.key === "Backspace") {
//       vars.currentParam2Value = vars.currentParam2Value.slice(0, -1)
//     } else if (e.key === "Enter") {
//       document.getElementById("param2t").style.color = "white"
//       const actionNum = Number(vars.currentActionValue)
//       GenerateList(
//         actionNum,
//         vars.currentParamValue,
//         vars.currentParam2Value,
//         vars.currentLectionValue,
//       )
//       e.preventDefault()
//     } else if (e.key.length === 1) {
//       vars.currentParam2Value += e.key
//     }
//     document.getElementById("param2t").innerText = vars.currentParam2Value
//   }
// }
//
export { handleGenerateMenu }
