(() => {
  const sidebarListEl = document.querySelector('nav.menu_series.cron > ul');

  const names = [...sidebarListEl.children].map(
    liEl => liEl.children[0].innerText
  );

  let updated = false;
  let update_interval = null;

  function update_sidebar({ info }) {
    if (updated) return;
    updated = true;
    clearInterval(update_interval);

    [...sidebarListEl.children].forEach(liEl => {
      const val = liEl.children[0].innerText;
      if (info[val]) {
        // liEl.style.display = 'none';
        liEl.remove();
      }
    });
  }

  update_interval = setInterval(() => {
    send_message_to_injected_iframe(
      'get-blacklist-info',
      names,
      update_sidebar
    );
  }, 40);
})();
