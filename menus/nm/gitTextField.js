// gitTextField.js - text fields for git
import { mkbanner } from "../../scripts/sharedHelpers/banner.js"
import { vars } from "../../scripts/vars.js"

function gitTextField(prefix) {
  return new Promise((resolve) => {
    const paramm = document.getElementById("gitparamf")
    const paramText = document.getElementById("gitparam")
    const paramValue = document.getElementById("gitparamv")

    const originalGitState = vars.gitState

    vars.gitState = "textField"
    paramm.style.display = "block"
    paramText.innerHTML = prefix // allows HTML injection
    paramValue.innerText = ""
    vars.currentGitValue = ""

    const textFieldHandler = (e) => {
      if (vars.gitState !== "textField") return

      if (e.key === "Backspace") {
        vars.currentGitValue = vars.currentGitValue.slice(0, -1)
        paramValue.innerText = vars.currentGitValue
        e.preventDefault()
      } else if (e.key === "Enter") {
        const value = vars.currentGitValue
        cleanupTextField()
        document.removeEventListener("keydown", textFieldHandler)
        resolve(value)
        e.preventDefault()
      } else if (e.key === "Escape" || e.key === "-") {
        cleanupTextField()
        document.removeEventListener("keydown", textFieldHandler)
        resolve(null)
        e.preventDefault()
      } else if (e.key.length === 1) {
        vars.currentGitValue += e.key
        paramValue.innerText = vars.currentGitValue
        e.preventDefault()
      }
    }

    const cleanupTextField = () => {
      vars.gitState = originalGitState
      paramm.style.display = "none"
      paramText.innerText = ""
      paramValue.innerText = ""
      vars.currentGitValue = ""
    }

    // Add event listener for text field
    document.addEventListener("keydown", textFieldHandler)
  })
}
function setGitFooter(msg) {
  document.getElementById("gitfooter").innerText = mkbanner(msg, 45, "-")
}

export { gitTextField, setGitFooter }
