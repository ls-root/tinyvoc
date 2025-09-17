// postConfigLoad.js - Things that should happen after the config is loaded
import { vars } from "./vars.js"

function postConfigLoad() {
  const mxkLabels = document.getElementsByClassName("mxk")
  for (let item of mxkLabels) {
    item.innerText = vars.configuration.MenuExitKey
  }
  if (location.hash === "#ResetConfig") { location.hash = "" }
}

export { postConfigLoad }
