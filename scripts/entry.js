// entry.js - entry point
import { bannerInit } from "./bannerInit.js"
import { startEvents } from "./events/eventManager.js"
import { initDB } from "./dbHelpers/initDb.js"
import { bootUpMessage } from "./bootUpMessage.js"
import { loadConfiguration } from "./dbHelpers/config/loadConfiguration.js"
import { readConfig } from "./dbHelpers/config/readConfig.js"

await initDB()
if (await readConfig("nextBootUpMessage") != false) {
  bootUpMessage()
} else {
  setTimeout(loadConfiguration, 2) // waiting for db to initalize
  bannerInit()
  startEvents()
}
