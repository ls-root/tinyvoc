// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { setMenu } from "../../scripts/setMenu.js"

function hideMainMenu() {
  document.getElementById("mm").style.display = "none"
}

function showMainMenu() {
  document.getElementById("mm").style.display = "block"
  vars.menu = "mm"
  setMenu("Main Menu")
}

export { showMainMenu, hideMainMenu }
