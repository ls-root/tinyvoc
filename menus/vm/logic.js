// logic.js - logic for view menu
import { vars } from "../../scripts/vars.js"
import { readAllData, readAllLections, readLectionData } from "../../scripts/dbHelpers/read.js"
import { resetView } from "./resetView.js"
import { addToView } from "./addToView.js"

async function handleViewMenu(e) {
  if (vars.viewstate === "lection") {
    if (e.key === "Backspace")
      vars.currentLectionValue = vars.currentLectionValue.slice(0, -1)
    else if (e.key === "Enter") {
      const ilectionSelect = document.getElementById("ilectionSelect")
      ilectionSelect.style.color = "white"

      let data
      if (vars.currentLectionValue.toLowerCase() === "all") {
        data = await readAllData()
      } else {
        const lections = await readAllLections()
        if (lections.includes(vars.currentLectionValue)) {
          data = await readLectionData(vars.currentLectionValue)
        } else {
          ilectionSelect.style.color = "red"
          return
        }
      }

      resetView()
      data.sort((a, b) => a.id - b.id)
      data.forEach((element) => {
        addToView(
          element.id,
          element.vocabWord,
          element.value,
          element.lection,
          element.right,
          element.wrong,
        )
      })

      vars.viewstate = "done"
      e.preventDefault()
    } else if (e.key.length === 1) vars.currentLectionValue += e.key
    document.getElementById("ilectionSelect").innerText = vars.currentLectionValue
  }
}

export { handleViewMenu }
