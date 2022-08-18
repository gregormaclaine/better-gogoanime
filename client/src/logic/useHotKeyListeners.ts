import { useEffect } from 'react';

interface InputType {
  refresh: Function;
  change_page: Function;
}

export default function useHotKeyListeners({
  refresh,
  change_page
}: InputType) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      // Don't handle hotkeys if shown through iframe
      if (window.self !== window.top) return;

      switch (e.key) {
        case 'r':
          return refresh();

        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          return change_page(parseInt(e.key));

        default:
          return;
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [refresh, change_page]);
}
