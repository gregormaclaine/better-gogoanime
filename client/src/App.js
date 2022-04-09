import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { blacklist_item, is_item_blacklisted } from './preferences';
import cross_icon_img from './img/cross.svg';

const AnimeList = styled.ul`
  width: 726px;
  list-style-type: none;
  padding: 0 16px 20px 16px;
  height: ${props => props.height}px;
  box-sizing: border-box;
`;

const CrossIcon = styled.img`
  display: none;
  position: absolute;
  height: 30px;
  width: auto;
  top: 5px;
  right: 5px;
  cursor: pointer;

  background: radial-gradient(circle,rgba(0,0,0,1) 0%,rgba(0,0,0,0) 80%,rgba(0,0,0,0) 100%);
  border-radius: 50%;
  padding: 1px;

  &:hover {
    display: block;
    opacity: 1 !important;
  }
`;

const AnimeItemWrapper = styled.li`
  float: left;
  position: relative;
  margin-left: 1.8867%;
  width: 23.5849%;
  text-align: center;
  list-style: none;
  margin-bottom: 20px;
  vertical-align: top;

  &:nth-child(4n+1) { margin-left: 0; }

  &:hover > ${CrossIcon} {
    display: block;
    opacity: 0.4;
  }
`;

const ImportedAnimeItem = styled.div`
  & > .img {
    height: 230px;
    overflow: hidden;

    & div.type { display: none; }

    & > a {
      width: 100%;
      height: 100%;

      & > img {
        width: 100%;
        max-width: 100%;
        height: auto;
      }
    }
  }

  & > .name {
    line-height: 16px;
    height: 34px;
    overflow: hidden;
    margin: 8px 0;

    & > a {
      color: #ffc119;
      font-size: 13px;
      text-decoration: none;
      font-family: mySecondFont;
    }
  }

  & > .episode {
    margin: 0;
    padding: 0;
    color: #e1e1e1;
    font-size: 12px;
    font-family: mySecondFont;
  }
`;


function App() {
  const [active_page, set_active_page] = useState(1);
  const [fetch_status, set_fetch_status] = useState({ pages_done: 0, status: 'idle' });
  const [anime_items, set_anime_items] = useState([]);
  
  async function get_items(page) {
    const url = 'http://localhost:1000/page/' + page;
    const res = await fetch(url);
    if (!res.ok) return console.error('Couldn\'t fetch page data for page', page);
  
    const el = document.createElement('div');
    el.innerHTML = await res.text();
    const listEl = el.querySelector('ul.items');
  
    const list_items = [...listEl.children].map(itemEl => {
      const namelinkEl = itemEl.querySelector('p.name > a');
      const urlpath = namelinkEl.href.split('/')[3];

      [...itemEl.querySelectorAll('a')].forEach(el => {
        el.href = 'https://gogoanimeapp.com/' + urlpath;
      });
      
      return {
        name: namelinkEl.innerText,
        urlpath,
        episode: parseInt(itemEl.querySelector('p.episode').innerText.split(' ')[1]) || 'Unknown',
        html: itemEl.innerHTML
      };
    });
    
    el.remove();
    
    return list_items.filter(li => !is_item_blacklisted(li.name));
  }


  // If there is not enough anime to show, get the next lot
  useEffect(() => {
    const fetch_data = async page => {
      set_fetch_status({ ...fetch_status, status: 'fetching' });
      const list_items = await get_items(page);
      const aggregate_items = [...anime_items, ...list_items];
      set_anime_items(aggregate_items);
      set_fetch_status({ pages_done: page, status: 'idle' });
    }

    if (anime_items.length < (active_page * 20) && fetch_status.status === 'idle') {
      fetch_data(fetch_status.pages_done + 1);
    }

  }, [fetch_status, anime_items, active_page]);

  useEffect(() => {
    if (fetch_status.status === 'fetching') return;

    const filtered = anime_items.reduce((acc, cur) => {
      if (acc.findIndex(item => item.urlpath === cur.urlpath) === -1) acc.push(cur);
      return acc;
    }, []);

    if (filtered.length !== anime_items.length) {
      // If there are duplicate items, then it probably means a new item
      // has appeared on the first page and pushed everything along an index.
      // Therefore this gets the first page and puts it at the start (and filters
      // the items array again to remove duplicates).
      async function func() {
        set_fetch_status({ ...fetch_status, status: 'fetching' });

        const page_1_items = await get_items(1);
        const aggregate_items = [...page_1_items, ...anime_items].reduce((acc, cur) => {
          if (acc.findIndex(item => item.urlpath === cur.urlpath) === -1) acc.push(cur);
          return acc;
        }, []);

        set_anime_items(aggregate_items);
        set_fetch_status({ ...fetch_status, status: 'idle' });
      }

      func();
    }
  }, [anime_items, fetch_status]);

  useEffect(() => {
    const message_handler = e => {
        if (typeof e.data === 'string' && e.data.startsWith('change-page-to-')) {
            const new_page = parseInt(e.data.split('change-page-to-')[1] || 0);
            if (new_page > 0) set_active_page(new_page);
        }
    }

    window.addEventListener("message", message_handler);
    return () => {
        window.removeEventListener("message", message_handler);
    };
  });

  const on_cross_click = anime_name => () => {
    blacklist_item(anime_name);
    set_anime_items(anime_items.filter(li => !is_item_blacklisted(li.name)))
  }

  // const ul_height = Math.ceil(anime_items.length / 4) * (294.5 + 20) - 20;
  const ul_height = 5 * (294.5 + 20) - 20;

  return (
    <div>
      <AnimeList height={ul_height}>
        {anime_items.slice(20 * (active_page - 1), 20 * active_page).map(item => (
          <AnimeItemWrapper key={item.urlpath}>
            <ImportedAnimeItem dangerouslySetInnerHTML={{ __html: item.html }} />
            <CrossIcon src={cross_icon_img} alt='Remove Anime' onClick={on_cross_click(item.name)}/>
          </AnimeItemWrapper>
        ))}
      </AnimeList>
    </div>
  );
}

export default App;
