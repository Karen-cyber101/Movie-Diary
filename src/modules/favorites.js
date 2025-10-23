import { loadFavorites, saveFavorites } from "./storage.js";
import { getMediaKey } from "./mediaKey.js";

let favoritesCache = loadFavorites();

const cloneFavorite = (favorite) => ({ ...favorite });

const persistFavorites = () => {
	saveFavorites(favoritesCache);
};

export const getFavorites = () => favoritesCache.map(cloneFavorite);

export const isFavorite = (item) => {
	const key = getMediaKey(item);
	return favoritesCache.some(
		(favorite) => getMediaKey(favorite) === key
	);
};

export const addFavorite = (item) => {
	if (!isFavorite(item)) {
		favoritesCache = [...favoritesCache, { ...item }];
		persistFavorites();
	}
	return getFavorites();
};

export const removeFavorite = (item) => {
	const key = getMediaKey(item);
	const nextFavorites = favoritesCache.filter(
		(favorite) => getMediaKey(favorite) !== key
	);

	if (nextFavorites.length !== favoritesCache.length) {
		favoritesCache = nextFavorites;
		persistFavorites();
	}
	return getFavorites();
};

export const toggleFavorite = (item) => {
	if (isFavorite(item)) {
		return { favorites: removeFavorite(item), added: false };
	}

	const favorites = addFavorite(item);
	return { favorites, added: true };
};

export const syncFavoriteNotes = (item, notes) => {
	const key = getMediaKey(item);
	const index = favoritesCache.findIndex(
		(favorite) => getMediaKey(favorite) === key
	);

	if (index !== -1) {
		favoritesCache[index] = {
			...favoritesCache[index],
			notes: [...notes],
		};
		persistFavorites();
	}
};

export const clearFavoriteNotes = (item) => {
	const key = getMediaKey(item);
	const index = favoritesCache.findIndex(
		(favorite) => getMediaKey(favorite) === key
	);

	if (index !== -1 && "notes" in favoritesCache[index]) {
		const { notes, ...rest } = favoritesCache[index];
		favoritesCache[index] = rest;
		persistFavorites();
	}
};
