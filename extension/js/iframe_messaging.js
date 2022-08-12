const DEBUG = true;

let send_message_to_injected_iframe;

(() => {
  const iframeEl = document.getElementById('injected-augmented-iframe');

  send_message_to_injected_iframe = (action, data, on_reply) => {
    if (on_reply) {
      const listener = window.addEventListener('message', ({ data }) => {
        if (data.action === action + '-reply') {
          const { action, ...values } = data;
          on_reply(values);
          window.removeEventListener('message', listener);
        }
      });
    }

    iframeEl.contentWindow?.postMessage({ action, data }, '*');
  };

  if (DEBUG) {
    window.addEventListener('message', ({ data }) => {
      if (DEBUG && data.action) {
        const { action, ...values } = data;
        console.log(`Message '${action}':`, values);
      }
    });
  }
})();
