import { useState, useEffect } from 'react';

import useAnimeItems from './useAnimeItems';

export default function useAnimeState({
  is_anime_blacklisted
}: {
  is_anime_blacklisted: Function;
}) {
  const { items, fetching, error, refresh, fetch_more } = useAnimeItems();

  const [current_page, change_page] = useState(1);
  const [show_blacklisted_anime, set_show_blacklisted_anime] = useState(false);

  const filtered_anime = show_blacklisted_anime
    ? items
    : items.filter(a => !is_anime_blacklisted(a.name));
  const anime_to_show = filtered_anime.slice(
    20 * (current_page - 1),
    20 * current_page
  );

  // If there is not enough anime to show, get the next lot
  useEffect(() => {
    if (anime_to_show.length < 20 && !fetching) {
      fetch_more();
    }
  }, [anime_to_show.length, fetching, fetch_more]);

  return {
    change_page,
    set_show_blacklisted_anime,
    refresh,
    is_refreshing: fetching,
    anime_to_show: fetching ? anime_to_show.slice(0, 19) : anime_to_show,
    error
  };
}
