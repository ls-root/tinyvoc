// logic.js - logic for git status menu 
import { readGit } from "../../scripts/dbHelpers/git/readGit.js"
import { readAllLections, readAllData } from "../../scripts/dbHelpers/read.js"

async function handleStatusMenu() {
  let gitState = false
  if (await readGit("git")) {
    gitState = true
    document.getElementById("gitstatus").innerText = "Enabled"
    document.getElementById("ifgit").style.display = "block"
    document.getElementById("modifiedfiles").innerHTML = ""
    // Render untrackedFiles
    const trackedFilesJson = await readGit("trackedFiles")
    const trackedFiles = trackedFilesJson ? trackedFilesJson : []
    const allFiles = await readAllLections()
    const untrackedFiles = allFiles.filter(file => !trackedFiles.includes(file))

    document.getElementById("untracked").innerHTML = ""
    untrackedFiles.forEach((item) => {
      const untrackedFileElement = document.createElement("p")
      untrackedFileElement.innerText = item
      untrackedFileElement.style.marginLeft = "20px"
      untrackedFileElement.style.color = "red"
      document.getElementById("untracked").appendChild(untrackedFileElement)
    })
    // Get modified files
    const commits = await readGit("commits") || []
    if (commits.length === 0) return await readAllLections()

    const lastCommitData = await readGit(commits[commits.length - 1].hash)
    if (!lastCommitData) return []

    const currentData = await readAllData()

    const groupByLection = (data) =>
      data.reduce((acc, item) => {
        if (!acc[item.lection]) acc[item.lection] = []
        acc[item.lection].push(item)
        return acc
      }, {})

    const lastCommitByLection = groupByLection(lastCommitData)
    const currentByLection = groupByLection(currentData)

    const allLections = [...new Set([...Object.keys(lastCommitByLection), ...Object.keys(currentByLection)])]

    const modifiedFiles = allLections.filter(lection =>
      JSON.stringify(lastCommitByLection[lection] || []) !== JSON.stringify(currentByLection[lection] || [])
    )
    // render modified files
    modifiedFiles.forEach((item) => {
      const modifiedElement = document.createElement("p")
      modifiedElement.innerText = "modified: " + item
      modifiedElement.style.marginLeft = "20px"
      modifiedElement.style.color = "red"
      document.getElementById("modifiedfiles").appendChild(modifiedElement)
    })
  } else {
    gitState = false
    document.getElementById("gitstatus").innerText = "Disabled"
    document.getElementById("ifgit").style.display = "none"
  }
}
export { handleStatusMenu }
