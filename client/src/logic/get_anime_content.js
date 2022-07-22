// import { SERVER_ADDRESS } from '../config';

export default async function get_items(page) {
    // const url = `${SERVER_ADDRESS}/page/${page}`;
    // const res = await fetch(url);
    // if (!res.ok) return console.error('Couldn\'t fetch page data for page', page);

    const res = await fetch(`https://gogoanimeapp.com/page-recent-release.html?page=${page}&type=1`)

    const el = document.createElement('div');
    el.innerHTML = await res.text();
    const listEl = el.querySelector('ul.items');

    if (!listEl) {
        console.warn('Caught Error: Couldn\'t get anime content');
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
            episode: parseInt(itemEl.querySelector('p.episode').innerText.split(' ')[1]) || 'Unknown',
            html: itemEl.innerHTML
        };
    });

    el.remove();

    return list_items;
}
