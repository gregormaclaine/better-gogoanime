(() => {
    const container = document.querySelector('div.last_episodes');
    container.style.padding = '0px';
    container.querySelector('ul.items').style.display = 'none';

    const iframeEl = document.createElement('iframe');
    container.appendChild(iframeEl);
    iframeEl.id = 'injected-augmented-iframe';

    iframeEl.src = 'https://better-gogoanime-injection.netlify.app/' || 'http://localhost:3000';
    iframeEl.sandbox = 'allow-scripts';

    iframeEl.style.width = '726px';
    iframeEl.style.minHeight = '300px';
    iframeEl.style.borderWidth = '0px';
    iframeEl.style.overflow = 'hidden';

    window.addEventListener('message', e => {
        if (e.data.action === 'set-height') iframeEl.style.height = e.data.height;
    });
})();
