import { useEffect } from 'react';

export default function useIFrameMessage(action, func) {
  useEffect(() => {
    const message_handler = e => {
      const reply = msg => e.source.postMessage(msg, e.origin);
      if (e.data.action === action) func(e.data.data, reply);
    };

    window.addEventListener('message', message_handler);
    return () => window.removeEventListener('message', message_handler);
  });
}
