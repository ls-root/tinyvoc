// checkAnswer.js - check answer from training mode
import { vars } from "../../scripts/vars.js"
import { nextQuestion } from "./nextQuestion.js"
import { getData } from "../../scripts/dbHelpers/read.js"
import { mkbanner } from "../../scripts/sharedHelpers/banner.js"

async function checkAnswer() {
  const vocabWord = vars.currentKey
  const correctValue = await getData(vocabWord)
  const tval = vars.currentTValueValue.trim()
  const tvElt = document.getElementById("tvalue")
  vars.sessionAttempts.set(vocabWord, (vars.sessionAttempts.get(vocabWord) || 0) + 1)

  let isCorrect = false
  if (correctValue.includes(",")) {
    const correctParts = correctValue
      .split(",")
      .map((part) => part.trim().toLowerCase())
      .sort()
    const userParts = tval
      .split(",")
      .map((part) => part.trim().toLowerCase())
      .sort()
    isCorrect =
      correctParts.length === userParts.length &&
      correctParts.every((part, index) => part === userParts[index])
  } else {
    isCorrect = tval.toLowerCase() === correctValue.toLowerCase()
  }

  tvElt.style.color = isCorrect ? "green" : "#ea4f4f"

  const currentWrongAttempts = vars.wrongAttempts.get(vocabWord) || 0

  const newWrongAttempts = isCorrect ? currentWrongAttempts : currentWrongAttempts + 1

  const tx = vars.db.transaction("vocabulary", "readwrite")
  const store = tx.objectStore("vocabulary")
  const index = store.index("vocabWord")
  const rq = index.get(vocabWord)

  rq.onsuccess = () => {
    const data = rq.result
    if (!data) return

    if (isCorrect) {
      if (currentWrongAttempts === 0) {
        vars.currentSessionScore += 1
      } else if (currentWrongAttempts === 1) {
        vars.currentSessionScore += 0.5
      }
      data.right = (data.right || 0) + 1
      data.weight = Math.max(1, (data.weight || 1) - 1)
    } else {
      data.wrong = (data.wrong || 0) + 1
      data.weight = (data.weight || 1) + 1
    }
    store.put(data)
  }

  if (isCorrect) {
    vars.trainStats.totalCorrect++
    vars.wrongAttempts.delete(vocabWord)
    vars.shuffledKeys.pop() // Remove current word
    setTimeout(() => {
      tvElt.style.color = "#5294e2"
      nextQuestion()
    }, 500)
  } else {
    vars.trainStats.totalWrong++

    vars.wrongAttempts.set(vocabWord, newWrongAttempts)

    const maxAttempts = Math.max(
      vars.trainStats.maxAttemptsPerWord.get(vocabWord) || 0,
      newWrongAttempts
    )
    vars.trainStats.maxAttemptsPerWord.set(vocabWord, maxAttempts)

    if (maxAttempts > vars.trainStats.hardestWord.attempts) {
      vars.trainStats.hardestWord = { key: vocabWord, attempts: maxAttempts }
    }

    if (newWrongAttempts >= 3) {
      vars.trainstate = "showingSolution"
      vars.currentSessionScore -= 1
      vars.currentTValueValue = correctValue
      tvElt.innerText = correctValue
      tvElt.style.color = "yellow"
      document.getElementById("trainfooter").innerText = mkbanner(
        "Press Enter to continue",
        45,
        "-",
      )

      vars.wrongAttempts.delete(vocabWord)
      vars.shuffledKeys.pop()

      if (vars.shuffledKeys.length > 0) {
        const insertPosition = Math.floor(vars.shuffledKeys.length * 0.3)
        vars.shuffledKeys.splice(insertPosition, 0, vocabWord)
      } else {
        vars.shuffledKeys.push(vocabWord)
      }
    } else {
      setTimeout(() => {
        tvElt.style.color = "#5294e2"
        vars.currentTValueValue = ""
        tvElt.innerText = "???"
      }, 500)
    }
  }
}
export { checkAnswer }
