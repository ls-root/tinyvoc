// readConfig.js ─ read from config store
import { vars } from "../../vars.js";

function readConfig(key) {
  return new Promise((resolve, reject) => {
    if (!vars.db) {
      return reject(new Error("Database not initialised"));
    }

    const tx = vars.db.transaction("config", "readonly");
    const store = tx.objectStore("config");
    const rq = store.get(key);

    rq.onsuccess = () =>
      resolve(rq.result?.value ?? null);
    rq.onerror = () =>
      reject(new Error(`IndexedDB read failed for key "${key}"`));
  });
}

export { readConfig };
