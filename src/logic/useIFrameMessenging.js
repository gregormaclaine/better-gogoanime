import { useEffect } from "react";

export default function useIFrameMessenging({ change_page, set_show_blacklisted_anime }) {

    // On message, change viewing page
    useEffect(() => {
        const message_handler = e => {
            if (typeof e.data === 'string' && e.data.startsWith('change-page-to-')) {
                const new_page = parseInt(e.data.split('change-page-to-')[1] || 0);
                if (new_page > 0) change_page(new_page);
            }
        }
    
        window.addEventListener("message", message_handler);
        return () => window.removeEventListener("message", message_handler);
    });

    // On request, return height of page
    useEffect(() => {
        const message_handler = e => {
            if (e.data === 'this-is-god-please-send-your-height') {
                const data = 'height-' + document.querySelector('html').offsetHeight + 'px';
                e.source.postMessage(data, e.origin);
            }
        }

        window.addEventListener('message', message_handler);
        return () => window.removeEventListener('message', message_handler);
    });

    // Toggle whether blacklisted anime are shown or not
    useEffect(() => {
        const message_handler = e => {
            if (typeof e.data === 'string' && e.data.startsWith('set-show-blacklisted:')) {
                const value = !!parseInt(e.data.split(':')[1]);
                set_show_blacklisted_anime(value);
            }
        }

        window.addEventListener('message', message_handler);
        return () => window.removeEventListener('message', message_handler);
    });

}
