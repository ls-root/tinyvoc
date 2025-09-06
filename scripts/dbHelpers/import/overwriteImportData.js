// overwriteImportData.js - silent import (overrite)
import { deleteAllData } from "../deleteAllData.js"
import { addOnlyImportData } from "./addOnlyImportData.js"

function overwriteImportData(data) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("OVERWRITE MODE: Deleting all existing data first")
      await deleteAllData()

      console.log("OVERWRITE MODE: Adding new data")
      await addOnlyImportData(data)

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export { overwriteImportData }
