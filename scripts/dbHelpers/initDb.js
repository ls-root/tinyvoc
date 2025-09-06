// initDb.js - initialize IndexedDB
import { vars } from "../vars.js"
import { readConfig } from "../dbHelpers/config/readConfig.js"
import { writeConfig } from "../dbHelpers/config/writeConfig.js"

function initDB() {
  const req = indexedDB.open("tinyvocDB", 6)
  req.onupgradeneeded = (e) => {
    vars.db = e.target.result

    if (vars.db.objectStoreNames.contains("vocabulary")) {
      db.deleteObjectStore("vocabulary")
    }

    const vocabStore = vars.db.createObjectStore("vocabulary", {
      keyPath: "id",
      autoIncrement: true,
    })

    vocabStore.createIndex("vocabWord", "vocabWord", { unique: false })

    // Config table
    if (!vars.db.objectStoreNames.contains("config")) {
      vars.db.createObjectStore("config", { keyPath: "key" })
    }

    // Git table
    if (!vars.db.objectStoreNames.contains("git")) {
      vars.db.createObjectStore("git", { keyPath: "key" })
    }

    // General Purpose table
    if (!vars.db.objectStoreNames.contains('GeneralPurpose')) {
      vars.db.createObjectStore('GeneralPurpose', { keyPath: 'key' })
    }
  }
  req.onsuccess = async (e) => {
    vars.db = e.target.result

    const ignoreCase = await readConfig("ignoreCase").catch(() => null)
    if (ignoreCase === null) {
      writeConfig("ignoreCase", false)
    }
  }
  req.onerror = (e) => console.log("DB error", e)
}
export { initDB }
