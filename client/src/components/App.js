import { useEffect } from 'react';
import styled from 'styled-components';
import useAnimeItemsState from '../logic/useAnimeItemsState';
import useAnimePreferences from '../logic/useAnimePreferences';
import useHotKeyListeners from '../logic/useHotKeyListeners';
import useIFrameMessenging from '../logic/useIFrameMessenging';
import AnimeItem from './AnimeItem';
import RefreshItem from './RefreshItem';

const AnimeList = styled.div`
  width: 726px;
  padding: 20px 16px 0 16px;
  box-sizing: border-box;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

function App() {
  const { blacklist_item, unblacklist_item, is_anime_blacklisted } =
    useAnimePreferences();

  const {
    anime_to_show,
    fetch_status,
    change_page,
    set_show_blacklisted_anime,
    refresh,
    is_refreshing
  } = useAnimeItemsState({ is_anime_blacklisted });

  useIFrameMessenging({
    change_page,
    set_show_blacklisted_anime,
    refresh,
    is_anime_blacklisted
  });

  useHotKeyListeners({
    refresh,
    change_page
  });

  useEffect(() => {
    if (!window.parent) return;
    window.parent.postMessage(
      {
        action: 'set-height',
        height: document.querySelector('html').offsetHeight + 'px'
      },
      '*'
    );
  }, [anime_to_show]);

  return (
    <div>
      {fetch_status === 'error' && (
        <p style={{ color: 'red' }}>An error has occured</p>
      )}
      <AnimeList>
        <RefreshItem hidden={!is_refreshing} />
        {anime_to_show.map(item => (
          <AnimeItem
            {...item}
            key={item.urlpath}
            blacklist_item={blacklist_item}
            unblacklist_item={unblacklist_item}
            blacklisted={is_anime_blacklisted(item.name)}
          />
        ))}
      </AnimeList>
    </div>
  );
}

export default App;
