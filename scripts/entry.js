// entry.js - entry point
import { bannerInit } from "./bannerInit.js"
import { startEvents } from "./events/eventManager.js"
import { initDB } from "./dbHelpers/initDb.js"

initDB()
bannerInit()
startEvents()
