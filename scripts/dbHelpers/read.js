// read.js - retriving data from vocabulary store
import { vars } from "../vars.js"

function getData(vocabWord) {
  return new Promise((res, rej) => {
    if (!vars.db) return rej()
    const tx = vars.db.transaction("vocabulary", "readonly")
    const store = tx.objectStore("vocabulary")
    const index = store.index("vocabWord")
    const rq = index.get(vocabWord)
    rq.onsuccess = () => res(rq.result?.value || "")
    rq.onerror = () => rej()
  })
}

function readAllData() {
  return new Promise((res, rej) => {
    if (!vars.db) return rej()
    const tx = vars.db.transaction("vocabulary", "readonly")
    const store = tx.objectStore("vocabulary")
    const rq = store.getAll()
    rq.onsuccess = () => res(rq.result)
    rq.onerror = () => rej()
  })
}

async function readLectionData(lection) {
  const all = await readAllData()
  return all.filter((x) => x.lection === lection)
}

async function readAllLections() {
  const all = await readAllData()
  return [...new Set(all.map((x) => x.lection))]
}

export { getData, readAllData, readLectionData, readAllLections }
