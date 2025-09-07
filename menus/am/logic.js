// logic.js - logic for add menu
import { vars } from "../../scripts/vars.js"
import { writeData } from "../../scripts/dbHelpers/writeData.js"

function handleAddMenu(e) {
  if (vars.addstate === "lection") {
    if (e.key === "Backspace")
      vars.currentLectionValue = vars.currentLectionValue.slice(0, -1)
    else if (e.key === "Enter") {
      if (vars.currentLectionValue.endsWith("/")) {
        document.getElementById("lection").style.color = "red"
      } else {
        vars.addstate = "key"
        document.getElementById("lection").style.color = "white"
        document.getElementById("lectiont").style.color = "white"
        e.preventDefault()
      }
    } else if (e.key.length === 1) vars.currentLectionValue += e.key
    document.getElementById("lection").innerText = vars.currentLectionValue
  } else if (vars.addstate === "key") {
    if (e.key === "Backspace") vars.currentKeyValue = vars.currentKeyValue.slice(0, -1)
    else if (e.key === "Enter") {
      vars.addstate = "value"
      document.getElementById("key").style.color = "white"
      document.getElementById("value").style.display = "block"

      e.preventDefault()
    } else if (e.key.length === 1) vars.currentKeyValue += e.key
    document.getElementById("key").innerText = vars.currentKeyValue
  } else if (vars.addstate === "value") {
    if (e.key === "Backspace")
      vars.currentValueValue = vars.currentValueValue.slice(0, -1)
    else if (e.key === "Enter") {
      writeData(vars.currentKeyValue, vars.currentValueValue, vars.currentLectionValue)
      vars.currentKeyValue = ""
      vars.currentValueValue = ""
      vars.addstate = "key"
      document.getElementById("key").innerText = ""
      document.getElementById("key").style.color = "#5294e2"
      document.getElementById("value").style.display = "none"
      document.getElementById("valuevalue").innerText = ""
      e.preventDefault()
    } else if (e.key.length === 1) vars.currentValueValue += e.key
    document.getElementById("valuevalue").innerText = vars.currentValueValue
  }
}

export { handleAddMenu }
