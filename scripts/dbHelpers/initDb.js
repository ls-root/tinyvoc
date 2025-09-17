// initDb.js - initialize IndexedDB
import { vars } from "../vars.js"
import { readConfig } from "../dbHelpers/config/readConfig.js"
import { writeConfig } from "../dbHelpers/config/writeConfig.js"

function initDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("tinyvocDB", 6)

    req.onupgradeneeded = (e) => {
      vars.db = e.target.result
      if (vars.db.objectStoreNames.contains("vocabulary")) {
        vars.db.deleteObjectStore("vocabulary")
      }
      const vocabStore = vars.db.createObjectStore("vocabulary", {
        keyPath: "id",
        autoIncrement: true,
      })
      vocabStore.createIndex("vocabWord", "vocabWord", { unique: false })

      // Config table
      if (!vars.db.objectStoreNames.contains("config")) {
        vars.db.createObjectStore("config", { keyPath: "key" })
        writeConfig("nextBootUpMessage", false)
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
      try {
        vars.db = e.target.result
        const configKeys = Object.keys(vars.defaultConfiguration)
        const configResults = await Promise.all(
          configKeys.map(key => readConfig(key).catch(() => null))
        )
        const hasNullValues = configResults.some(value => value === null)

        if (hasNullValues) {
          await Promise.all(
            configKeys.map(key => writeConfig(key, vars.defaultConfiguration[key]))
          )
        }

        resolve(vars.db)
      } catch (error) {
        reject(error)
      }
    }

    req.onerror = (e) => {
      console.log("DB error", e)
      reject(e)
    }
  })
}

export { initDB }
