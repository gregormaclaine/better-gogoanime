type ATag = Element & { href: string; innerText: string };

type PTag = Element & { innerText: string };

type EpisodeReturnVal = number | 'Unknown';

export type PageItem = {
  name: string;
  urlpath: string;
  episode: EpisodeReturnVal;
  html: string;
};

async function get_items(page: number): Promise<PageItem[]> {
  const res = await fetch(
    `https://gogoanimeapp.com/page-recent-release.html?page=${page}&type=1`
  );

  const el = document.createElement('div');
  el.innerHTML = await res.text();
  const listEl = el.querySelector('ul.items');

  if (!listEl) {
    console.warn("Caught Error: Couldn't get anime content");
    console.warn('\tResponse Content:', el.innerHTML);
    return [];
  }

  const list_items = [...listEl.children].map(itemEl => {
    const namelinkEl = itemEl.querySelector('p.name > a') as ATag;
    const urlpath = namelinkEl.href.split('/')[3];

    [...itemEl.querySelectorAll('a')].forEach(el => {
      el.href = 'https://gogoanimeapp.com/' + urlpath;
    });

    itemEl.querySelector('div.img > div.type')?.remove();

    const episodeEl = itemEl.querySelector('p.episode') as PTag;

    return {
      name: namelinkEl.innerText,
      urlpath,
      episode: (parseInt(episodeEl.innerText.split(' ')[1]) ||
        'Unknown') as EpisodeReturnVal,
      html: itemEl.innerHTML
    };
  });

  el.remove();

  return list_items;
}

const CACHE_TIME = 1000 * 60;
const cache: {
  [key: number]: { time: Date; data: PageItem[] };
} = {};

async function cached_get_items(page: number, force: boolean = false) {
  const { time, data } = cache[page] || {};

  if (!force && time) {
    const time_dif = new Date().getTime() - time.getTime();
    if (time_dif < CACHE_TIME) return data;
  }

  const result = await get_items(page);
  cache[page] = { data: result, time: new Date() };
  return result;
}

let fetching = false;

async function single_runner(page: number, force: boolean = false) {
  if (fetching) return null;
  fetching = true;
  const result = await cached_get_items(page, force);
  fetching = false;
  return result;
}

export default single_runner;
