chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'is-developer-mode':
      chrome.storage.local.get('dev_mode', ({ dev_mode }) =>
        sendResponse(dev_mode)
      );
      return true;
    case 'set-developer-mode':
      chrome.storage.local.set({ dev_mode: !!request.value });
      return;
    default:
      return;
  }
});
