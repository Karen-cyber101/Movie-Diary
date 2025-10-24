const API_OPTIONS = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization:
			"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWNkMzBjMDE2MWM4ZDMzMzkxZDVhMDY4OWM0ZGUxYyIsIm5iZiI6MTc2MDM0MjEzNC40MjgsInN1YiI6IjY4ZWNiMDc2NjI1MTJlYzA4YzVlZTk4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9-XyUZbX9yLTLmGstCESN3JsJwsrW91KBSeArXEFRBg",
	},
};

export const TRENDING_ENDPOINTS = {
	trendingMovies:
		"https://api.themoviedb.org/3/trending/movie/week?language=en-US",
	trendingShows:
		"https://api.themoviedb.org/3/trending/tv/day?language=en-US",
};

const fetchPath = async (path) => {
	try {
		const response = await fetch(path, API_OPTIONS);
		if (!response.ok) {
			throw new Error(`HTTP error ${response.status} for ${path}`);
		}

		const { results = [] } = await response.json();
		return results;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const fetchTrendingMedia = async (paths = TRENDING_ENDPOINTS) => {
	const mediaLists = await Promise.all(
		Object.values(paths).map((path) => fetchPath(path))
	);

	const combinedMedia = mediaLists.flat().map((item) => ({
		...item,
		popularity: Math.round(item.popularity ?? 0),
	}));

	return combinedMedia.sort(
		(a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)
	);
};

export { API_OPTIONS };
