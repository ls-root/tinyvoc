// validateLectionsInput.js - validate lection name
import { readAllLections } from "../dbHelpers/read.js"
async function validateLectionsInput(inputValue) {
  const trimmedInput = inputValue.trim().toLowerCase()

  if (trimmedInput === "all") {
    return true
  }

  const lectionNames = inputValue.split(",").map(name => name.trim()).filter(name => name.length > 0)

  const existingLections = await readAllLections()

  for (const lectionName of lectionNames) {
    if (!existingLections.includes(lectionName)) {
      return false
    }
  }

  return true
}

export { validateLectionsInput }
