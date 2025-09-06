// addToView.js - adds elements to view table
function addToView(id, key, value, lection, right, wrong) {
  const viewElement = document.getElementById("viewElement")
  const tr = document.createElement("tr")
  const tdId = document.createElement("td")
  const tdKey = document.createElement("td")
  const tdValue = document.createElement("td")
  const tdWrong = document.createElement("td")
  const tdRight = document.createElement("td")
  const tdLection = document.createElement("td")

  tdId.innerText = id
  tdKey.innerText = key
  tdValue.innerText = value
  tdLection.innerText = lection
  tdWrong.innerText = wrong
  tdRight.innerText = right

  tr.appendChild(tdId) // ID as first column
  tr.appendChild(tdKey)
  tr.appendChild(tdValue)
  tr.appendChild(tdLection)
  tr.appendChild(tdWrong)
  tr.appendChild(tdRight)

  viewElement.appendChild(tr)
}
export { addToView }
