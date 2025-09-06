// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { hideMainMenu } from "../mm/display.js"
import { setMenu } from "../../scripts/setMenu.js"

function hideJoinMenu() {
  document.getElementById("jm").style.display = "none"
}

function showJoinMenu() {
  hideMainMenu()
  document.getElementById("jm").style.display = "block"
  vars.menu = "jm"
  setMenu("Lection Joining Menu", "09")
  vars.joinState = "lections"
  vars.currentLectionsValue = ""

  document.getElementById("joinstatus").innerText = "Enter lection specifications (comma-separated)"
  document.getElementById("joinstatus").style.color = "#5294e2"
  document.getElementById("lectionsj").innerText = ""
}
export { hideJoinMenu, showJoinMenu }
