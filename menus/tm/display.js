// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { setMenu } from "../../scripts/setMenu.js"
import { trainInit } from "./trainInit.js"
import { hideMainMenu } from "../mm/display.js"

function showTrainMenu() {
  hideMainMenu()
  document.getElementById("tm").style.display = "block"
  vars.menu = "tm"
  setMenu("Training Menu", "03")
  vars.currentSessionScore = 0
  trainInit()
}

function hideTrainMenu() {
  document.getElementById("tm").style.display = "none"
}
export { showTrainMenu, hideTrainMenu }
