// updateSelection.js - update selection in configuration menu
import { vars } from "../../scripts/vars.js"

function updateSelection() {
  // remove selection from all
  for (let i = 0; i < vars.totalConfigurationOptions; i++) {
    console.log("Cleared: c" + (i + 1) + "-i")
    document.getElementById("c" + (i + 1) + "-i").innerText = ""
  }
  // set selection
  console.log("Setting: c" + (vars.configurationIndexSelector) + "-i")
  document.getElementById("c" + (vars.configurationIndexSelector) + "-i").innerText = "=>"
}

export { updateSelection }
