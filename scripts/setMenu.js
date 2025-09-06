// setMenu.js - set current menu for bar
function setMenu(long, docpage) {
  document.getElementById("barp1").innerText = long
  if (docpage) {
    document.getElementById("barp15").innerHTML = "<strong id='bardoc'></strong>"
    document.getElementById("bardoc").innerText = docpage
  } else {
    document.getElementById("barp15").innerHTML = "<strong id='bardoc'>Error</strong> No Docs"
  }
}
export { setMenu }
