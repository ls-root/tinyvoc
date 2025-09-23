// inputHandler.js - Reusable input handling logic
function createInputHandler(config) {
  return async function(e) {
    const {
      getCurrentState,
      getCurrentValue,
      setCurrentValue,
      getElement,
      onBackspace,
      onEnter,
      onCharacter,
      updateDisplay
    } = config;

    const currentState = getCurrentState();
    const currentValue = getCurrentValue(currentState);
    const element = getElement(currentState);

    if (e.key === "Backspace") {
      const newValue = currentValue.slice(0, -1);
      setCurrentValue(currentState, newValue);
      if (onBackspace) onBackspace(currentState, newValue, element);
    }
    else if (e.key === "Enter") {
      if (onEnter) {
        const result = onEnter(currentState, currentValue, element, e);
        if (result && result.preventDefault) e.preventDefault();
      }
    }
    else if (e.key.length === 1) {
      const newValue = currentValue + e.key;
      setCurrentValue(currentState, newValue);
      if (onCharacter) onCharacter(currentState, newValue, element);
    }

    if (updateDisplay) updateDisplay(currentState, getCurrentValue(currentState), element);
  };
}
export { createInputHandler }
