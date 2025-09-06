// importData.js - import vocabulary from json
import { vars } from "../../vars.js"

function importData(data) {
  return new Promise((resolve, reject) => {
    if (!vars.db) return reject("Database not available")

    if (!data || !Array.isArray(data) || data.length === 0) {
      return reject("Invalid or empty data array")
    }

    const tx = vars.db.transaction("vocabulary", "readwrite")
    const store = tx.objectStore("vocabulary")
    let completed = 0
    let skipped = 0
    const total = data.length
    let hasError = false

    tx.oncomplete = () => {
      if (!hasError) {
        console.log(`Import completed: ${completed} imported, ${skipped} skipped/updated`)
        resolve({ imported: completed, skipped: skipped })
      }
    }

    tx.onerror = (e) => {
      hasError = true
      console.error("Import transaction failed:", e.target.error)
      reject(e.target.error)
    }

    data.forEach((item, index) => {
      try {
        const itemToStore = {
          vocabWord: item.vocabWord || "",
          value: item.value || "",
          lection: item.lection || "",
          weight: item.weight || 1,
          wrong: item.wrong || 0,
          right: item.right || 0
        }

        const vocabIndex = store.index("vocabWord")
        const checkRequest = vocabIndex.get(itemToStore.vocabWord)

        checkRequest.onsuccess = () => {
          const existingEntry = checkRequest.result

          if (existingEntry) {
            const updateRequest = store.put({
              ...itemToStore,
              id: existingEntry.id
            })

            updateRequest.onsuccess = () => {
              skipped++
              completed++
              console.log(`Updated existing entry: ${itemToStore.vocabWord}`)
            }

            updateRequest.onerror = (e) => {
              console.error(`Failed to update item ${index}:`, itemToStore, e.target.error)
              completed++
            }
          } else {
            const addRequest = store.add(itemToStore)

            addRequest.onsuccess = () => {
              completed++
              console.log(`Added new entry: ${itemToStore.vocabWord}`)
            }

            addRequest.onerror = (e) => {
              console.error(`Failed to add item ${index}:`, itemToStore, e.target.error)
              completed++
            }
          }
        }

        checkRequest.onerror = (e) => {
          console.error(`Failed to check existing item ${index}:`, itemToStore, e.target.error)
          completed++
        }

      } catch (error) {
        console.error(`Error processing item ${index}:`, item, error)
        completed++
      }
    })
  })
}
export { importData }
