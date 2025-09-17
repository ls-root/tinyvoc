import { vars } from "./vars.js"
import { writeConfig } from "./dbHelpers/config/writeConfig.js"
import { readConfig } from "./dbHelpers/config/readConfig.js"

async function bootUpMessage() {
  document.body.innerHTML = ""
  const bootUpMessageContainer = document.createElement("div")
  const bootUpMessageHeader = document.createElement("h1")
  const bootUpMessageParagraph = document.createElement("p")
  const bootUpMessageHint = document.createElement("i")
  bootUpMessageHeader.innerText = "TinyVoc"
  bootUpMessageHint.innerText = "Press any key to continue..."
  bootUpMessageHint.style.opacity = "0.5"
  bootUpMessageParagraph.innerText = await readConfig("nextBootUpMessage")
  bootUpMessageContainer.id = "bootUpMessageContainer"
  bootUpMessageContainer.appendChild(bootUpMessageHeader)
  bootUpMessageContainer.appendChild(bootUpMessageParagraph)
  bootUpMessageContainer.appendChild(bootUpMessageHint)
  document.body.appendChild(bootUpMessageContainer)
  writeConfig("nextBootUpMessage", false)
  document.addEventListener("keydown", () => { window.location.reload() })
}
export { bootUpMessage }
