// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { setMenu } from "../../scripts/setMenu.js"
import { hideMainMenu } from "../mm/display.js"

function showMoveMenu() {
  hideMainMenu()
  document.getElementById("mvm").style.display = "block"
  vars.menu = "mvm"
  vars.currentDestinationValue = ""
  vars.currentSourceValue = ""
  vars.moveState = "source"
  document.getElementById("tsource").innerText = ""
  document.getElementById("tdest").innerText = ""
  document.getElementById("msuc").innerText = ""
  setMenu("Move Vocabulary Menu", "06")
}

function hideMoveMenu() {
  document.getElementById("mvm").style.display = "none"
}
export { showMoveMenu, hideMoveMenu }
