// logic.js - logic for configuration menu
import { vars } from "../../scripts/vars.js"
import { updateSelection } from "./updateSelection.js"
import { saveConfiguration } from "../../scripts/dbHelpers/config/saveConfiguration.js"

// NOTE: When adding new config values they need to be changed in defaultConfiguration, configuration and loadConfiguration.js
function handleConfigurationMenu(e) {
  if (vars.configurationState == "view") {
    if (e.key === "j" || e.key === "ArrowDown" && vars.configurationIndexSelector < vars.totalConfigurationOptions) {
      vars.configurationIndexSelector++
      updateSelection()
    } else if (e.key === "k" || e.key === "ArrowUp" && vars.configurationIndexSelector > 1) {
      vars.configurationIndexSelector--
      updateSelection()
    } else if (e.key === "Enter") {
      vars.configurationState = "edit"
      document.getElementById("c" + (vars.configurationIndexSelector) + "-i").innerText = ">"
      let index = 1
      for (const value in vars.configuration) {
        if (index == vars.configurationIndexSelector) {
          vars.configurationValue = vars.configuration[value]
          vars.configurationValueOld = vars.configuration[value]
          break;
        }
        index++
      }
    }
  } else if (vars.configurationState == "edit") {
    if (e.key == "Escape") {
      vars.configurationState = "view"
      document.getElementById("c" + (vars.configurationIndexSelector) + "-i").innerText = "=>"
      vars.configurationValue = vars.configurationValueOld
      document.getElementById("c" + (vars.configurationIndexSelector) + "-v").innerText = vars.configurationValueOld
    } else if (e.key == "Backspace") {
      vars.configurationValue = String(vars.configurationValue).slice(0, -1)
    } else if (e.key == "Enter") {
      let index = 1
      let key
      let oldValue
      for (const k in vars.configuration) {
        if (index == vars.configurationIndexSelector) {
          key = k
          oldValue = vars.configuration[k]
          break
        }
        index++
      }
      let newValue = vars.configurationValue
      if (typeof oldValue === "boolean") {
        if (newValue === "true") {
          newValue = true
        } else if (newValue === "false") {
          newValue = false
        } else {
          document.getElementById("c" + vars.configurationIndexSelector + "-v").style.color = "red"
          return
        }
      }
      vars.configuration[key] = newValue

      vars.configurationState = "view"
      document.getElementById("c" + vars.configurationIndexSelector + "-v").style.color = "#5294e2"
      document.getElementById("c" + vars.configurationIndexSelector + "-i").innerText = "=>"
      saveConfiguration()
    } else if (e.key.length === 1) {
      vars.configurationValue += e.key
    }
    document.getElementById("c" + (vars.configurationIndexSelector) + "-v").innerText = vars.configurationValue
  }
}

export { handleConfigurationMenu }
