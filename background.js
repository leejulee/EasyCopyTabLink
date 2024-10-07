// When the browser action is clicked, `addToClipboard()` will use an offscreen
// document to write the value of `textToCopy` to the system clipboard.
chrome.action.onClicked.addListener(async () => {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      let activeTab = tabs[0];
      let tabUrl = activeTab.url;
      let tabTitle = activeTab.title;
      const link = `<a href="${tabUrl}">${tabTitle}</a>`      
      await addToClipboard(link);
    }
  );
});

async function addToClipboard(value) {
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: "Write text to the clipboard.",
  });

  // Now that we have an offscreen document, we can dispatch the
  // message.
  chrome.runtime.sendMessage({
    type: "copy-data-to-clipboard",
    target: "c",
    data: value
  },(response)=>{
    if(response){
        chrome.action.setIcon({ path: 'images/coding-done-16.png' });
        setTimeout(() => {
            chrome.action.setIcon({ path: "images/coding16.png" });
          }, 500);
    }
  });
}
