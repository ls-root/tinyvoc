// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { hideMainMenu } from "../mm/display.js"
import { setMenu } from "../../scripts/setMenu.js"
import { mkbanner } from "../../scripts/sharedHelpers/banner.js"

function hideGitMenu() {
  document.getElementById("nm").style.display = "none"
}

function showGitMenu() {
  hideMainMenu()
  document.getElementById("nm").style.display = "block"
  document.getElementById("gitfooter").innerText = mkbanner("", 45, "-")
  vars.menu = "nm"
  setMenu("Git Integration Sub Menu", "09")
}
export { hideGitMenu, showGitMenu }
