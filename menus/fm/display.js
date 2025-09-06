// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { hideMainMenu } from "../mm/display.js"
import { handleFigureMenu } from "./logic.js"
import { setMenu } from "../../scripts/setMenu.js"

function showFigureMenu() {
  hideMainMenu()
  document.getElementById("fm").style.display = "block"
  handleFigureMenu()
  vars.menu = "fm"
  setMenu("Figure Menu", "11")
}

function hideFigureMenu() {
  document.getElementById("fm").style.display = "none"
}
export { showFigureMenu, hideFigureMenu }
