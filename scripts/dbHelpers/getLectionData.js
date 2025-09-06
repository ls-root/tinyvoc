// getLectionData.js - get data of a lection
import { vars } from "../vars.js"

async function getLectionData(lectionString) {
  return new Promise(async (resolve, reject) => {
    try {
      const isAll = lectionString.toLowerCase().trim() === "all"
      const lectionNames = isAll ? [] : lectionString.split(',').map(name => name.trim())

      const tx = vars.db.transaction(['vocabulary'], 'readonly')
      const store = tx.objectStore('vocabulary')
      const request = store.getAll()

      request.onsuccess = () => {
        let filteredData = request.result || []

        if (!isAll) {
          filteredData = filteredData.filter(item =>
            lectionNames.includes(item.lection)
          )
        }

        // Format the data for importData function
        // Assuming importData expects JSON format with vocabulary structure
        const formattedData = {
          vocabulary: filteredData.map(item => ({
            vocabWord: item.vocabWord,
            value: item.value,
            lection: item.lection,
            wrong: item.wrong || 0,
            right: item.right || 0,
            id: item.id
          }))
        }

        resolve(JSON.stringify(formattedData))
      }

      request.onerror = () => {
        reject(new Error(`Failed to retrieve lection data: ${request.error}`))
      }

    } catch (error) {
      reject(new Error(`Error processing lection string "${lectionString}": ${error.message}`))
    }
  })
}

export { getLectionData }
