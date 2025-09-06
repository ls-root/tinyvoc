// broadcastTextField.js - utility function for text fields in the broadcast menu
function broadcastTextField(oldState = "main") {
  return new Promise((resolve, reject) => {
    currentBroadcastValue = ""
    document.getElementById("broadcasti").innerText = ""

    function cleanupTextField() {
      document.getElementById("broadcasti").innerText = ""
      currentBroadcastValue = ""
    }

    function textFieldHandler(e) {
      if (e.key === "Enter") {
        const valueToReturn = currentBroadcastValue
        cleanupTextField()
        document.removeEventListener("keydown", textFieldHandler)
        broadcastState = oldState
        resolve(valueToReturn)
        e.preventDefault()
      } else if (e.key === "Escape" || e.key === "-" || e.key === "/") {
        cleanupTextField()
        document.removeEventListener("keydown", textFieldHandler)
        broadcastState = oldState
        resolve(null)
        e.preventDefault()
      } else if (e.key === "Backspace") {
        currentBroadcastValue = currentBroadcastValue.slice(0, -1)
        document.getElementById("broadcasti").innerText = currentBroadcastValue
        e.preventDefault()
      } else if (e.key.length === 1) {
        currentBroadcastValue += e.key
        document.getElementById("broadcasti").innerText = currentBroadcastValue
        e.preventDefault()
      }
    }

    document.addEventListener("keydown", textFieldHandler)
  })
}
