// timedEvents.js - Events that happen time based
import { vars } from "../vars.js"
function updateClockDisplay() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  vars.clockDisplayEl.innerText = `${hours}:${minutes}`
}

function startClock() {
  updateClockDisplay() // Initaliy set clock
  setInterval(updateClockDisplay, 1000)
}

export { startClock }
