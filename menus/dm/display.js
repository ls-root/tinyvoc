// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { hideMainMenu } from "../mm/display.js"
import { hideAllDocElements } from "./hideAllDocElements.js"
import { writeGP } from "../../scripts/dbHelpers/generalPurpose/writeGP.js"
import { setMenu } from "../../scripts/setMenu.js"

function hideDocsMenu() {
  document.getElementById("dm").style.display = "none"
}

function showDocsMenu() {
  hideMainMenu()
  document.getElementById("dm").style.display = "block"
  hideAllDocElements()
  writeGP("currentDocPage", 0)
  document.getElementById("doctoc").style.display = "block"
  vars.menu = "dm"
  setMenu("Docs Menu", "00")
  for (let i = 1; i <= vars.docPages; i++) {
    const pageId = "docpage" + String(i).padStart(2, '0')
    const pageElement = document.getElementById(pageId)
    if (pageElement) {
      pageElement.style.display = "none"
    }
  }
}
export { hideDocsMenu, showDocsMenu }
