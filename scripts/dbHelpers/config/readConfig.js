// readConfig.js - read from config store
function readConfig(key) {
  return new Promise((res, rej) => {
    if (!db) return rej()
    const tx = db.transaction("config", "readonly")
    const store = tx.objectStore("config")
    const rq = store.get(key)
    rq.onsuccess = () => res(rq.result?.value || null)
    rq.onerror = () => rej()
  })
}

export { readConfig }
