import { useEffect } from 'react';

export default function useHotKeyListeners({ refresh, change_page }) {
  useEffect(() => {
    const listener = e => {
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
