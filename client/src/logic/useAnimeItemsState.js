import { useState, useEffect } from "react";
import get_anime_items from './get_anime_content';

const remove_duplicates = arr => arr.reduce((acc, cur) => {
    if (acc.findIndex(item => item.urlpath === cur.urlpath) === -1) acc.push(cur);
    return acc;
  }, []);

export default function useAnimeItemsState({ is_anime_blacklisted }) {
    const [current_page, change_page] = useState(1);
    const [show_blacklisted_anime, set_show_blacklisted_anime] = useState(false);
    const [anime_items, set_anime_items] = useState([]);
    const [fetch_status, set_fetch_status] = useState({ pages_done: 0, status: 'idle' });

    const filtered_anime = show_blacklisted_anime ? anime_items : anime_items.filter(a => !is_anime_blacklisted(a.name));
    const anime_to_show = filtered_anime.slice(20 * (current_page - 1), 20 * current_page);

    // If there is not enough anime to show, get the next lot
    useEffect(() => {
        const fetch_data = async page => {
            set_fetch_status({ ...fetch_status, status: 'fetching' });
            const new_page_items = await get_anime_items(page);
            set_anime_items([...anime_items, ...new_page_items]);
            set_fetch_status({ pages_done: page, status: 'idle' });
        }

        if (anime_to_show.length < 20 && fetch_status.status === 'idle') {
            fetch_data(fetch_status.pages_done + 1);
        }

    }, [anime_items, anime_to_show, fetch_status]);

    // Remove duplicate anime items (And if there are duplicates, send request for page 1 again)
    useEffect(() => {
        if (fetch_status.status === 'fetching') return;
        const unique_anime = remove_duplicates(anime_items);
    
        if (unique_anime.length !== anime_items.length) {
            // If there are duplicate items, then it probably means a new item
            // has appeared on the first page and pushed everything along an index.
            // Therefore this gets the first page and puts it at the start (and filters
            // the items array again to remove duplicates).
            async function func() {
                set_fetch_status({ ...fetch_status, status: 'fetching' });

                const page_1_items = await get_anime_items(1);
                const aggregate_items = remove_duplicates([...page_1_items, ...anime_items]);

                set_anime_items(aggregate_items);
                set_fetch_status({ ...fetch_status, status: 'idle' });
            }

            func();
        }
    }, [anime_items, fetch_status]);

    return { anime_to_show, change_page, set_show_blacklisted_anime };
}
