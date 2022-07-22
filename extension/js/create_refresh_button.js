(() => {
  const iframeEl = document.getElementById('injected-augmented-iframe');

  const containerEl = document.querySelector('div.anime_name.recent_release');
  const divEl = document.createElement('div');
  containerEl.appendChild(divEl);

  divEl.classList.add('injected-refresh-button');
  divEl.innerText = 'Refresh';

  function onClick() {
    send_message_to_injected_iframe('refresh');
  }

  divEl.addEventListener('click', onClick);
})();
