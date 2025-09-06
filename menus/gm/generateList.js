// generateList.js - Generate List based of user specified rules
import { readLectionData, readAllLections } from "../../scripts/dbHelpers/read.js"
import { vars } from "../../scripts/vars.js"

async function GenerateList(action, param, param2, lection) {
  console.log("Generating list")
  console.log("Action: ", action)
  console.log("Param: ", param)
  console.log("Param2: ", param2)
  const data = await readLectionData(lection)
  let result = []

  if (action == 0) {
    // Sort
    const sortProp = param || "vocabWord"
    result = [...data].sort((a, b) => {
      if (["right", "wrong", "weight"].includes(sortProp)) {
        return (a[sortProp] || 0) - (b[sortProp] || 0)
      }
      return String(a[sortProp]).localeCompare(String(b[sortProp]))
    })
  } else if (action == 1) {
    // Reverse
    console.log("data:", data)
    result = [...data].reverse()
    console.log("result:", result)
  } else if (action == 2) {
    // Remove all under specified value
    const num = Number(param)
    result = data.filter((entry) => Number(entry[param2]) > num)
  } else if (action == 3) {
    // Remove all over specified value
    const num = Number(param)
    result = data.filter((entry) => Number(entry[param2]) < num)
  } else if (action == 4) {
    // Strip down to specified value (keep only top N entries)
    const n = Number(param)
    result = data.slice(0, n)
  }

  let target = lection + "t"
  const allLections = await readAllLections()
  while (allLections.includes(target)) {
    target += "t"
  }

  return new Promise((resolve, reject) => {
    if (!vars.db) return reject("Database not available")

    const tx = vars.db.transaction("vocabulary", "readwrite")
    const store = tx.objectStore("vocabulary")

    tx.oncomplete = () => {
      console.log(`Successfully created ${result.length} entries in lection: ${target}`)
      document.getElementById("ttransto").innerText = target
      resolve(result)
    }

    tx.onerror = (event) => {
      console.error("Transaction failed:", event.target.error)
      reject(event.target.error)
    }

    result.forEach((item) => {
      const request = store.put({
        vocabWord: item.vocabWord,
        value: item.value,
        lection: target,
        weight: 1,
        wrong: 0,
        right: 0,
      })

      request.onerror = (event) => {
        console.error("Failed to add item:", item.vocabWord, event.target.error)
      }
    })
  })
}
export { GenerateList }
