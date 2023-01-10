import useIFrameMessage from './useIFrameMessage';

export default function useIFrameMessenging({
  change_page,
  set_show_blacklisted_anime,
  refresh,
  is_anime_blacklisted
}: {
  change_page: Function;
  set_show_blacklisted_anime: Function;
  refresh: Function;
  is_anime_blacklisted: (val: string) => boolean;
}) {
  useIFrameMessage('change-page', (page: number) => change_page(page));

  useIFrameMessage('toggle-blacklist', (val: boolean) =>
    set_show_blacklisted_anime(val)
  );

  useIFrameMessage('refresh', refresh);

  useIFrameMessage('get-blacklist-info', (list: string[], reply: Function) =>
    reply({
      action: 'get-blacklist-info-reply',
      info: list.reduce(
        (acc, cur) => ({ ...acc, [cur]: is_anime_blacklisted(cur) }),
        {}
      )
    })
  );
}
