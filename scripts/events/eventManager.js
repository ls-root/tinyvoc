// eventManager.js - Event Listeners
import { startClock } from "./timedEvents.js"
import { masterKeydown } from "./masterKeydown.js"

function startEvents() {
  startClock()
  masterKeydown()
}

export { startEvents }
