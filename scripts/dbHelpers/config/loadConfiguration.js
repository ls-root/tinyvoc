import { vars } from "../../vars.js"
import { readConfig } from "./readConfig.js"
import { postConfigLoad } from "../../postConfigLoad.js"

async function loadConfiguration() {
  vars.configuration["MenuExitKey"] = await readConfig("MenuExitKey")
  vars.configuration["IgnoreCase"] = await readConfig("IgnoreCase")
  postConfigLoad()
}
export { loadConfiguration }
