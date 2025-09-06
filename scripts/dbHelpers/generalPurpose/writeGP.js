// writeGP.js - write into General Purpose store
import { vars } from "../../vars.js"

async function writeGP(key, value) {
  return new Promise((resolve, reject) => {
    try {
      const tx = vars.db.transaction(['GeneralPurpose'], 'readwrite')
      const store = tx.objectStore('GeneralPurpose')

      const data = {
        key: key,
        value: value,
        timestamp: Date.now()
      }

      const request = store.put(data)

      request.onsuccess = () => {
        console.log(`GP: Saved ${key}`)
        resolve(true)
      }

      request.onerror = () => {
        console.error(`GP: Failed to save ${key}:`, request.error)
        reject(request.error)
      }

      tx.onerror = () => {
        console.error(`GP: Transaction failed for ${key}:`, tx.error)
        reject(tx.error)
      }

    } catch (error) {
      console.error(`GP: Error writing ${key}:`, error)
      reject(error)
    }
  })
}
export { writeGP }
