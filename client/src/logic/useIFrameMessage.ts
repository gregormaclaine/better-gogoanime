import { useEffect } from 'react';

export default function useIFrameMessage(action: string, func: Function) {
  useEffect(() => {
    const message_handler = (e: MessageEvent) => {
      const reply = (msg: string) =>
        e.source?.postMessage(msg, e.origin as any);
      if (e.data.action === action) func(e.data.data, reply);
    };

    window.addEventListener('message', message_handler);
    return () => window.removeEventListener('message', message_handler);
  });
}
