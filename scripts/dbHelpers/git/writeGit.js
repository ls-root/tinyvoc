// writeGit.js - write Git specific data
import { vars } from "../../vars.js"

function writeGit(key, value) {
  return new Promise((resolve, reject) => {
    if (!vars.db) return reject("Database not available")

    const tx = vars.db.transaction("git", "readwrite")
    const store = tx.objectStore("git")
    const request = store.put({ key, value })

    request.onsuccess = () => {
      console.log(`Git entry written: ${key} = ${value}`)
      resolve()
    }

    request.onerror = () => {
      console.error(`Failed to write git entry: ${key}`, request.error)
      reject(request.error)
    }
  })
}
export { writeGit }
