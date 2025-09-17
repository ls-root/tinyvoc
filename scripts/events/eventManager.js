// eventManager.js - Event Listeners
import { startClock } from "./timedEvents.js"
import { masterKeydown } from "./masterKeydown.js"
import { tinyVocCodes } from "./tinyVocCodes.js"

function startEvents() {
  startClock()
  masterKeydown()
  tinyVocCodes()
}

export { startEvents }
