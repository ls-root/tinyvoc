// logic.js - logic for move menu
import { vars } from "../../scripts/vars.js"
import { readAllLections } from "../../scripts/dbHelpers/read.js"
import { renameLection } from "./renameLection.js"

async function handleMoveMenu(e) {
  const sourceEl = document.getElementById("tsource")
  const destinationEl = document.getElementById("tdest")

  if (vars.moveState === "source") {
    if (e.key === "Backspace") {
      vars.currentSourceValue = vars.currentSourceValue.slice(0, -1)
    } else if (e.key === "Enter") {
      const lections = await readAllLections()
      if (lections.includes(vars.currentSourceValue)) {
        sourceEl.style.color = "white"
        vars.moveState = "destination"
      } else {
        sourceEl.style.color = "#ea4f4f"
      }
    } else if (e.key.length === 1) {
      vars.currentSourceValue += e.key
    }
  } else if (vars.moveState === "destination") {
    if (e.key === "Backspace") {
      vars.currentDestinationValue = vars.currentDestinationValue.slice(0, -1)
    } else if (e.key === "Enter") {
      destinationEl.style.color = "white"
      vars.moveState = ""

      document.getElementById("msuc").innerHTML = "Moved <strong>" + vars.currentSourceValue + "</strong> -> <strong>" + vars.currentDestinationValue + "</strong>"

      await renameLection(vars.currentSourceValue, vars.currentDestinationValue)
    } else if (e.key.length === 1) {
      vars.currentDestinationValue += e.key
    }
  }
  destinationEl.innerText = vars.currentDestinationValue
  sourceEl.innerText = vars.currentSourceValue
}

export { handleMoveMenu }
