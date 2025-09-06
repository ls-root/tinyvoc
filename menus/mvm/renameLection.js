// renameLection.js - rename lection
import { readAllData } from "../../scripts/dbHelpers/read.js"
import { vars } from "../../scripts/vars.js"

async function renameLection(oldName, newName) {
  const all = await readAllData()
  const itemsToRename = all.filter((x) => x.lection === oldName)

  if (!itemsToRename.length) {
    console.log(`No entries found for lection "${oldName}"`)
    return
  }

  const tx = vars.db.transaction("vocabulary", "readwrite")
  const store = tx.objectStore("vocabulary")

  itemsToRename.forEach((item) => {
    item.lection = newName
    store.put(item)
  })

  tx.oncomplete = () => {
    console.log(
      `Lection "${oldName}" moved to "${newName}" (${itemsToRename.length} items updated)`,
    )
  }

  tx.onerror = (e) => {
    console.error("Rename failed:", e.target.error)
  }
}
export { renameLection }
