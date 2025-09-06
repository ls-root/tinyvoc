// display.js - display utils
import { hideMainMenu } from "../mm/display.js"
import { vars } from "../../scripts/vars.js"
import { setMenu } from "../../scripts/setMenu.js"

function showAddMenu() {
  hideMainMenu()
  document.getElementById("am").style.display = "block"
  vars.menu = "am"
  setMenu("Add Vocabulary Menu", "02")
  vars.addstate = "lection"
  vars.currentLectionValue = ""
  vars.currentKeyValue = ""
  vars.currentValueValue = ""
  document.getElementById("lection").innerText = ""
  document.getElementById("key").innerText = ""
  document.getElementById("valuevalue").innerText = ""
  document.getElementById("value").style.display = "none"
}

function hideAddMenu() {
  document.getElementById("am").style.display = "none"
}

export { showAddMenu, hideAddMenu }
