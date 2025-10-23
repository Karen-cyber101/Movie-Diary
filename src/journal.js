import {
	clearFavoriteNotes,
	getFavorites,
	removeFavorite,
	syncFavoriteNotes,
} from "./modules/favorites.js";
import {
	appendNote,
	getNotesFor,
	removeNotesFor,
	setNotesFor,
} from "./modules/notes.js";

const favoritesList = document.getElementById("favorites-list");

let emptyState = null;
const ensureEmptyState = () => {
	if (!favoritesList) return;
	if (!favoritesList.childElementCount && !emptyState) {
		emptyState = document.createElement("p");
		emptyState.textContent = "You have no favorite movies yet.";
		emptyState.className = "text-center text-gray-400 mt-8";
		favoritesList.appendChild(emptyState);
	}
};

const clearEmptyState = () => {
	if (emptyState && emptyState.parentElement) {
		emptyState.parentElement.removeChild(emptyState);
		emptyState = null;
	}
};

const renderNotes = (movie, notesList) => {
	const currentNotes = getNotesFor(movie);
	notesList.innerHTML = "";

	currentNotes.forEach((note, index) => {
		const noteItem = document.createElement("div");
		noteItem.className =
			"flex items-center justify-between bg-gray-800/60 rounded px-3 py-2";

		const noteText = document.createElement("p");
		noteText.textContent = note;
		noteText.className = "text-sm text-gray-100 pr-4";

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Remove";
		deleteButton.className =
			"bg-red-600 hover:bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded";
		deleteButton.addEventListener("click", () => {
			const updatedNotes = currentNotes.filter(
				(_, noteIndex) => noteIndex !== index
			);
			setNotesFor(movie, updatedNotes);
			if (updatedNotes.length > 0) {
				syncFavoriteNotes(movie, updatedNotes);
			} else {
				clearFavoriteNotes(movie);
			}
			renderNotes(movie, notesList);
		});

		noteItem.append(noteText, deleteButton);
		notesList.appendChild(noteItem);
	});
};

const buildFavoriteCard = (movie) => {
	const movieContainer = document.createElement("div");
	movieContainer.className =
		"favorite-card flex bg-gray-900/20 rounded-lg shadow-lg mb-6 overflow-hidden max-w-[1600px] mx-auto";

	const leftColumn = document.createElement("div");
	leftColumn.className = "flex flex-col items-center p-4";

	const poster = document.createElement("img");
	poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
	poster.alt = movie.title || movie.name || "Favorite poster";
	poster.className = "w-48 h-auto rounded-md mb-2";

	const removeButton = document.createElement("button");
	removeButton.textContent = "Remove from Favorites";
	removeButton.className =
		"bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded";
	removeButton.addEventListener("click", () => {
		removeFavorite(movie);
		clearFavoriteNotes(movie);
		removeNotesFor(movie);
		movieContainer.remove();
		if (!favoritesList.querySelector(".favorite-card")) {
			ensureEmptyState();
		}
	});

	leftColumn.append(poster, removeButton);

	const rightColumn = document.createElement("div");
	rightColumn.className = "flex-1 p-4 flex flex-col";

	const title = document.createElement("h2");
	title.textContent = movie.title || movie.name || "Untitled";
	title.className = "text-2xl font-bold mb-2";

	const overview = document.createElement("p");
	overview.textContent = movie.overview || "No description available.";
	overview.className = "mb-4 text-gray-200";

	const notesInput = document.createElement("textarea");
	notesInput.placeholder = "Add personal notes here...";
	notesInput.className =
		"w-full p-2 rounded bg-gray-800 text-white resize-none";
	notesInput.rows = 3;

	const saveNoteButton = document.createElement("button");
	saveNoteButton.textContent = "Save Note";
	saveNoteButton.className =
		"mt-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded self-start";

	const notesList = document.createElement("div");
	notesList.className = "mt-4 flex flex-col gap-2";

	saveNoteButton.addEventListener("click", () => {
		const noteValue = notesInput.value.trim();
		if (!noteValue) return;

		const updatedNotes = appendNote(movie, noteValue);
		syncFavoriteNotes(movie, updatedNotes);
		notesInput.value = "";
		renderNotes(movie, notesList);
	});

	rightColumn.append(title, overview, notesInput, saveNoteButton, notesList);
	movieContainer.append(leftColumn, rightColumn);

	const normalizeLegacyNotes = () => {
		if (Array.isArray(movie.notes)) return [...movie.notes];
		if (Array.isArray(movie.note)) return [...movie.note];
		if (typeof movie.notes === "string" && movie.notes.trim()) {
			return [movie.notes.trim()];
		}
		if (typeof movie.note === "string" && movie.note.trim()) {
			return [movie.note.trim()];
		}
		return [];
	};

	const initialNotes = normalizeLegacyNotes();
	if (initialNotes.length > 0) {
		const storedNotes = setNotesFor(movie, initialNotes);
		syncFavoriteNotes(movie, storedNotes);
	}

	delete movie.note;
	delete movie.notes;

	renderNotes(movie, notesList);

	return movieContainer;
};

const initializeFavoritesView = () => {
	if (!favoritesList) return;

	const favorites = getFavorites();
	if (favorites.length === 0) {
		ensureEmptyState();
		return;
	}

	clearEmptyState();
	const fragment = document.createDocumentFragment();

	favorites.forEach((movie) => {
		fragment.appendChild(buildFavoriteCard(movie));
	});

	favoritesList.appendChild(fragment);
};

initializeFavoritesView();
ensureEmptyState();
