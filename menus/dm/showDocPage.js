// showDocPage.js - show specified doc page
import { vars } from "../../scripts/vars.js"
import { hideAllDocElements } from "./hideAllDocElements.js"
import { writeGP } from "../../scripts/dbHelpers/generalPurpose/writeGP.js"

function showDocPage(pageNum) {
  vars.docState = "page"
  hideAllDocElements()
  const pageId = "docpage" + String(pageNum).padStart(2, '0')
  const pageElement = document.getElementById(pageId)
  if (pageElement) {
    pageElement.style.display = "block"
    writeGP("currentDocPage", pageNum)
  } else {
    console.error(`Doc page element not found: ${pageId}`)
  }
}
export { showDocPage }
