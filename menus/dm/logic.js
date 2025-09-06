// logic.js - logic for docs menu
import { vars } from "../../scripts/vars.js"
import { hideAllDocElements } from "./hideAllDocElements.js"
import { showDocPage } from "./showDocPage.js"
import { readGP } from "../../scripts/dbHelpers/generalPurpose/readGP.js"
import { writeGP } from "../../scripts/dbHelpers/generalPurpose/writeGP.js"

async function handleDocsMenu(e) {
  if (e.key === "t" || e.key === "T") {
    vars.docState = "toc"
    hideAllDocElements()
    document.getElementById("doctoc").style.display = "block"
  } if (/^\d$/.test(e.key) && vars.docState === "toc" && vars.docNum.length === 0) {
    vars.docState = "num"
    vars.docNum += e.key
  } else if (/^\d$/.test(e.key) && vars.docState === "num" && vars.docNum.length === 1) {
    vars.docState = "page"
    vars.docNum += e.key

    const pageNum = parseInt(vars.docNum)
    if (pageNum >= 1 && pageNum <= vars.docPages) {
      showDocPage(pageNum)
    } else {
      vars.docState = "toc"
      vars.docNum = ""
    }

    vars.docNum = ""
  } else if (e.key === "ArrowLeft") {
    const currentPage = await readGP("currentDocPage") || 1
    if (currentPage > 1) {
      const newPage = currentPage - 1
      showDocPage(newPage)
      await writeGP("currentDocPage", newPage)
    }
  } else if (e.key === "ArrowRight") {
    const currentPage = await readGP("currentDocPage") || 1
    if (currentPage < vars.docPages) {
      const newPage = currentPage + 1
      showDocPage(newPage)
      await writeGP("currentDocPage", newPage)
    }
  }
}

export { handleDocsMenu }
