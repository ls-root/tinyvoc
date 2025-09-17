import { vars } from "../../scripts/vars.js"

function loadConfiguration() {
  let index = 1
  for (const value in vars.configuration) {
    document.getElementById("c" + index + "-v").innerText = vars.configuration[value]
    index++
  }
}

export { loadConfiguration }
