// display.js - display utils 
import { vars } from "../../scripts/vars.js"
import { setMenu } from "../../scripts/setMenu.js"
import { hideMainMenu } from "../mm/display.js"
import { updateSelection } from "./updateSelection.js"
import { loadConfiguration } from "./loadConfiguration.js"

function showConfigurationMenu() {
  hideMainMenu()
  document.getElementById("om").style.display = "block"
  vars.configurationIndexSelector = 1
  vars.configurationState = "view"
  loadConfiguration()
  updateSelection()
  setMenu("Configuration Menu")
  vars.menu = "om"
}

function hideConfigurationMenu() {
  document.getElementById("om").style.display = "none"
}
export { showConfigurationMenu, hideConfigurationMenu }
