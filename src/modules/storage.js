// Thin wrappers around localStorage access to keep keys centralized.
const FAVORITES_KEY = "favorites";
const NOTES_KEY = "favoriteNotes";

export const loadFavorites = () => {
	try {
		const favorites = localStorage.getItem(FAVORITES_KEY);
		return favorites ? JSON.parse(favorites) : [];
	} catch {
		return [];
	}
};

export const saveFavorites = (favorites) => {
	localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const loadNotes = () => {
	try {
		const notes = localStorage.getItem(NOTES_KEY);
		return notes ? JSON.parse(notes) : {};
	} catch {
		return {};
	}
};

export const saveNotes = (notes) => {
	localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};
