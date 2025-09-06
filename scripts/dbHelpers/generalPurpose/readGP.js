// readGP.js - read from General Purpose store
import { vars } from "../../../scripts/vars.js"

async function readGP(key) {
  return new Promise((resolve, reject) => {
    try {
      const tx = vars.db.transaction(['GeneralPurpose'], 'readonly')
      const store = tx.objectStore('GeneralPurpose')
      const request = store.get(key)

      request.onsuccess = () => {
        if (request.result) {
          console.log(`GP: Retrieved ${key}`)
          resolve(request.result.value)
        } else {
          console.log(`GP: Key ${key} not found`)
          resolve(null)
        }
      }

      request.onerror = () => {
        console.error(`GP: Failed to read ${key}:`, request.error)
        reject(request.error)
      }

      tx.onerror = () => {
        console.error(`GP: Transaction failed for ${key}:`, tx.error)
        reject(tx.error)
      }

    } catch (error) {
      console.error(`GP: Error reading ${key}:`, error)
      reject(error)
    }
  })
}
export { readGP }
