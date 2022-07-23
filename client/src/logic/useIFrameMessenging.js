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

  useIFrameMessage('get-blacklist-info', (list, reply) =>
    reply({
      action: 'get-blacklist-info-reply',
      info: list.reduce(
        (acc, cur) => ({ ...acc, [cur]: is_anime_blacklisted(cur) }),
        {}
      )
    })
  );
}
