(() => {
  const container = document.querySelector('div.last_episodes');
  container.style.padding = '0px';
  container.querySelector('ul.items').style.display = 'none';

  const iframeEl = document.createElement('iframe');
  container.appendChild(iframeEl);
  iframeEl.id = 'injected-augmented-iframe';

  iframeEl.style.width = '726px';
  iframeEl.style.minHeight = '300px';
  iframeEl.style.borderWidth = '0px';
  iframeEl.style.overflow = 'hidden';

  window.addEventListener('message', e => {
    if (e.data.action === 'set-height') iframeEl.style.height = e.data.height;
  });

  chrome.runtime.sendMessage({ action: 'is-developer-mode' }, dev_mode => {
    iframeEl.src = dev_mode
      ? 'http://localhost:3000'
      : 'https://better-gogoanime-injection.netlify.app/';
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'please-reload') window.location.reload();
  });
})();
