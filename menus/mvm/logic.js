// logic.js - logic for move menu 
import { vars } from "../../scripts/vars.js"
import { readAllLections } from "../../scripts/dbHelpers/read.js"
import { renameLection } from "./renameLection.js"
import { createInputHandler } from "../../scripts/inputHandler.js"

const handleMoveMenu = createInputHandler({
  getCurrentState: () => vars.moveState,

  getCurrentValue: (state) => {
    switch (state) {
      case "source": return vars.currentSourceValue
      case "destination": return vars.currentDestinationValue
      default: return ""
    }
  },

  setCurrentValue: (state, value) => {
    switch (state) {
      case "source": vars.currentSourceValue = value; break
      case "destination": vars.currentDestinationValue = value; break
    }
  },

  getElement: (state) => {
    switch (state) {
      case "source": return document.getElementById("tsource")
      case "destination": return document.getElementById("tdest")
      default: return null
    }
  },

  onEnter: async (state, value, element) => {
    switch (state) {
      case "source":
        const lections = await readAllLections()
        if (lections.includes(value)) {
          element.style.color = "white"
          vars.moveState = "destination"
        } else {
          element.style.color = "#ea4f4f"
        }
        break

      case "destination":
        element.style.color = "white"
        vars.moveState = ""
        document.getElementById("msuc").innerHTML =
          `Moved <strong>${vars.currentSourceValue}</strong> -> <strong>${vars.currentDestinationValue}</strong>`
        await renameLection(vars.currentSourceValue, vars.currentDestinationValue)
        break
    }
  },

  updateDisplay: (state, value, element) => {
    if (element) element.innerText = value
  }
})

export { handleMoveMenu }
