import { writeConfig } from "./writeConfig.js"
import { vars } from "../../vars.js"

function saveConfiguration() {
  writeConfig("MenuExitKey", vars.configuration["MenuExitKey"])
  writeConfig("IgnoreCase", vars.configuration["IgnoreCase"])
}

export { saveConfiguration }
