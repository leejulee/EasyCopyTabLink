// Registering this listener when the script is first executed ensures that the
// offscreen document will be able to receive messages when the promise returned
// by `offscreen.createDocument()` resolves.
chrome.runtime.onMessage.addListener(handleMessages);

// This function performs basic filtering and error checking on messages before
// dispatching the
// message to a more specific message handler.
function handleMessages(message, _sender, sendResponse) {
  // Return early if this message isn't meant for the offscreen document.
  if (message.target !== "c") {
    sendResponse(false);
    return;
  }

  // Dispatch the message to an appropriate handler.
  switch (message.type) {
    case "copy-data-to-clipboard":
      handleClipboardWriteV2(message.data);
      break;
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`);
  }

  sendResponse(true);
}

let timeoutID;

// Job's done! Close the offscreen document.
function setCloseWindow() {
  let timeoutSec = 5 * 1000;

  clearTimeout(timeoutID);
  timeoutID = setTimeout(function () {
    window.close();
  }, timeoutSec);
}

function handleClipboardWriteV2(data) {    
  setCloseWindow();

  try {
    const regex = /href="([^"]+)">([^<]+)/;
    const match = data.match(regex);
    let plainContent = data;
    if (match) {
      const url = match[1]; // Get the URL
      const text = match[2]; // Get the text    
      plainContent = `${text} - ${url}`        
    }   

    let oncopyOriginal = document.oncopy;
    document.oncopy = function (event) {
      event.preventDefault();

      event.clipboardData.setData("text/html", data);
      event.clipboardData.setData("text/plain", plainContent);      
    };
    document.execCommand("copy");
    document.oncopy = oncopyOriginal;

  } finally {    
  }
}