// Provides a consistent identifier for TMDB media items across the app.
export const getMediaKey = (item) => {
	if (!item || typeof item !== "object") return "";
	return item.id ?? item.title ?? item.name ?? "";
};
