import { useState } from 'react';

type CacheType = number[];

function hashCode(str: string) {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function hash_anime(name: string) {
  if (/ \(Dub\)$/.test(name)) {
    name = name.split(' ').slice(0, -1).join(' ');
  }

  if (/(E|e)pisode [0-9-]+$/.test(name)) {
    name = name.split(' ').slice(0, -2).join(' ');
  }
  return hashCode(name);
}

function get_cached_preferences(key: string): CacheType {
  let cache = localStorage.getItem(key);
  if (cache) return JSON.parse(cache) as CacheType;

  // Account for previous version
  cache = localStorage.getItem('gogoanime-preferences');
  if (!cache) return [];
  const old_obj = JSON.parse(cache) as string[];
  const new_cache = [...new Set(old_obj.map(a => hash_anime(a)))];
  localStorage.setItem('gogoanime-preferences-hash', JSON.stringify(new_cache));
  return new_cache;
}

export default function useAnimePreferences() {
  const ITEM_KEY = 'gogoanime-preferences-hash';

  const [preferences, set_preferences] = useState(
    get_cached_preferences(ITEM_KEY)
  );

  function blacklist_item(item: string) {
    if (is_anime_blacklisted(item)) return;
    const hash = hash_anime(item);
    localStorage.setItem(ITEM_KEY, JSON.stringify([...preferences, hash]));
    set_preferences([...preferences, hash]);
  }

  function unblacklist_item(item: string) {
    if (!is_anime_blacklisted(item)) return;
    const hash = hash_anime(item);
    const new_preferences = preferences.filter(p => p !== hash);
    localStorage.setItem(ITEM_KEY, JSON.stringify(new_preferences));
    set_preferences(new_preferences);
  }

  function is_anime_blacklisted(item: string) {
    return preferences.includes(hash_anime(item));
  }

  return {
    preferences,
    blacklist_item,
    unblacklist_item,
    is_anime_blacklisted
  };
}
