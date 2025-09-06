// logic.js - logic for join menu
import { vars } from "../../scripts/vars.js"

async function handleJoinMenu(e) {
  if (vars.joinState == "lections") {
    if (e.key === "Backspace") {
      vars.currentLectionsValue = vars.currentLectionsValue.slice(0, -1);
    } else if (e.key === "Enter") {
      vars.joinState = null; // prevent any new input

      try {
        document.getElementById("joinstatus").innerText = "Processing lections...";
        document.getElementById("joinstatus").style.color = "#5294e2";

        // parse lections and join
        const joinedVocabulary = [];
        const processedIds = new Set();

        const lectionSpecs = vars.currentLectionsValue.split(",").map(spec => spec.trim()).filter(spec => spec.length > 0);

        for (const spec of lectionSpecs) {
          try {
            // parse single lection spec
            let lectionName, rangeSpec;

            // Check if has brackets
            const bracketMatch = spec.match(/^(.+?)\[(.+)\]$/);
            if (bracketMatch) {
              lectionName = bracketMatch[1].trim();
              rangeSpec = bracketMatch[2].trim();
            } else {
              lectionName = spec.trim();
              rangeSpec = null;
            }

            // get lection vocabulary 
            const allVocabulary = await new Promise((resolve, reject) => {
              const tx = vars.db.transaction(['vocabulary'], 'readonly');
              const store = tx.objectStore('vocabulary');
              const request = store.getAll();

              request.onsuccess = () => {
                const filtered = (request.result || []).filter(item => item.lection === lectionName);
                resolve(filtered);
              };

              request.onerror = () => {
                reject(new Error(`Failed to retrieve lection "${lectionName}"`));
              };
            });

            if (allVocabulary.length === 0) {
              throw new Error(`Lection "${lectionName}" not found or empty`);
            }

            // Sort by id
            allVocabulary.sort((a, b) => (a.id || 0) - (b.id || 0));

            let vocabularyItems = allVocabulary;

            // filter by range (if specified)
            if (rangeSpec) {
              if (rangeSpec.includes('-')) {
                // Range format: "1-14", "4-", "-4"
                const parts = rangeSpec.split('-');
                const startStr = parts[0].trim();
                const endStr = parts[1].trim();

                if (startStr === '' && endStr !== '') {
                  // Format: [-4] - from beginning to id 4
                  const endId = parseInt(endStr);
                  if (isNaN(endId)) {
                    throw new Error(`Invalid end range "${endStr}"`);
                  }
                  vocabularyItems = allVocabulary.filter(item => (item.id || 0) <= endId);

                } else if (startStr !== '' && endStr === '') {
                  // Format: [4-] - from id 4 to end
                  const startId = parseInt(startStr);
                  if (isNaN(startId)) {
                    throw new Error(`Invalid start range "${startStr}"`);
                  }
                  vocabularyItems = allVocabulary.filter(item => (item.id || 0) >= startId);

                } else if (startStr !== '' && endStr !== '') {
                  // Format: [1-14] - from id 1 to id 14
                  const startId = parseInt(startStr);
                  const endId = parseInt(endStr);
                  if (isNaN(startId) || isNaN(endId)) {
                    throw new Error(`Invalid range "${rangeSpec}"`);
                  }
                  if (startId > endId) {
                    throw new Error(`Start id ${startId} cannot be greater than end id ${endId}`);
                  }
                  vocabularyItems = allVocabulary.filter(item => {
                    const itemId = item.id || 0;
                    return itemId >= startId && itemId <= endId;
                  });

                } else {
                  throw new Error(`Invalid range format "${rangeSpec}"`);
                }

              } else {
                // Single id format: [4]
                const targetId = parseInt(rangeSpec);
                if (isNaN(targetId)) {
                  throw new Error(`Invalid id "${rangeSpec}"`);
                }
                vocabularyItems = allVocabulary.filter(item => (item.id || 0) === targetId);
              }
            }

            // Add items to joined vocabulary, avoiding duplicates
            for (const item of vocabularyItems) {
              const uniqueKey = `${item.vocabWord}-${item.value}`;
              if (!processedIds.has(uniqueKey)) {
                processedIds.add(uniqueKey);
                joinedVocabulary.push(item);
              }
            }

          } catch (error) {
            console.error(`Error processing lection spec "${spec}":`, error);
            throw new Error(`Failed to process "${spec}": ${error.message}`);
          }
        }

        if (joinedVocabulary.length > 0) {
          // generate unique lection name

          let baseName = "lection";
          let suffix = "j";
          let attemptName = baseName + suffix;

          // Keep adding 'j' until we find a unique name
          let foundUniqueName = false;
          while (!foundUniqueName) {
            const exists = await new Promise((resolve, reject) => {
              const tx = vars.db.transaction(['vocabulary'], 'readonly');
              const store = tx.objectStore('vocabulary');
              const request = store.getAll();

              request.onsuccess = () => {
                const hasLection = (request.result || []).some(item => item.lection === attemptName);
                resolve(hasLection);
              };

              request.onerror = () => {
                console.error(`Error checking if lection "${attemptName}" exists:`, request.error);
                reject(request.error);
              };
            });

            if (!exists) {
              foundUniqueName = true;
            } else {
              suffix += "j";
              attemptName = baseName + suffix;
            }
          }

          console.log(`Generated unique lection name: ${attemptName}`);
          const newLectionName = attemptName;

          // save joined lection
          // Get the next available ID for the new lection
          const nextId = await new Promise((resolve, reject) => {
            const tx = vars.db.transaction(['vocabulary'], 'readonly');
            const store = tx.objectStore('vocabulary');
            const request = store.getAll();

            request.onsuccess = () => {
              const allItems = request.result;
              let maxId = 0;
              for (const item of allItems) {
                if (item.id && item.id > maxId) {
                  maxId = item.id;
                }
              }
              resolve(maxId + 1);
            };

            request.onerror = () => {
              reject(new Error('Failed to get next vocabulary ID'));
            };
          });

          // Save each vocabulary item with the new lection name
          await new Promise((resolve, reject) => {
            const tx = vars.db.transaction(['vocabulary'], 'readwrite');
            const store = tx.objectStore('vocabulary');

            tx.onerror = (event) => {
              reject(new Error(`Transaction error: ${event.target.error}`));
            };

            for (let i = 0; i < joinedVocabulary.length; i++) {
              const item = { ...joinedVocabulary[i] };
              item.id = nextId + i;
              item.lection = newLectionName;
              // Reset stats for the new lection
              item.right = 0;
              item.wrong = 0;
              item.weight = 1;

              store.add(item);
            }

            tx.oncomplete = () => {
              console.log(`Successfully saved ${joinedVocabulary.length} items to lection "${newLectionName}"`);
              resolve();
            };
          });

          document.getElementById("joinstatus").innerText = `Successfully created lection "${newLectionName}" with ${joinedVocabulary.length} items!`;
          document.getElementById("joinstatus").style.color = "green";
        } else {
          document.getElementById("joinstatus").innerText = "No vocabulary items found to join";
          document.getElementById("joinstatus").style.color = "red";
        }

        // Reset
        vars.currentLectionsValue = "";
        vars.joinState = "lections";

      } catch (error) {
        document.getElementById("joinstatus").innerText = "Error: " + error.message;
        document.getElementById("joinstatus").style.color = "red";
        vars.joinState = "lections";
      }

    } else if (e.key.length === 1) {
      vars.currentLectionsValue += e.key;
    }
  }
  document.getElementById("lectionsj").innerText = vars.currentLectionsValue;
}

export { handleJoinMenu }
