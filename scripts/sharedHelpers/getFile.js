// getFile.js - asks for file from user and imports it
import { overwriteImportData } from "../dbHelpers/import/overwriteImportData.js"
import { addOnlyImportData } from "../dbHelpers/import/addOnlyImportData.js"

function getFile() {
  const fileInput = document.getElementById("file")
  const importText = document.getElementById("iv")

  importText.style.display = "none"
  fileInput.style.display = "block"
  fileInput.value = ""

  fileInput.onchange = () => {
    const file = fileInput.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      let importedData
      let keydownHandler

      try {
        importedData = JSON.parse(e.target.result)

        if (!Array.isArray(importedData)) {
          throw new Error("Data must be an array")
        }

        fileInput.style.display = "none"
        importText.style.display = "block"
        importText.innerHTML =
          `Found ${importedData.length} entries. <br>` +
          "<strong>ADD (b)</strong>: Keep all existing data + add new entries<br>" +
          "<strong>OVERWRITE (o)</strong>: Delete everything + import these entries<br>" +
          "<strong>ESC</strong>: Cancel"

        keydownHandler = async (ev) => {
          document.removeEventListener("keydown", keydownHandler)

          try {
            if (ev.key === "b" || ev.key === "B") {
              importText.innerHTML = "ADD MODE: Adding new vocabulary (existing data safe)..."
              importText.style.color = "#5294e2"

              const result = await addOnlyImportData(importedData)

              importText.innerHTML =
                `ADD MODE Complete!<br>` +
                `• ${result.added} new entries added<br>` +
                `• ${result.skipped} duplicates skipped<br>` +
                `• All existing data preserved<br>` +
                `Reloading in 3 seconds...`
              importText.style.color = "green"

              setTimeout(() => location.reload(), 3000)

            } else if (ev.key === "o" || ev.key === "O") {
              importText.innerHTML = "OVERWRITE MODE: This will delete ALL existing data!"
              importText.style.color = "red"

              setTimeout(async () => {
                try {
                  await overwriteImportData(importedData)

                  importText.innerHTML =
                    `OVERWRITE Complete!<br>` +
                    `All old data deleted<br>` +
                    `${importedData.length} new entries imported<br>` +
                    `Reloading in 2 seconds...`
                  importText.style.color = "green"

                  setTimeout(() => location.reload(), 2000)
                } catch (error) {
                  importText.innerHTML = `OVERWRITE Failed: ${error.message}`
                  importText.style.color = "red"
                  setTimeout(() => location.reload(), 3000)
                }
              }, 1000)

            } else if (ev.key === "Escape") {
              importText.style.display = "none"
              fileInput.style.display = "block"
              return
            } else {
              document.addEventListener("keydown", keydownHandler)
              return
            }
          } catch (error) {
            console.error("Import operation failed:", error)
            importText.innerHTML = `Import failed: ${error.message}<br>Press any key to reload.`
            importText.style.color = "red"

            const errorHandler = () => {
              document.removeEventListener("keydown", errorHandler)
              location.reload()
            }
            document.addEventListener("keydown", errorHandler)
          }
        }

        document.addEventListener("keydown", keydownHandler)

      } catch (error) {
        console.error("File parsing error:", error)
        importText.style.display = "block"
        fileInput.style.display = "none"
        importText.innerHTML = "Invalid file format."
        importText.style.color = "red"

        const parseErrorHandler = () => {
          document.removeEventListener("keydown", parseErrorHandler)
          importText.style.color = ""
          getFile()
        }
        document.addEventListener("keydown", parseErrorHandler)
      }
    }

    reader.readAsText(file)
  }
}

export { getFile }
