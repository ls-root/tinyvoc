// writeData.js - write vocabulary into Db 
import { vars } from "../vars.js"
function writeData(vocabWord, value, lection) {
  if (!vars.db) return
  const tx = vars.db.transaction("vocabulary", "readwrite")
  const store = tx.objectStore("vocabulary")
  store.put({
    vocabWord,
    value,
    lection,
    weight: 1,
    wrong: 0,
    right: 0,
    // id will be auto-generated
  })
}

export { writeData }
