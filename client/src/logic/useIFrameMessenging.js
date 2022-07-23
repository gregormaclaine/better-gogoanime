import useIFrameMessage from './useIFrameMessage';

export default function useIFrameMessenging({
  change_page,
  set_show_blacklisted_anime,
  refresh,
  is_anime_blacklisted
}) {
  useIFrameMessage('change-page', page => change_page(page));

  useIFrameMessage('toggle-blacklist', val => set_show_blacklisted_anime(val));

  useIFrameMessage('refresh', refresh);

  useIFrameMessage('filter-show-names', (list, reply) =>
    reply(list.map(is_anime_blacklisted))
  );
}
