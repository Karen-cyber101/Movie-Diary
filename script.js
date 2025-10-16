const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization:
			"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWNkMzBjMDE2MWM4ZDMzMzkxZDVhMDY4OWM0ZGUxYyIsIm5iZiI6MTc2MDM0MjEzNC40MjgsInN1YiI6IjY4ZWNiMDc2NjI1MTJlYzA4YzVlZTk4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9-XyUZbX9yLTLmGstCESN3JsJwsrW91KBSeArXEFRBg",
	},
};

const paths = {
	trendingMovies:
		"https://api.themoviedb.org/3/trending/movie/week?language=en-US",
	trendingShows:
		"https://api.themoviedb.org/3/trending/tv/day?language=en-US",
};

const mediaItems = new Array();

for (const path in paths) {
	try {
		const result = await fetch(paths[path], options);
		if (!result.ok) throw new Error(`HTTP error! status: ${result.status}`);
		const data = await result.json();

		data.results.forEach((element) => {
			// Popularity Wert wird gerundet
			element.popularity = Math.round(element.popularity);
			mediaItems.push(element);
		});
	} catch (error) {
		console.error(error);
	}
}

// Sortieren nach Popularität (absteigend)
mediaItems.sort((a, b) => b.popularity - a.popularity);
console.log(mediaItems);
