// generateSpecialList.js - generate list with special rules
async function GenerateSpecialList(
  sourceLection,
  minFieldValue,
  maxEntries,
  fieldName,
  outputLection,
) {
  const data = await readLectionData(sourceLection)

  const result = data
    .filter((item) => (item[fieldName] || 0) >= minFieldValue)
    .sort((a, b) => (b[fieldName] || 0) - (a[fieldName] || 0))
    .slice(0, maxEntries)

  const tx = db.transaction("vocabulary", "readwrite")
  const store = tx.objectStore("vocabulary")

  result.forEach((item) => {
    const newVocabWord = item.vocabWord + uniqueKeyChar
    store.put({
      vocabWord: newVocabWord,
      value: item.value,
      lection: outputLection,
      weight: item.weight || 1,
      wrong: 0,
      right: 0,
    })
  })

  return result
}
