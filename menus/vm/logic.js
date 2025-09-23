// logic.js - logic for view menu
import { vars } from "../../scripts/vars.js"
import { readAllData, readAllLections, readLectionData } from "../../scripts/dbHelpers/read.js"
import { createInputHandler } from "../../scripts/inputHandler.js"
import { resetView } from "./resetView.js"
import { addToView } from "./addToView.js"

const handleViewMenu = createInputHandler({
  getCurrentState: () => vars.viewstate,

  getCurrentValue: (state) => {
    switch (state) {
      case "lection": return vars.currentLectionValue;
      default: return "";
    }
  },

  setCurrentValue: (state, value) => {
    switch (state) {
      case "lection": vars.currentLectionValue = value; break;
    }
  },

  getElement: (state) => {
    switch (state) {
      case "lection": return document.getElementById("ilectionSelect");
      default: return null;
    }
  },

  onEnter: async (state, value, element) => {
    switch (state) {
      case "lection": {
        const ilectionSelect = document.getElementById("ilectionSelect")
        ilectionSelect.style.color = "white"
        let data

        if (vars.currentLectionValue.toLowerCase() === "all") {
          data = await readAllData()
        } else {
          const lections = await readAllLections()

          if (lections.includes(vars.currentLectionValue)) {
            data = await readLectionData(vars.currentLectionValue)
          } else if (vars.currentLectionValue.endsWith("/")) {
            // Folder request - get all lections from this folder
            const folderName = vars.currentLectionValue.slice(0, -1)
            const folderLections = lections.filter(item => {
              let firstSlashIndex = item.indexOf("/")
              if (firstSlashIndex === -1) {
                return false
              }

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
              ilectionSelect.style.color = "#ea4f4f"
              return
            }
          } else {
            ilectionSelect.style.color = "#ea4f4f"
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
        return { preventDefault: true };
      }
    }
  },

  updateDisplay: (_, value, element) => {
    if (element) element.innerText = value;
  }
})
export { handleViewMenu }
