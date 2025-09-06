// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { hideMainMenu } from "../mm/display.js"
import { setMenu } from "../../scripts/setMenu.js"

function showCorrectMenu() {
  vars.currentIdCValue = ""
  vars.currentKeyCValue = ""
  vars.currentValueCValue = ""
  vars.currentLectionCValue = ""
  vars.correctState = "lection"
  document.getElementById("idc").innerText = ""
  document.getElementById("keyc").innerText = ""
  document.getElementById("valuec").innerText = ""
  document.getElementById("lectionc").innerText = ""
  vars.menu = "cm"
  setMenu("Correct Vocabulary Menu", "08")
  hideMainMenu()
  document.getElementById("cm").style.display = "block"
}

function hideCorrectMenu() {
  document.getElementById("cm").style.display = "none"
}
export { showCorrectMenu, hideCorrectMenu }
