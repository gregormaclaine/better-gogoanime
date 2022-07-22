(() => {
  const iframeEl = document.getElementById('injected-augmented-iframe');

  const containerEl = document.querySelector('div.anime_name.recent_release');
  const divEl = document.createElement('div');
  containerEl.appendChild(divEl);

  divEl.classList.add('injected-blacklist-toggle');
  divEl.innerText = 'Extension Active';

  let are_blacklisted_showing = false;

  function toggle() {
    are_blacklisted_showing = !are_blacklisted_showing;
    if (are_blacklisted_showing) {
      divEl.innerText = 'Extension Inactive';
      divEl.classList.add('show-blacklisted');
    } else {
      divEl.innerText = 'Extension Active';
      divEl.classList.remove('show-blacklisted');
    }

    send_message_to_injected_iframe(
      'toggle-blacklist',
      are_blacklisted_showing
    );
  }

  divEl.addEventListener('click', toggle);
})();
