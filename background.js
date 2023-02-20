let prompt = "Format this code and explain what it does"; // Default preset

chrome.contextMenus.create({
    title: 'Ask ChatGPT about "%s"',
    id: 'highlightGPT',
    contexts: ['selection'],
});

// Get the prompt preset from popup.js
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "updatePrompt") {
        prompt = message.prompt;
        // Store the prompt preset in the storage API
        chrome.storage.sync.set({ prompt: prompt });
    }
});

// Load the prompt preset from storage when the background script starts
chrome.storage.sync.get({ prompt: prompt }, function (items) {
    prompt = items.prompt;
});

// Find and populate ChatGPT's prompt textbox and simulate "Enter" key press
function injectedFunction(selectedText, prompt) {
    const textarea = document.querySelector('textarea');
    textarea.innerText = `${selectedText}
    ${prompt}`;
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    textarea.dispatchEvent(enterEvent);
}

// Open ChatGPT in new tab and inject function when the context menu item is clicked
chrome.contextMenus.onClicked.addListener(function (info) {
    if (info.menuItemId === "highlightGPT") {
        const selectedText = info.selectionText;
        chrome.tabs.create({ url: 'https://chat.openai.com/chat' }, function (newTab) {
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === newTab.id && changeInfo.status === 'complete') {
                    chrome.scripting.executeScript({
                        target: { tabId: newTab.id },
                        func: injectedFunction,
                        args: [selectedText, prompt],
                    });
                }
            });
        });
    }
});