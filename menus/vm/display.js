// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { setMenu } from "../../scripts/setMenu.js"
import { hideMainMenu } from "../mm/display.js"
import { resetView } from "./resetView.js"

async function showViewMenu() {
  hideMainMenu()
  document.getElementById("vm").style.display = "block"
  resetView()

  vars.menu = "vm"
  setMenu("View Menu", "04")
  vars.viewstate = "lection"
  vars.currentLectionValue = ""
  const ilectionSelect = document.getElementById("ilectionSelect")
  ilectionSelect.innerText = ""
  ilectionSelect.style.color = "#5294e2"
}

function hideViewMenu() {
  document.getElementById("vm").style.display = "none"
}

export { showViewMenu, hideViewMenu }
