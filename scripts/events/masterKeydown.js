// masterKeydown.js - master key handler
import { vars } from "../vars.js"

import { showAddMenu, hideAddMenu } from "../../menus/am/display.js"
import { showBroadcastMenu, hideBroadcastMenu } from "../../menus/bm/display.js"
import { showCorrectMenu, hideCorrectMenu } from "../../menus/cm/display.js"
import { showDocsMenu, hideDocsMenu } from "../../menus/dm/display.js"
import { showFigureMenu, hideFigureMenu } from "../../menus/fm/display.js"
import { showGenerateMenu, hideGenerateMenu } from "../../menus/gm/display.js"
import { showJoinMenu, hideJoinMenu } from "../../menus/jm/display.js"
import { showLectionsMenu, hideLectionsMenu } from "../../menus/lm/display.js"
import { showMainMenu, hideMainMenu } from "../../menus/mm/display.js"
import { showMoveMenu, hideMoveMenu } from "../../menus/mvm/display.js"
import { showGitMenu, hideGitMenu } from "../../menus/nm/display.js"
import { showStatusMenu, hideStatusMenu } from "../../menus/sm/display.js"
import { showTrainMenu, hideTrainMenu } from "../../menus/tm/display.js"
import { showViewMenu, hideViewMenu } from "../../menus/vm/display.js"

import { handleAddMenu } from "../../menus/am/logic.js"
import { handleBroadcastMenu } from "../../menus/bm/logic.js"
import { handleCorrectMenu } from "../../menus/cm/logic.js"
import { handleDocsMenu } from "../../menus/dm/logic.js"
import { handleGenerateMenu } from "../../menus/gm/logic.js"
import { handleJoinMenu } from "../../menus/jm/logic.js"
import { handleMoveMenu } from "../../menus/mvm/logic.js"
import { handleGitMenu } from "../../menus/nm/logic.js"
import { handleStatusMenu } from "../../menus/sm/logic.js"
import { handleTrainMenu } from "../../menus/tm/logic.js"
import { handleViewMenu } from "../../menus/vm/logic.js"

import { download } from "../sharedHelpers/download.js"
import { getFile } from "../sharedHelpers/getFile.js"
import { readAllData } from "../dbHelpers/read.js"

function masterKeydown() {
  document.addEventListener("keydown", async (e) => {
    // Prevent firefox from starting Quick Search with /
    if (e.key === "/") {
      e.preventDefault()
    }

    const sel = document.getElementById("selection")
    sel.innerText = e.key
    sel.style.color = [
      "a", "t", "A", "T", "e", "E", "i", "I", "v", "V", "g", "G", "m", "M", "l", "L", "c", "C", "n", "N", "s", "S", "p", "P", "j", "J", "b", "B", "f", "F", "-", "Enter",
    ].includes(e.key) ? "#5294e2" : "#ea4f4f"

    // MAIN MENU
    if (vars.menu === "mm") {
      if (e.key === "a" || e.key === "A") {
        showAddMenu(); return
      } else if (e.key === "t" || e.key === "T") {
        showTrainMenu(); return
      } else if (e.key === "e" || e.key === "E") {
        download(JSON.stringify(await readAllData())); return
      } else if (e.key === "i" || e.key === "I") {
        getFile(); return
      } else if (e.key === "v" || e.key === "V") {
        showViewMenu(); return
      } else if (e.key === "g" || e.key === "G") {
        showGenerateMenu(); return
      } else if (e.key === "m" || e.key === "M") {
        showMoveMenu(); return
      } else if (e.key === "l" || e.key === "L") {
        showLectionsMenu(); return
      } else if (e.key === "c" || e.key === "C") {
        showCorrectMenu(); return
      } else if (e.key === "n" || e.key === "N") {
        showGitMenu(); return
      } else if (e.key === "s" || e.key === "S") {
        showStatusMenu(); return
      } else if (e.key === "j" || e.key === "J") {
        showJoinMenu(); return
      } else if (e.key === "b" || e.key === "B") {
        showBroadcastMenu(); return
      } else if (e.key === "d" || e.key === "D") {
        showDocsMenu(); return
      } else if (e.key === "f" || e.key === "F") {
        showFigureMenu(); return
      }
    }
    // BACK TO MAIN
    if (e.key === "-") {
      const isInInputState = (
        (vars.menu === "jm" && vars.joinState === "lections") ||
        (vars.menu === "nm" && vars.gitState === "textField") ||
        (vars.menu === "bm" && (vars.broadcastState === "lections" || vars.broadcastState === "peerid" || vars.broadcastState === "send_lections"))
      )

      if (!isInInputState) {
        hideJoinMenu()
        hideAddMenu()
        hideTrainMenu()
        hideDocsMenu()
        hideViewMenu()
        hideGenerateMenu()
        hideMoveMenu()
        hideLectionsMenu()
        hideBroadcastMenu()
        hideCorrectMenu()
        showMainMenu()
        hideFigureMenu()
        hideGitMenu()
        hideStatusMenu()
        sel.innerText = ""
      }
    }
    // ADD MENU
    if (vars.menu === "am") handleAddMenu(e)

    // TRAIN MENU
    if (vars.menu === "tm") await handleTrainMenu(e)

    // VIEW MENU
    if (vars.menu === "vm") await handleViewMenu(e)

    // GENERATE MENU
    if (vars.menu === "gm") handleGenerateMenu(e)

    // MOVE MENU
    if (vars.menu === "mvm") handleMoveMenu(e)

    // CORRECT MENU
    if (vars.menu === "cm") handleCorrectMenu(e)

    // GIT STATUS MENU
    if (vars.menu === "sm") handleStatusMenu()

    // GIT MENU
    if (vars.menu === "nm") handleGitMenu(e)

    // JOIN MENU
    if (vars.menu === "jm") handleJoinMenu(e)

    // BROADCAST MENU
    if (vars.menu === "bm") handleBroadcastMenu(e)

    // DOCS MENU
    if (vars.menu === "dm") handleDocsMenu(e)
  })
}

export { masterKeydown }
