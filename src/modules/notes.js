import { loadNotes, saveNotes } from "./storage.js";
import { getMediaKey } from "./mediaKey.js";

let notesCache = loadNotes();

const persistNotes = () => {
	saveNotes(notesCache);
};

const resolveKey = (target) =>
	typeof target === "string" ? target : getMediaKey(target);

export const getNotesSnapshot = () => ({ ...notesCache });

export const getNotesFor = (target) => {
	const key = resolveKey(target);
	const notes = notesCache[key];
	return Array.isArray(notes) ? [...notes] : [];
};

export const setNotesFor = (target, notes) => {
	const key = resolveKey(target);

	if (Array.isArray(notes) && notes.length > 0) {
		notesCache = {
			...notesCache,
			[key]: [...notes],
		};
	} else if (key in notesCache) {
		const { [key]: _removed, ...rest } = notesCache;
		notesCache = rest;
	}

	persistNotes();
	return getNotesFor(key);
};

export const appendNote = (target, note) => {
	const updatedNotes = [...getNotesFor(target), note];
	return setNotesFor(target, updatedNotes);
};

export const removeNotesFor = (target) => {
	const key = resolveKey(target);
	if (key in notesCache) {
		const { [key]: _removed, ...rest } = notesCache;
		notesCache = rest;
		persistNotes();
	}
};
