// nextQuestion.js - genrates new question for training mode
import { vars } from "../../scripts/vars.js"
import { mkbanner, mkBannerProgress } from "../../scripts/sharedHelpers/banner.js"
import { writeGP } from "../../scripts/dbHelpers/generalPurpose/writeGP.js"
import { readGP } from "../../scripts/dbHelpers/generalPurpose/readGP.js"
import { readLectionData } from "../../scripts/dbHelpers/read.js"

async function nextQuestion() {
  if (!vars.shuffledKeys.length) {
    document.getElementById("trainfooter").innerText = mkbanner(
      "Finished!",
      45,
      "-",
    )

    const lectionData = await readLectionData(vars.selectedLection || vars.currentLectionValue);
    let totalWrong = 0;
    let totalRight = 0;

    lectionData.forEach(word => {
      const right = word.right || 0;
      const wrong = word.wrong || 0;
      totalRight += right;
      totalWrong += wrong;
    });

    vars.trainstate = "finished"
    const attemptsArray = Array.from(vars.sessionAttempts.values());
    const totalAttempts = attemptsArray.reduce((a, b) => a + b, 0);
    const totalVocabulary = vars.dataToTrain.length;

    const avgAttempt = totalVocabulary > 0 ? (totalAttempts / totalVocabulary).toFixed(2) : "0.00"
    const successScore = Math.round(vars.currentSessionScore / totalVocabulary * 100)

    document.getElementById("tkey").innerText = ""
    document.getElementById("tvalue").innerText = ""

    document.getElementById("stats").style.display = "block"
    document.getElementById("nstats").style.display = "none"

    document.getElementById("s1").innerText = vars.trainStats.totalCorrect
    document.getElementById("s2").innerText = vars.trainStats.totalWrong
    document.getElementById("s3").innerText = vars.trainStats.hardestWord.key
    document.getElementById("s4").innerText = vars.trainStats.hardestWord.attempts
    document.getElementById("s5").innerText = avgAttempt
    document.getElementById("s6").innerText = successScore

    {
      writeGP(vars.currentLectionValue + "_success_last", successScore)
      const key = vars.currentLectionValue + "_success"
      let history = await readGP(key)
      if (!Array.isArray(history)) history = []
      history.push(successScore)
      await writeGP(key, history)
    }

    {
      writeGP(vars.currentLectionValue + "_attempt_last", avgAttempt)

      const key = vars.currentLectionValue + "_attempt";
      let history = await readGP(key);
      if (!Array.isArray(history)) history = [];
      history.push(avgAttempt);
      await writeGP(key, history);
    }

    return
  }
  const vocabWord = vars.shuffledKeys[vars.shuffledKeys.length - 1]
  vars.currentKey = vocabWord
  vars.currentTValueValue = ""

  const tx = vars.db.transaction("vocabulary", "readonly")
  const store = tx.objectStore("vocabulary")
  const index = store.index("vocabWord")
  const rq = index.get(vocabWord)
  rq.onsuccess = () => {
    const data = rq.result
    const wrong = data?.wrong || 0
    const right = data?.right || 0
    document.getElementById("tkey").innerText =
      `${vocabWord} (${wrong},${right})`
  }

  document.getElementById("tvalue").innerText = "???"
  const done = vars.dataToTrain.length - vars.shuffledKeys.length
  document.getElementById("trainfooter").innerText = mkBannerProgress(`${done}/${vars.dataToTrain.length}`, 45, "-", "=", Math.round((done / vars.dataToTrain.length) * 45))
}

export { nextQuestion }
