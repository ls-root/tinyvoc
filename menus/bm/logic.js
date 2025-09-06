// logic.js - logic for broadcast menu
import { vars } from "../../scripts/vars.js"
import { hideBroadcastMenu } from "../bm/display.js"
import { showMainMenu } from "../mm/display.js"
import { validateLectionsInput } from "../../scripts/sharedHelpers/validateLectionsInput.js"
import { getLectionData } from "../../scripts/dbHelpers/getLectionData.js"
import { importData } from "../../scripts/dbHelpers/import/importData.js"
import { download } from "../../scripts/sharedHelpers/download.js"
import { readGP } from "../../scripts/dbHelpers/generalPurpose/readGP.js"
import { writeGP } from "../../scripts/dbHelpers/generalPurpose/writeGP.js"

async function handleBroadcastMenu(e) {
  if (vars.broadcastState === "main") {
    if (e.key === "f") {
      document.getElementById("broadcast").style.display = "flex"
      document.getElementById("broadcastt").innerText = "lections: "
      vars.broadcastState = "lections"
      vars.currentBroadcastValue = ""
      document.getElementById("broadcasti").innerText = ""
    } else if (e.key === "w") {
      vars.broadcastState = "webrtc"
    }
  } else if (vars.broadcastState === "webrtc") {
    if (e.key === "Escape") {
      vars.broadcastState = "main"
    } else if (e.key === "r") {
      vars.recvPeer = new Peer()

      vars.recvPeer.on("open", id => {
        document.getElementById("peerid").style.display = "block"
        document.getElementById("peerid").innerHTML = "peer-id " + id
      })

      vars.recvPeer.on("connection", conn => {
        vars.recvConn = conn
        vars.recvConn.on("open", () => {
          document.getElementById("peerid").innerText += ". Connected"
        })

        vars.recvConn.on("data", data => {
          hideBroadcastMenu()
          showMainMenu()
          try {
            let parsedData
            if (typeof data === 'string') {
              parsedData = JSON.parse(data)
            } else {
              parsedData = data
            }

            const vocabularyArray = parsedData.vocabulary || parsedData
            importData(vocabularyArray)
          } catch (error) {
            console.error("Failed to import received data:", error)
          }
        })

        vars.recvPeer.on("error", err => {
          console.error(err)
          document.getElementById("peerid").innerText += ". Error check console for details"
        })
      })

      vars.broadcastState = "main"
    } else if (e.key === "s") {
      document.getElementById("peerid").style.display = "block"
      document.getElementById("peerid").innerText = "Enter peer ID in URL hash"

      const handleHashChange = async () => {
        const hash = window.location.hash.substring(1)
        if (hash) {
          await writeGP("peerid", hash)
          document.getElementById("peerid").innerText = `Peer ID saved: ${hash}.`

          window.removeEventListener("hashchange", handleHashChange)

          document.getElementById("broadcast").style.display = "flex"
          document.getElementById("broadcastt").innerText = "lections: "
          vars.broadcastState = "send_lections"
          vars.currentBroadcastValue = ""
          document.getElementById("broadcasti").innerText = ""
        }
      }

      window.addEventListener("hashchange", handleHashChange)

      const currentHash = window.location.hash.substring(1)
      if (currentHash) {
        handleHashChange()
      }
    }
  } else if (vars.broadcastState === "lections") {
    if (e.key === "Backspace") {
      vars.currentBroadcastValue = vars.currentBroadcastValue.slice(0, -1)
    } else if (e.key === "Enter") {
      if (vars.currentBroadcastValue.trim()) {
        // Validate lections input
        const isValid = await validateLectionsInput(vars.currentBroadcastValue)
        if (isValid) {
          document.getElementById("broadcasti").style.color = "white"
          const data = await getLectionData(vars.currentBroadcastValue)
          download(JSON.stringify(JSON.parse(data).vocabulary))
          document.getElementById("broadcast").style.display = "none"
          vars.broadcastState = "main"
          vars.currentBroadcastValue = ""
        } else {
          document.getElementById("broadcasti").style.color = "red"
        }
      }
    } else if (e.key === "Escape") {
      document.getElementById("broadcast").style.display = "none"
      vars.broadcastState = "main"
      vars.currentBroadcastValue = ""
    } else if (e.key.length === 1) {
      vars.currentBroadcastValue += e.key
    }
    document.getElementById("broadcasti").innerText = vars.currentBroadcastValue
  } else if (vars.broadcastState === "send_lections") {
    if (e.key === "Backspace") {
      vars.currentBroadcastValue = vars.currentBroadcastValue.slice(0, -1)
    } else if (e.key === "Enter") {
      if (vars.currentBroadcastValue.trim()) {
        // Validate lections input
        const isValid = await validateLectionsInput(vars.currentBroadcastValue)
        if (isValid) {
          document.getElementById("broadcasti").style.color = "white"
          const data = await getLectionData(vars.currentBroadcastValue)
          const peerid = await readGP("peerid")

          vars.sendPeer = new Peer()
          vars.sendPeer.on("open", () => {
            vars.sendConn = vars.sendPeer.connect(peerid)
            vars.sendConn.on("open", () => {
              try {
                const parsedData = JSON.parse(data)
                vars.sendConn.send(parsedData)
                document.getElementById("broadcast").style.display = "none"
                document.getElementById("peerid").style.display = "none"
                vars.broadcastState = "main"
                vars.currentBroadcastValue = ""
              } catch (error) {
                console.error("Failed to send data:", error)
                document.getElementById("broadcast").style.display = "none"
                document.getElementById("peerid").style.display = "none"
                vars.broadcastState = "main"
                vars.currentBroadcastValue = ""
              }
            })

            vars.sendConn.on("error", (err) => {
              console.error("Connection error:", err)
              document.getElementById("broadcast").style.display = "none"
              document.getElementById("peerid").style.display = "none"
              vars.broadcastState = "main"
              vars.currentBroadcastValue = ""
            })
          })

          vars.sendPeer.on("error", (err) => {
            console.error("Peer error:", err)
            document.getElementById("broadcast").style.display = "none"
            document.getElementById("peerid").style.display = "none"
            vars.broadcastState = "main"
            vars.currentBroadcastValue = ""
          })
        } else {
          document.getElementById("broadcasti").style.color = "red"
        }
      }
    } else if (e.key === "Escape") {
      document.getElementById("broadcast").style.display = "none"
      document.getElementById("peerid").style.display = "none"
      vars.broadcastState = "main"
      vars.currentBroadcastValue = ""
    } else if (e.key.length === 1) {
      vars.currentBroadcastValue += e.key
    }
    document.getElementById("broadcasti").innerText = vars.currentBroadcastValue
  }
}

export { handleBroadcastMenu }
