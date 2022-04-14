import styled from 'styled-components';
import AnimeItem from './AnimeItem';
import RefreshItem from './RefreshItem';
import useIFrameMessenging from '../logic/useIFrameMessenging';
import useAnimePreferences from '../logic/useAnimePreferences';
import useAnimeItemsState from '../logic/useAnimeItemsState';

const AnimeList = styled.div`
  width: 726px;
  padding: 20px 16px 0 16px;
  box-sizing: border-box;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

function App() {
  const { blacklist_item, unblacklist_item, is_anime_blacklisted } = useAnimePreferences();

  const { anime_to_show, change_page, set_show_blacklisted_anime, refresh, is_refreshing } = useAnimeItemsState({ is_anime_blacklisted });

  useIFrameMessenging({ change_page, set_show_blacklisted_anime, refresh });

  return (
    <div>
      <AnimeList>
        {is_refreshing && <RefreshItem />}
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