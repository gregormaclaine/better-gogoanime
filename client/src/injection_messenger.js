export default function init_messaging() {
    window.addEventListener('message', e => {
        if (e.data === 'this-is-god-please-send-your-height') {
            const data = 'height-' + document.querySelector('html').offsetHeight + 'px';
            e.source.postMessage(data, e.origin);
        }
    });
}
