// addOnlyImportData.js - silent import (only add)
import { vars } from "../../vars.js"

function addOnlyImportData(data) {
  return new Promise((resolve, reject) => {
    if (!vars.db) return reject("Database not available")

    if (!data || !Array.isArray(data) || data.length === 0) {
      return reject("Invalid or empty data array")
    }

    console.log("ADD MODE: Starting safe import - no existing data will be deleted")

    let processed = 0
    let added = 0
    let skipped = 0
    const total = data.length
    const results = []

    const processNextItem = (index) => {
      if (index >= total) {
        console.log(`ADD MODE completed: ${added} added, ${skipped} skipped (duplicates)`)
        resolve({ added, skipped, total: processed })
        return
      }

      const item = data[index]

      // Create clean object without ID
      const cleanItem = {
        vocabWord: (item.vocabWord || "").toString(),
        value: (item.value || "").toString(),
        lection: (item.lection || "").toString(),
        weight: item.weight || 1,
        wrong: item.wrong || 0,
        right: item.right || 0
      }

      const tx = vars.db.transaction("vocabulary", "readonly")
      const store = tx.objectStore("vocabulary")
      const vocabIndex = store.index("vocabWord")
      const checkRequest = vocabIndex.get(cleanItem.vocabWord)

      checkRequest.onsuccess = () => {
        if (checkRequest.result) {
          console.log(`Skipping existing vocabulary: ${cleanItem.vocabWord}`)
          skipped++
          processed++
          processNextItem(index + 1)
        } else {
          const addTx = vars.db.transaction("vocabulary", "readwrite")
          const addStore = addTx.objectStore("vocabulary")
          const addRequest = addStore.add(cleanItem)

          addRequest.onsuccess = () => {
            console.log(`Added new vocabulary: ${cleanItem.vocabWord}`)
            added++
            processed++
            processNextItem(index + 1)
          }

          addRequest.onerror = (e) => {
            console.log(`Failed to add ${cleanItem.vocabWord}:`, e.target.error)
            skipped++
            processed++
            processNextItem(index + 1)
          }
        }
      }

      checkRequest.onerror = (e) => {
        console.error(`Error checking vocabulary ${cleanItem.vocabWord}:`, e.target.error)
        skipped++
        processed++
        processNextItem(index + 1)
      }
    }

    // Start processing
    processNextItem(0)
  })
}
export { addOnlyImportData }
