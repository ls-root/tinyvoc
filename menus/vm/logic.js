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
          // Exact lection match
          data = await readLectionData(vars.currentLectionValue)
        } else if (vars.currentLectionValue.endsWith("/")) {
          // Folder request - get all lections from this folder
          const folderName = vars.currentLectionValue.slice(0, -1) // Remove trailing "/"
          const folderLections = lections.filter(item => {
            let firstSlashIndex = item.indexOf("/")
            if (firstSlashIndex === -1) {
              return false // no slash, not in a folder
            }
            // Check if this lection belongs to the requested folder
            return item.substring(0, firstSlashIndex) === folderName
          })

          if (folderLections.length > 0) {
            // Get data for all lections in this folder
            data = []
            for (const lection of folderLections) {
              const lectionData = await readLectionData(lection)
              data = data.concat(lectionData)
            }
          } else {
            ilectionSelect.style.color = "red"
            return
          }
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
