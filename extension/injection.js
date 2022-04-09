(() => {
    const container = document.querySelector('div.last_episodes');
    container.style.padding = '0px';
    container.querySelector('ul.items').style.display = 'none';

    const iframeEl = document.createElement('iframe');
    container.appendChild(iframeEl);

    iframeEl.src = 'http://localhost:3000';
    iframeEl.sandbox = 'allow-scripts';

    iframeEl.style.width = '726px';
    iframeEl.style.borderWidth = '0px';
    iframeEl.style.overflow = 'hidden';

    window.addEventListener('message', e => {
        if (typeof e.data === 'string' && e.data.startsWith('height-')) {
            iframeEl.style.height = e.data.split('height-')[1];
        }
    });

    iframeEl.addEventListener('load', () => {    
        setInterval(() => {
            iframeEl.contentWindow?.postMessage('this-is-god-please-send-your-height', '*');
        }, 500);
    });

    // Change pagination
    const pagelistEl = document.querySelector('ul.pagination-list');
    pagelistEl.style.display = 'none';

    const new_pagination = document.createElement('div');
    document.querySelector('div.anime_name.recent_release').appendChild(new_pagination);
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
            iframeEl.contentWindow?.postMessage('change-page-to-' + i, '*');

            if (current_selected) current_selected.classList.remove('selected');
            spanEl.classList.add('selected');
            current_selected = spanEl;
        });
    }
})()