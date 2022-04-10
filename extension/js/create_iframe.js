(() => {
    const container = document.querySelector('div.last_episodes');
    container.style.padding = '0px';
    container.querySelector('ul.items').style.display = 'none';

    const iframeEl = document.createElement('iframe');
    container.appendChild(iframeEl);
    iframeEl.id = 'injected-augmented-iframe';

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
})();
