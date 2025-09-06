// deleteAllData.js - delete all vocabulary
import { vars } from "../vars.js"

function deleteAllData() {
  return new Promise((resolve, reject) => {
    if (!vars.db) return reject("Database not available")

    const tx = vars.db.transaction("vocabulary", "readwrite")
    const store = tx.objectStore("vocabulary")
    const request = store.clear()

    request.onsuccess = () => {
      console.log("All data deleted successfully")
      resolve()
    }

    request.onerror = (e) => {
      console.error("Failed to delete data:", e.target.error)
      reject(e.target.error)
    }
  })
}
export { deleteAllData }
