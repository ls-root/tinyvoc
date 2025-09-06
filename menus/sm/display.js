// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { setMenu } from "../../scripts/setMenu.js"
import { hideMainMenu } from "../mm/display.js"
import { handleStatusMenu } from "./logic.js"

function hideStatusMenu() {
  document.getElementById("sm").style.display = "none"
}

function showStatusMenu() {
  hideMainMenu()
  handleStatusMenu()
  document.getElementById("sm").style.display = "block"
  vars.menu = "sm"
  setMenu("Git Status Menu", "12")
}
export { hideStatusMenu, showStatusMenu }
