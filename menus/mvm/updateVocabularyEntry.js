// updateVocabularyEntry.js - update vocabulary entry
import { vars } from "../../scripts/vars.js"

async function updateVocabularyEntry(id, newVocabWord, newValue) {
  return new Promise((resolve, reject) => {
    if (!vars.db) return reject("Database not available")

    const tx = vars.db.transaction("vocabulary", "readwrite")
    const store = tx.objectStore("vocabulary")
    const rq = store.get(id)

    rq.onsuccess = () => {
      const data = rq.result
      if (data) {
        data.vocabWord = newVocabWord
        data.value = newValue
        const updateRq = store.put(data)

        updateRq.onsuccess = () => {
          resolve()
        }
        updateRq.onerror = () => reject(updateRq.error)
      } else {
        reject("Entry not found")
      }
    }
    rq.onerror = () => reject(rq.error)
  })
}
export { updateVocabularyEntry }
