const TMDB_ERROR_MESSAGE =
	"We couldn't load trending titles from TMDB. Please try again later.";

export const showGalleryError = (container, message) => {
	if (!container) return;

	container.innerHTML = "";

	const messageItem = document.createElement("li");
	messageItem.className =
		"col-span-full rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-6 text-center text-sm text-red-300";
	messageItem.setAttribute("role", "alert");
	messageItem.textContent = message;

	container.appendChild(messageItem);
};

export const handleTmdbError = (container, error) => {
	console.error("Failed to load trending media from TMDB", error);
	showGalleryError(container, TMDB_ERROR_MESSAGE);
};

export { TMDB_ERROR_MESSAGE };
