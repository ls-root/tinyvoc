// tinyVocCodes.js - special hash codes to do some actions
import { writeConfig } from "../dbHelpers/config/writeConfig.js"
import { vars } from "../vars.js"


function tinyVocCodes() {
  window.addEventListener("hashchange", async () => {
    if (location.hash === "#ResetConfig") {
      const configKeys = Object.keys(vars.defaultConfiguration)
      await Promise.all(
        configKeys.map(key => writeConfig(key, vars.defaultConfiguration[key]))
      )
      await writeConfig("nextBootUpMessage", "TinyVoc configuration reset successfully")
      window.location.reload()
    }
  })
}

export { tinyVocCodes }
