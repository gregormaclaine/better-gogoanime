(() => {
  const iframeEl = document.getElementById('injected-augmented-iframe');
  const pagelistEl = document.querySelector('ul.pagination-list');
  pagelistEl.style.display = 'none';

  const new_pagination = document.createElement('div');
  document
    .querySelector('div.anime_name.recent_release')
    .appendChild(new_pagination);
  new_pagination.classList.add('injected-pagination-wrapper');

  let current_page = 1;
  const page_buttons = {};

  function select_page(page) {
    send_message_to_injected_iframe('change-page', page);
    if (current_page) page_buttons[current_page].classList.remove('selected');
    page_buttons[page].classList.add('selected');
    current_page = page;
  }

  for (let i = 1; i < 6; i++) {
    page_buttons[i] = document.createElement('span');
    new_pagination.appendChild(page_buttons[i]);
    page_buttons[i].innerText = '' + i;

    page_buttons[i].addEventListener('click', e => {
      select_page(i);
    });
  }

  page_buttons[1].classList.add('selected');

  window.addEventListener('keydown', e => {
    switch (e.key) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        return select_page(parseInt(e.key));
      default:
        return;
    }
  });
})();
