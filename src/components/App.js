import styled from 'styled-components';
import AnimeItem from './AnimeItem';
import useIFrameMessenging from '../logic/useIFrameMessenging';
import useAnimePreferences from '../logic/useAnimePreferences';
import useAnimeItemsState from '../logic/useAnimeItemsState';

const AnimeList = styled.ul`
  width: 726px;
  list-style-type: none;
  padding: 0 16px 20px 16px;
  height: 1552.5px;
  box-sizing: border-box;
`;

function App() {
  const { blacklist_item, unblacklist_item, is_anime_blacklisted } = useAnimePreferences();

  const { anime_to_show, change_page, set_show_blacklisted_anime } = useAnimeItemsState({ is_anime_blacklisted });

  useIFrameMessenging({ change_page, set_show_blacklisted_anime });

  return (
    <div>
      <AnimeList>
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
