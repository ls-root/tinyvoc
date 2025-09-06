// display.js - display utils
import { vars } from "../../scripts/vars.js"
import { setMenu } from "../../scripts/setMenu.js"
import { hideMainMenu } from "../mm/display.js"

function showGenerateMenu() {
  document.getElementById("gm").style.display = "block"
  vars.menu = "gm"
  setMenu("Generate Lection Menu", "05")
  hideMainMenu()

  vars.currentTransformValue = ""
  vars.currentActionValue = ""
  vars.currentParamValue = ""
  vars.currentParam2Value = ""
  vars.generateState = "transform"

  const transformEl = document.getElementById("transformt")
  const actionEl = document.getElementById("actiont")
  const paramEl = document.getElementById("paramt")
  const param2El = document.getElementById("param2t")

  transformEl.innerText = ""
  transformEl.style.color = "#5294e2"
  actionEl.innerText = ""
  actionEl.style.color = "#5294e2"
  paramEl.innerText = ""
  paramEl.style.color = "#5294e2"
  param2El.innerText = ""
  param2El.style.color = "#5294e2"
}

function hideGenerateMenu() {
  document.getElementById("gm").style.display = "none"
}
export { showGenerateMenu, hideGenerateMenu }
