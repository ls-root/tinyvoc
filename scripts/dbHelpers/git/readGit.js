// readGit.js - read from git store
import { vars } from "../../vars.js"

function readGit(key) {
  return new Promise((resolve, reject) => {
    if (!vars.db) return reject("Database not available")

    const tx = vars.db.transaction("git", "readonly")
    const store = tx.objectStore("git")
    const request = store.get(key)

    request.onsuccess = () => {
      const result = request.result
      if (result) {
        resolve(result.value)
      } else {
        resolve(null) // Key not found
      }
    }

    request.onerror = () => {
      console.error(`Failed to read git entry: ${key}`, request.error)
      reject(request.error)
    }
  })
}
export { readGit }
