// writeConfig.js - write to config store
import { vars } from "../../vars.js"

function writeConfig(key, value) {
  if (!vars.db) return
  const tx = vars.db.transaction("config", "readwrite")
  const store = tx.objectStore("config")
  store.put({ key, value })
}

export { writeConfig }
