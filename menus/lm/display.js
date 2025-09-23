// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { setMenu } from "../../scripts/setMenu.js"
import { readGP } from "../../scripts/dbHelpers/generalPurpose/readGP.js"
import { hideMainMenu } from "../mm/display.js"
import { readAllLections } from "../../scripts/dbHelpers/read.js"

async function showLectionsMenu() {
  document.getElementById("lm").style.display = "block"
  hideMainMenu()
  // Render articles
  document.getElementById("lectionview").innerHTML = ""
  const lections = await readAllLections()

  // Sort alphabetically
  lections.sort()

  for (const item of lections) {
    const p = document.createElement("p")
    if (item.split("/").length <= 2) {
      let firstSlashIndex = item.indexOf("/")
      let firstPart = item.substring(0, firstSlashIndex)
      let secondPart = item.substring(firstSlashIndex)
      p.innerHTML = `<strong>${firstPart}</strong>${secondPart} - Last Average Attempt: ${await readGP(item + "_attempt_last")} - Last Success Score: ${await readGP(item + "_success_last")}%`
    }
    document.getElementById("lectionview").appendChild(p)
  }
  vars.menu = "lm"
  setMenu("Lections View", "07")
}

function hideLectionsMenu() {
  document.getElementById("lm").style.display = "none"
}
export { showLectionsMenu, hideLectionsMenu }
