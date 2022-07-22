(() => {
  const iframeEl = document.getElementById('injected-augmented-iframe');

  const pagelistEl = document.querySelector('ul.pagination-list');
  pagelistEl.style.display = 'none';

  const new_pagination = document.createElement('div');
  document
    .querySelector('div.anime_name.recent_release')
    .appendChild(new_pagination);
  new_pagination.classList.add('injected-pagination-wrapper');

  let current_selected;

  for (let i = 1; i < 6; i++) {
    const spanEl = document.createElement('span');
    new_pagination.appendChild(spanEl);
    spanEl.innerText = '' + i;

    if (i === 1) {
      spanEl.classList.add('selected');
      current_selected = spanEl;
    }

    spanEl.addEventListener('click', e => {
      send_message_to_injected_iframe('change-page', i);

      if (current_selected) current_selected.classList.remove('selected');
      spanEl.classList.add('selected');
      current_selected = spanEl;
    });
  }
})();
