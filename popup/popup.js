let presetPromptInput = document.getElementById("template-prompt");
let saveButton = document.getElementById("save-btn");

// Set placeholder text to current prompt preset
chrome.storage.local.get("prompt", ({ prompt }) => {
    if (prompt) {
        presetPromptInput.placeholder = prompt;
    }
});

saveButton.addEventListener("click", () => {
    // Update prompt preset variable, store it locally, and share it with background.js
    let presetPrompt = presetPromptInput.value;
    chrome.storage.local.set({ "prompt": presetPrompt });
    chrome.runtime.sendMessage({ type: "updatePrompt", prompt: presetPrompt });

    // Update HTML attributes accordingly
    presetPromptInput.placeholder = presetPrompt;
    presetPromptInput.value = '';
    presetPromptInput.focus();
});

// Simulate clicking the "Save Changes" button on "Enter" key press
presetPromptInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        saveButton.click();
    }
});