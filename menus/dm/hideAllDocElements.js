// hideAllDocElements.js - hide all doc elements
import { vars } from "../../scripts/vars.js"

function hideAllDocElements() {
  document.getElementById("doctoc").style.display = "none"
  for (let i = 1; i <= vars.docPages; i++) {
    const pageId = "docpage" + String(i).padStart(2, '0')
    const pageElement = document.getElementById(pageId)
    if (pageElement) {
      pageElement.style.display = "none"
    }
  }
}

export { hideAllDocElements }
