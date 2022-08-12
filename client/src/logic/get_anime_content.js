async function get_items(page) {
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
    const namelinkEl = itemEl.querySelector('p.name > a');
    const urlpath = namelinkEl.href.split('/')[3];

    [...itemEl.querySelectorAll('a')].forEach(el => {
      el.href = 'https://gogoanimeapp.com/' + urlpath;
    });

    itemEl.querySelector('div.img > div.type').remove();

    return {
      name: namelinkEl.innerText,
      urlpath,
      episode:
        parseInt(itemEl.querySelector('p.episode').innerText.split(' ')[1]) ||
        'Unknown',
      html: itemEl.innerHTML
    };
  });

  el.remove();

  return list_items;
}

const CACHE_TIME = 1000 * 60;
const cache = {};

async function cached_get_items(page, force = false) {
  const { time, data } = cache[page] || {};

  if (!force && time && new Date() - time < CACHE_TIME) return data;

  const result = await get_items(page);
  cache[page] = { data: result, time: new Date() };
  return result;
}

let fetching = false;

async function single_runner(...args) {
  if (fetching) return null;
  fetching = true;
  const result = await cached_get_items(...args);
  fetching = false;
  return result;
}

export default single_runner;
