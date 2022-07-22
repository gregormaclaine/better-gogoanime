import { useState } from 'react';

export default function useAnimePreferences() {
  const ITEM_KEY = 'gogoanime-preferences';
  const get_cached_preferences = () =>
    JSON.parse(localStorage.getItem(ITEM_KEY) || '[]');

  const [preferences, set_preferences] = useState(get_cached_preferences());

  function blacklist_item(item) {
    if (is_anime_blacklisted(item)) return;
    localStorage.setItem(ITEM_KEY, JSON.stringify([...preferences, item]));
    set_preferences([...preferences, item]);
  }

  function unblacklist_item(item) {
    if (!is_anime_blacklisted(item)) return;
    const new_preferences = preferences.filter(p => p !== item);
    localStorage.setItem(ITEM_KEY, JSON.stringify(new_preferences));
    set_preferences(new_preferences);
  }

  function is_anime_blacklisted(item) {
    return preferences.includes(item);
  }

  return {
    preferences,
    blacklist_item,
    unblacklist_item,
    is_anime_blacklisted
  };
}
