type ATag = Element & { href: string; innerText: string };
type PTag = Element & { innerText: string };
type EpisodeReturnVal = number | 'Unknown';

export type PageItem = {
  name: string;
  urlpath: string;
  episode: EpisodeReturnVal;
  html: string;
};

export type Page = {
  error?: false;
  num: number;
  items: PageItem[];
};

async function get_items(page: number): Promise<Page> {
  const res = await fetch(
    `https://gogoanimeapp.com/page-recent-release.html?page=${page}&type=1`
  );

  const el = document.createElement('div');
  el.innerHTML = await res.text();
  const listEl = el.querySelector('ul.items');

  if (!listEl) {
    console.warn("Caught Error: Couldn't get anime content");
    console.warn('\tResponse Content:', el.innerHTML);
    throw new Error("Couldn't get anime content for page " + page);
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

  return { num: page, items: list_items };
}

export default get_items;
