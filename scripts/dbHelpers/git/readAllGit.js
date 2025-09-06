// readAllGit.js - read all entries from git specific store
function readAllGit() {
  return new Promise((resolve, reject) => {
    if (!db) return reject("Database not available")

    const tx = db.transaction("git", "readonly")
    const store = tx.objectStore("git")
    const request = store.getAll()

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      console.error("Failed to read all git entries", request.error)
      reject(request.error)
    }
  })
}
