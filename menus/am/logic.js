// logic.js - logic for add menu 
import { vars } from "../../scripts/vars.js"
import { writeData } from "../../scripts/dbHelpers/writeData.js"
import { createInputHandler } from "../../scripts/inputHandler.js"

const handleAddMenu = createInputHandler({
  getCurrentState: () => vars.addstate,

  getCurrentValue: (state) => {
    switch (state) {
      case "lection": return vars.currentLectionValue;
      case "key": return vars.currentKeyValue;
      case "value": return vars.currentValueValue;
      default: return "";
    }
  },

  setCurrentValue: (state, value) => {
    switch (state) {
      case "lection": vars.currentLectionValue = value; break;
      case "key": vars.currentKeyValue = value; break;
      case "value": vars.currentValueValue = value; break;
    }
  },

  getElement: (state) => {
    switch (state) {
      case "lection": return document.getElementById("lection");
      case "key": return document.getElementById("key");
      case "value": return document.getElementById("valuevalue");
      default: return null;
    }
  },

  onEnter: (state, value, element) => {
    switch (state) {
      case "lection":
        if (value.endsWith("/")) {
          element.style.color = vars.redColor
        } else {
          vars.addstate = "key";
          document.getElementById("lection").style.color = "white";
          document.getElementById("lectiont").style.color = "white";
          return { preventDefault: true };
        }
        break;

      case "key":
        vars.addstate = "value";
        document.getElementById("key").style.color = "white";
        document.getElementById("value").style.display = "block";
        return { preventDefault: true };

      case "value":
        writeData(vars.currentKeyValue, vars.currentValueValue, vars.currentLectionValue);
        vars.currentKeyValue = "";
        vars.currentValueValue = "";
        vars.addstate = "key";
        document.getElementById("key").innerText = "";
        document.getElementById("key").style.color = vars.themeColor
        document.getElementById("value").style.display = "none";
        document.getElementById("valuevalue").innerText = "";
        return { preventDefault: true };
    }
  },

  updateDisplay: (_, value, element) => {
    if (element) element.innerText = value;
  }
});

export { handleAddMenu };
