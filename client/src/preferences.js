const ITEM_KEY = 'gogoanime-preferences'

const preferences = JSON.parse(localStorage.getItem(ITEM_KEY) || '[]');

export function blacklist_item(item) {
    preferences.push(item);
    localStorage.setItem(ITEM_KEY, JSON.stringify(preferences));
}

export function is_item_blacklisted(item) {
    return preferences.includes(item);
}
