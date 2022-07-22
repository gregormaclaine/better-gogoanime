let send_message_to_injected_iframe;

(() => {
  const iframeEl = document.getElementById('injected-augmented-iframe');

  send_message_to_injected_iframe = (action, data) => {
    iframeEl.contentWindow?.postMessage({ action, data }, '*');
  };
})();
