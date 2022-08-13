import { useState } from 'react';
import get_anime_items from './get_anime_content';

const handle_duplicates = (...arr) =>
  arr.flat().reduce(
    (acc, cur) => {
      if (acc.unique.findIndex(item => item.urlpath === cur.urlpath) === -1)
        acc.unique.push(cur);
      else acc.dups++;
      return acc;
    },
    { unique: [], dups: 0 }
  );

class ItemAccumulator {
  constructor(start_page, start_data, force) {
    if (!start_data) {
      throw new Error(
        'Data for first page should be precollected - Use ItemAccumulator.from() instead'
      );
    }

    this.fetch_cancelled = false;

    this.force = force;

    this.lower = start_page;
    this.higher = start_page;

    this.accumulate = { [start_page]: start_data };
  }

  static async from(page, force = false) {
    const items = await get_anime_items(page, force);
    if (!items) return ItemAccumulator.cancelled();
    return new ItemAccumulator(page, items, force);
  }

  // Returns an ItemAccumulator instance that has failed
  static cancelled() {
    const obj = new ItemAccumulator(1, []);
    obj.fetch_cancelled = true;
    return obj;
  }

  get items() {
    const arr = [];
    for (let i = this.lower; i <= this.higher; i++) {
      arr.push(...this.accumulate[i]);
    }
    return arr;
  }

  async extend(dir) {
    const page = dir === 'right' ? this.higher + 1 : this.lower - 1;
    if (page < 1) throw new Error(`Tried to fetch page ${page} from api`);
    this.accumulate[page] = await get_anime_items(page, this.force);
    if (!this.accumulate[page]) this.fetch_cancelled = true;
    dir === 'right' ? this.higher++ : this.lower--;
  }
}

/**
 * Call the api to get a new page of items to increase the current list
 * @param {Array} items The current array of anime items
 * @param {Number} start_page The first page of the api expected to have new items
 */
async function extend_items(items, start_page) {
  const acc = await ItemAccumulator.from(start_page);

  if (!items.length)
    return { items: acc.items, page: start_page + 1, overlap: false };

  while (true) {
    if (acc.fetch_cancelled) return { error: true };
    const { unique, dups } = handle_duplicates(items, acc.items);

    if (dups) {
      if (unique.length === items.length) {
        await acc.extend('right');
      } else {
        return {
          items: unique,
          page: acc.higher + 1,
          overlap: dups % 20 !== 0 // Overlap if duplicates are not in a multiple of 20
        };
      }
    } else {
      await acc.extend('left');
    }
  }
}

/**
 * Get the api's first pages until the item array is up to date with the most recent items
 * @param {Array} items The current array of anime items
 */
async function readjust_items(items) {
  const acc = await ItemAccumulator.from(1, true);

  if (!items.length) return { items: acc.items };

  while (true) {
    if (acc.fetch_cancelled) return { error: true };
    const { unique, dups } = handle_duplicates(acc.items, items);

    if (dups) {
      return { items: unique };
    } else {
      await acc.extend('right');
    }
  }
}

export default function useAnimeItems() {
  const [items, set_items] = useState([]);
  const [next_page, set_next_page] = useState(1);
  const [error, set_error] = useState(null);
  const [fetching, set_fetching] = useState(false);

  async function refresh() {
    try {
      if (fetching) return;
      set_fetching(true);
      const { items: new_items, error: e } = await readjust_items(items);

      if (!e) {
        set_items(new_items);
        set_fetching(false);
      } else {
        set_error("Couldn't refresh");
      }
    } catch (e) {
      console.error(e);
      set_error(e);
    }
  }

  async function fetch_more() {
    try {
      if (fetching) return;
      set_fetching(true);
      const {
        items: new_items,
        page,
        overlap,
        error: e
      } = await extend_items(items, next_page);

      if (e) {
        set_error("Could't fetch more anime");
      } else {
        set_items(new_items);
        set_next_page(page);
        if (overlap) {
          const { items: newer_items, error: e2 } = await readjust_items(items);
          if (e2) {
            set_error("Couldn't readjust after fetching more");
          } else {
            set_items(newer_items);
          }
        }
        set_fetching(false);
      }
    } catch (e) {
      console.error(e);
      set_error(e);
    }
  }

  return { items, fetching, error, refresh, fetch_more };
}
