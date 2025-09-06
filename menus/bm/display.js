// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { setMenu } from "../../scripts/setMenu.js"
import { hideMainMenu } from "../mm/display.js"

function showBroadcastMenu() {
  hideMainMenu()
  document.getElementById("bm").style.display = "block"
  vars.menu = "bm"
  setMenu("Broadcast Sub Menu", "10")
}

function hideBroadcastMenu() {
  document.getElementById("bm").style.display = "none"
}
export { showBroadcastMenu, hideBroadcastMenu }
