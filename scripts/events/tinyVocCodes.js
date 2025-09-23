// tinyVocCodes.js - special hash codes to do some actions
import { writeConfig } from "../dbHelpers/config/writeConfig.js"
import { vars } from "../vars.js"

function tinyVocCodes() {
  window.addEventListener("hashchange", async () => {
    switch (location.hash) {
      case "#ResetConfig": {
        const configKeys = Object.keys(vars.defaultConfiguration)
        await Promise.all(
          configKeys.map(key => writeConfig(key, vars.defaultConfiguration[key]))
        )
        await writeConfig("nextBootUpMessage", "TinyVoc configuration reset successfully")
        window.location.reload()
        break;
      }

      case "#version": {
        await writeConfig("nextBootUpMessage", "TinyVoc is running on version: " + vars.version) // writes lastchange
        window.location.reload()
        break;
      }

      case "#lastChange": {
        await writeConfig("nextBootUpMessage", "Last Change <br>" + vars.lastChangelog)
        window.location.reload()
        break;
      }
    }
  })
}

export { tinyVocCodes }
