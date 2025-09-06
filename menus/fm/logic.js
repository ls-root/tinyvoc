// logic.js - logic for figure menu
import { readAllLections } from "../../scripts/dbHelpers/read.js"
import { readGP } from "../../scripts/dbHelpers/generalPurpose/readGP.js"

async function handleFigureMenu() {
  const figuresEl = document.getElementById("figures");
  if (!figuresEl) return;

  figuresEl.innerHTML = "";

  const lections = await readAllLections();

  for (const item of lections) {
    const header = document.createElement("h3");
    header.innerText = item;
    header.style.marginTop = "20px";
    header.style.marginBottom = "15px";
    figuresEl.appendChild(header);

    let attempts = await readGP(item + "_attempt");
    let successes = await readGP(item + "_success");

    if (!Array.isArray(attempts)) attempts = [];
    if (!Array.isArray(successes)) successes = [];

    // Convert to numbers and filter out non-finite values
    const numericAttempts = attempts
      .map(v => typeof v === "number" ? v : Number(v))
      .filter(n => Number.isFinite(n));

    const numericSuccesses = successes
      .map(v => typeof v === "number" ? v : Number(v))
      .filter(n => Number.isFinite(n));

    const lastTwentyAttempts = numericAttempts.slice(-20);
    const lastTwentySuccesses = numericSuccesses.slice(-20);

    const chartsContainer = document.createElement("div");
    chartsContainer.style.display = "flex";
    chartsContainer.style.gap = "30px";
    chartsContainer.style.marginBottom = "20px";

    // Attempt Chart Container
    const attemptChartDiv = document.createElement("div");
    attemptChartDiv.style.flex = "1";

    if (lastTwentyAttempts.length > 0) {
      const attemptTitle = document.createElement("p");
      attemptTitle.innerText = "Average Attempts (Last 20 Sessions):";
      attemptTitle.style.fontWeight = "bold";
      attemptTitle.style.marginBottom = "5px";
      attemptChartDiv.appendChild(attemptTitle);

      const attemptChartText = asciichart.plot(lastTwentyAttempts, { height: 8 })
      const attemptChartLines = attemptChartText.split("\n");
      attemptChartLines.forEach(row => {
        const pr = document.createElement("p");
        pr.innerText = row;
        pr.style.fontFamily = "monospace";
        pr.style.fontSize = "12px";
        pr.style.margin = "0";
        pr.style.lineHeight = "1.2";
        attemptChartDiv.appendChild(pr);
      });

      const attemptSummary = document.createElement("p");
      attemptSummary.innerText = `Range: ${Math.min(...lastTwentyAttempts).toFixed(2)} - ${Math.max(...lastTwentyAttempts).toFixed(2)} attempts`;
      attemptSummary.style.fontSize = "11px";
      attemptSummary.style.color = "#666";
      attemptSummary.style.marginTop = "5px";
      attemptChartDiv.appendChild(attemptSummary);
    } else {
      const noAttemptData = document.createElement("p");
      noAttemptData.innerText = "Average Attempts (Last 5 Sessions):";
      noAttemptData.style.fontWeight = "bold";
      noAttemptData.style.marginBottom = "5px";
      attemptChartDiv.appendChild(noAttemptData);

      const noDataMsg = document.createElement("p");
      noDataMsg.innerText = "No attempt data available";
      noDataMsg.style.color = "gray";
      noDataMsg.style.fontStyle = "italic";
      attemptChartDiv.appendChild(noDataMsg);
    }

    // Success Chart Container
    const successChartDiv = document.createElement("div");
    successChartDiv.style.flex = "1";

    if (lastTwentySuccesses.length > 0) {
      const successTitle = document.createElement("p");
      successTitle.innerText = "Success Rate % (Last 20 Sessions):";
      successTitle.style.fontWeight = "bold";
      successTitle.style.marginBottom = "5px";
      successChartDiv.appendChild(successTitle);

      const successChartText = asciichart.plot(lastTwentySuccesses, { height: 8 });
      const successChartLines = successChartText.split("\n");
      successChartLines.forEach(row => {
        const pr = document.createElement("p");
        pr.innerText = row;
        pr.style.fontFamily = "monospace";
        pr.style.fontSize = "12px";
        pr.style.margin = "0";
        pr.style.lineHeight = "1.2";
        successChartDiv.appendChild(pr);
      });

      const successSummary = document.createElement("p");
      successSummary.innerText = `Range: ${Math.min(...lastTwentySuccesses)}% - ${Math.max(...lastTwentySuccesses)}%`;
      successSummary.style.fontSize = "11px";
      successSummary.style.color = "#666";
      successSummary.style.marginTop = "5px";
      successChartDiv.appendChild(successSummary);
    } else {
      const noSuccessData = document.createElement("p");
      noSuccessData.innerText = "Success Rate % (Last 5 Sessions):";
      noSuccessData.style.fontWeight = "bold";
      noSuccessData.style.marginBottom = "5px";
      successChartDiv.appendChild(noSuccessData);

      const noDataMsg = document.createElement("p");
      noDataMsg.innerText = "No success data available";
      noDataMsg.style.color = "gray";
      noDataMsg.style.fontStyle = "italic";
      successChartDiv.appendChild(noDataMsg);
    }

    chartsContainer.appendChild(attemptChartDiv);
    chartsContainer.appendChild(successChartDiv);
    figuresEl.appendChild(chartsContainer);

    const separator = document.createElement("hr");
    separator.style.margin = "25px 0";
    separator.style.border = "none";
    separator.style.borderTop = "1px solid #ccc";
    figuresEl.appendChild(separator);
  }
}
export { handleFigureMenu }
