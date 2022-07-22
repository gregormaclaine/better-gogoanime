import { useState, useEffect, useCallback } from "react";
import get_anime_items from './get_anime_content';

const handle_duplicates = arr => arr.reduce((acc, cur) => {
    if (acc.unique.findIndex(item => item.urlpath === cur.urlpath) === -1) acc.unique.push(cur);
    else acc.had_dups = true;
    return acc;
}, { unique: [], had_dups: false });

export default function useAnimeItemsState({ is_anime_blacklisted }) {
    const [current_page, change_page] = useState(1);
    const [show_blacklisted_anime, set_show_blacklisted_anime] = useState(false);
    const [anime_items, set_anime_items] = useState([]);
    const [fetch_status, set_fetch_status] = useState({ pages_done: 0, status: 'idle' });

    const filtered_anime = show_blacklisted_anime ? anime_items : anime_items.filter(a => !is_anime_blacklisted(a.name));
    const anime_to_show = filtered_anime.slice(20 * (current_page - 1), 20 * current_page);

    // Gets the first page of results and checks to see if it overlaps with the current items
    // If it does then remove duplicates and update the state
    // If it doesn't get next page recursively until it does overlap
    const fetch_data_start = useCallback(async (page, accumulate) => {
        if (fetch_status.status === 'error') return;

        if (!page) {
            page = 1;
            accumulate = [];
            set_fetch_status({ ...fetch_status, status: 'fetching' });
        }

        const new_items = await get_anime_items(page);
        if (!new_items.length) {
            set_fetch_status({ ...fetch_status, status: 'error' });
            return;
        }
        const { unique, had_dups } = handle_duplicates([...new_items, ...anime_items]);

        if (had_dups) {
            set_anime_items([...accumulate, ...unique]);
            set_fetch_status({ ...fetch_status, status: 'idle' });
        } else {
            fetch_data_start(page + 1, [...accumulate, ...new_items]);
        }
        
    }, [fetch_status, anime_items]);

    // Get the last page of data and append it to end of state
    // If duplicates, then a new item probably push all items along one.
    // Therefore recheck the first page with the fetch_data_start function.
    const fetch_data_end = useCallback(async () => {
        if (fetch_status.status === 'error') return;

        set_fetch_status({ ...fetch_status, status: 'fetching' });

        const new_page = fetch_status.pages_done + 1;
        const new_items = await get_anime_items(new_page);
        if (!new_items.length) {
            set_fetch_status({ ...fetch_status, status: 'error' });
            return;
        }
        const { unique, had_dups } = handle_duplicates([...anime_items, ...new_items]);

        set_anime_items(unique);
        if (had_dups) fetch_data_start(1, []);
        set_fetch_status({ pages_done: new_page, status: had_dups ? 'fetching' : 'idle' });

    }, [fetch_data_start, fetch_status, anime_items]);

    // If there is not enough anime to show, get the next lot
    useEffect(() => {
        if (anime_to_show.length < 20 && fetch_status.status === 'idle') fetch_data_end()
    }, [anime_to_show, fetch_status, fetch_data_end]);

    const is_refreshing = fetch_status.status === 'fetching';

    return {
        change_page,
        set_show_blacklisted_anime,
        refresh: () => {
            set_fetch_status({ ...fetch_status, status: 'idle' });
            fetch_data_start();
        },
        is_refreshing,
        anime_to_show: is_refreshing ? anime_to_show.slice(0, 19) : anime_to_show,
        fetch_status: fetch_status.status
    };
}
