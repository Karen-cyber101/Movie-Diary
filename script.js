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


// Dynamische Hero-Bilder
const heroImages = [
	"https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
	"https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
	"https://image.tmdb.org/t/p/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg",
	"https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
];

const heroElement = document.querySelector(".hero");

if (heroElement && heroImages.length) {
	let heroIndex = 0;

	const updateHeroBackground = () => {
		heroElement.style.backgroundImage = `url("${heroImages[heroIndex]}")`;
	};

	updateHeroBackground();

	setInterval(() => {
		heroIndex = (heroIndex + 1) % heroImages.length;
		updateHeroBackground();
	}, 5000);
}
