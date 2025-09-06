// logic.js - logic for git menu
import { vars } from "../../scripts/vars.js"
import { toHash } from "./toHash.js"
import { readGit } from "../../scripts/dbHelpers/git/readGit.js"
import { writeGit } from "../../scripts/dbHelpers/git/writeGit.js"
import { importData } from "../../scripts/dbHelpers/import/importData.js"
import { deleteAllData } from "../../scripts/dbHelpers/deleteAllData.js"
import { readAllData, readAllLections, readLectionData } from "../../scripts/dbHelpers/read.js"
import { setGitFooter, gitTextField } from "./gitTextField.js"

async function handleGitMenu(e) {
  const clearUI = () => {
    const branchList = document.getElementById("branchlist")
    const gitLog = document.getElementById("gitlog")
    if (branchList) branchList.innerHTML = ""
    if (gitLog) gitLog.innerText = ""
  }

  if (vars.gitState === "select") {
    if (e.key === "i" || e.key === "I") {
      clearUI()
      try {
        const isInitialized = await readGit("git")
        if (isInitialized) {
          setGitFooter("Git is already initialized")
        } else {
          // Initialize git
          await writeGit("git", true)
          await writeGit("trackedFiles", [])
          await writeGit("commits", [])
          await writeGit("branches", ["master"])
          await writeGit("currentBranch", "master")
          await writeGit("branch_master", await readAllData())
          setGitFooter("Initialized Git")
        }
      } catch (error) {
        console.error("Git initialization error:", error)
        setGitFooter("Failed to initialize Git")
      }
    } else if (e.key === "a" || e.key === "A") {
      clearUI()
      try {
        const isInitialized = await readGit("git")
        if (!isInitialized) {
          setGitFooter("Git not initialized.")
          return
        }

        let trackedFiles = await readGit("trackedFiles")
        if (!Array.isArray(trackedFiles)) trackedFiles = []

        const newFile = await gitTextField("file")

        if (newFile === null || newFile.trim() === "") {
          setGitFooter("File add cancelled")
          return
        }

        const allLections = await readAllLections()
        if (!allLections.includes(newFile)) {
          setGitFooter(`File '${newFile}' does not exist`)
          return
        }

        if (trackedFiles.includes(newFile)) {
          setGitFooter(`'${newFile}' already tracked`)
          return
        }

        trackedFiles.push(newFile)
        await writeGit("trackedFiles", trackedFiles)
        setGitFooter(`Added '${newFile}'`)

      } catch (error) {
        console.error("Failed to add file to tracking:", error)
        setGitFooter("Failed to add file")
      }
    } else if (e.key === "c" || e.key === "C") {
      clearUI()
      try {
        const isInitialized = await readGit("git")
        if (!isInitialized) {
          setGitFooter("Git not initialized.")
          return
        }

        const commitMessage = await gitTextField("Commit Message")
        if (!commitMessage?.trim()) {
          setGitFooter("Commit cancelled")
          return
        }

        let trackedFiles = await readGit("trackedFiles")
        if (!Array.isArray(trackedFiles)) trackedFiles = []

        if (trackedFiles.length === 0) {
          setGitFooter("Nothing to commit")
          return
        }

        const trackedDataPromises = trackedFiles.map(lectionName => readLectionData(lectionName))
        const trackedDataArrays = await Promise.all(trackedDataPromises)
        const trackedVocabularyData = trackedDataArrays.flat()

        const commitHash = toHash(JSON.stringify(trackedVocabularyData) + commitMessage + Date.now())

        let commits = await readGit("commits")
        if (!Array.isArray(commits)) commits = []

        commits.push({
          hash: commitHash,
          message: commitMessage,
          time: Date.now(),
          files: trackedFiles,
          entryCount: trackedVocabularyData.length
        })

        await writeGit("commits", commits)
        await writeGit(commitHash, trackedVocabularyData)

        setGitFooter(`Committed: ${commitHash.substring(0, 7)}`)

      } catch (error) {
        console.error("Commit failed:", error)
        setGitFooter("Commit failed")
      }
    } else if (e.key === "l" || e.key === "L") {
      clearUI()
      const commits = await readGit("commits") || []
      const gitLog = document.getElementById("gitlog")
      if (!gitLog) return;

      commits.forEach(item => {
        const log1 = document.createElement("p")
        const log2 = document.createElement("p")
        const br1 = document.createElement("br")
        const log4 = document.createElement("p")
        const br2 = document.createElement("br")

        log1.innerText = "commit " + item.hash
        log1.style.color = "orange" // mimick git style
        log2.innerText = "Date: " + new Date(item.time).toString().slice(0, 24)
        log4.innerText = item.message
        log4.style.marginLeft = "20px"

        gitLog.appendChild(log1)
        gitLog.appendChild(log2)
        gitLog.appendChild(br1)
        gitLog.appendChild(log4)
        gitLog.appendChild(br2)
      })
    } else if (e.key === "h" || e.key === "H") {
      clearUI()
      const inputHash = await gitTextField("commit hash")
      if (!inputHash || inputHash.trim() === "") {
        setGitFooter("cherry-pick cancelled")
        return
      }

      const commits = await readGit("commits")
      if (!Array.isArray(commits)) {
        setGitFooter("No commits found")
        return
      }

      let foundCommit = null
      for (const commit of commits) {
        if (commit.hash === inputHash || commit.hash.startsWith(inputHash)) {
          foundCommit = commit
          break
        }
      }

      if (foundCommit) {
        const commitData = await readGit(foundCommit.hash)
        const currentData = await readAllData()

        const commitDataString = JSON.stringify(commitData.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)))
        const currentDataString = JSON.stringify(currentData.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)))

        if (commitDataString !== currentDataString) {
          const force = await gitTextField("Conflict! force? [y/n]")
          if (!force || !["y", "n"].includes(force.toLowerCase().trim())) {
            setGitFooter("Answer with 'y' or 'n'")
            return
          }

          if (force.toLowerCase().trim() === "y") {
            try {
              await deleteAllData()
              await importData(commitData)
              setGitFooter(`Cherry-picked: ${foundCommit.hash.substring(0, 7)}`)
            } catch (error) {
              console.error("Cherry-pick failed:", error)
              setGitFooter("Cherry-pick failed")
            }
          } else {
            setGitFooter("Cherry-pick aborted")
          }
        } else {
          setGitFooter("No differences")
        }
      } else {
        setGitFooter(`Commit hash not found`)
      }
    } else if (e.key === "b" || e.key === "B") {
      clearUI()
      // branch submenu entry
      vars.gitState = "branch"
    } else if (e.key === "e" || e.key === "E") {
      clearUI()
      const branchName = await gitTextField("branch name")
      if (!branchName || !branchName.trim()) {
        setGitFooter("Branch switch cancelled")
        return
      }
      const branches = await readGit("branches") || []

      if (!branches.includes(branchName)) {
        setGitFooter(`Branch '${branchName}' does not exist`)
        return
      }

      const currentBranch = await readGit("currentBranch")

      if (currentBranch) {
        const currentData = await readAllData()
        await writeGit(`branch_${currentBranch}`, currentData)
      }

      const branchData = await readGit(`branch_${branchName}`)
      if (branchData) {
        await deleteAllData()
        await importData(branchData)
      }

      await writeGit("currentBranch", branchName)
      setGitFooter(`Switched to branch '${branchName}'`)
    } else if (e.key === "r" || e.key === "R") {
      clearUI()
      try {
        const isInitialized = await readGit("git")
        if (!isInitialized) {
          setGitFooter("Git not initialized.")
          return
        }

        let trackedFiles = await readGit("trackedFiles")
        if (!Array.isArray(trackedFiles)) trackedFiles = []

        const newFile = await gitTextField("file")

        if (newFile === null || newFile.trim() === "") {
          setGitFooter("File remove cancelled")
          return
        }

        const allLections = await readAllLections()
        if (!allLections.includes(newFile)) {
          setGitFooter(`File does not exist`)
          return
        }

        if (!trackedFiles.includes(newFile)) {
          setGitFooter(`file is not tracked`)
          return
        }

        const index = trackedFiles.indexOf(newFile)
        trackedFiles.pop(index)
        await writeGit("trackedFiles", trackedFiles)
        setGitFooter(`Removed file`)

      } catch (error) {
        console.error("Failed to remove file from tracking:", error)
        setGitFooter("Failed remove file")
      }
    }
  } else if (vars.gitState === "branch") {
    const branchListContainer = document.getElementById("branchlist")
    if (branchListContainer) branchListContainer.innerHTML = ""

    if (e.key === "c" || e.key === "C") {
      const branchName = await gitTextField("branch name")
      if (!branchName || !branchName.trim()) {
        setGitFooter("Branch creation cancelled")
        vars.gitState = "select"
        return
      }

      const branches = await readGit("branches") || []
      if (branches.includes(branchName)) {
        setGitFooter(`Branch '${branchName}' already exists`)
        vars.gitState = "select"
        return
      }

      const currentData = await readAllData()

      branches.push(branchName)
      await writeGit("branches", branches)
      await writeGit(`branch_${branchName}`, currentData)

      setGitFooter(`Created branch '${branchName}'`)
      vars.gitState = "select"
    } else if (e.key === "l" || e.key === "L") {
      const branches = await readGit("branches") || []
      const currentBranch = await readGit("currentBranch") || "main"

      const branchListContainer = document.getElementById("branchlist")
      if (branchListContainer) branchListContainer.innerHTML = ""

      for (const branch of branches) {
        const marker = branch === currentBranch ? "* " : "  "
        const branchElement = document.createElement("p")
        branchElement.innerText = `${marker}${branch}`
        branchListContainer.appendChild(branchElement)
      }
    } else if (e.key === "d" || e.key === "D") {
      const branchName = await gitTextField("branch name")
      if (!branchName || !branchName.trim()) {
        setGitFooter("Branch deletion cancelled")
        vars.gitState = "select"
        return
      }
      const branches = await readGit("branches") || []
      const currentBranch = await readGit("currentBranch")

      if (branchName === "main" || branchName === "master") {
        setGitFooter("Cannot delete main or master branch")
        vars.gitState = "select"
        return
      }

      if (branchName === currentBranch) {
        setGitFooter("Cannot delete current branch")
        vars.gitState = "select"
        return
      }

      if (!branches.includes(branchName)) {
        setGitFooter(`Branch '${branchName}' does not exist`)
        vars.gitState = "select"
        return
      }

      const updatedBranches = branches.filter(b => b !== branchName)
      await writeGit("branches", updatedBranches)
      await writeGit(`branch_${branchName}`, null)

      setGitFooter(`Deleted branch '${branchName}'`)
      vars.gitState = "select"
    } else if (e.key === "Escape") {
      vars.gitState = "select"
      setGitFooter("Back to git menu")
    }
  }
}
export { handleGitMenu }
