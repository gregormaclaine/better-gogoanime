import { useInfiniteQuery } from 'react-query';
import get_anime_items from './get_anime_content';

export default function useAnimeItems() {
  const {
    data,
    error,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery(
    'anime-items',
    ({ pageParam = 1 }) => get_anime_items(pageParam),
    {
      getNextPageParam: (lastPage, pages) => lastPage.num + 1
    }
  );

  return {
    items: data ? data.pages.map(p => p.items).flat() : [],
    fetching: isFetching || isFetchingNextPage,
    error,
    refresh: refetch,
    fetch_more: fetchNextPage
  };
}
