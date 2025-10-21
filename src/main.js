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
let favorites = new Array();

if (localStorage.getItem("favorites") !== null) {
	favorites = JSON.parse(localStorage.getItem("favorites"));
}

(async () => {
	for (const path in paths) {
		try {
			const result = await fetch(paths[path], options);
			if (!result.ok)
				throw new Error(`HTTP error! status: ${result.status}`);
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
})().then(() => {
	// Sortieren nach Popularität (absteigend)
	mediaItems.sort((a, b) => b.popularity - a.popularity);
	console.log(mediaItems);

	// Galerie-Elemente erstellen
	const galleryContainer = document.getElementById("gallery__container");

	mediaItems.forEach((item) => {
		const listItem = document.createElement("li");
		listItem.className =
			"gallery__item rounded-lg overflow-hidden shadow-lg hover:scale-103 transition-transform duration-300";

		const image = document.createElement("img");
		image.className = "w-full h-full object-cover m-4 lg:m-0 rounded-lg ";
		image.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
		image.alt = item.title || item.name;

		listItem.addEventListener("click", (event) => detailView(event));

		listItem.appendChild(image);
		galleryContainer.appendChild(listItem);
	});
});

// Detailansicht
const detailView = (item) => {
	const detailContainer = document.createElement("div");
	detailContainer.id = "detail__container";
	detailContainer.className =
		"fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20";

	const detailContent = document.createElement("div");
	detailContent.className =
		"overflow-hidden w-[min(100svw-1.5rem,_800px)] h-[80svh] lg:h-auto bg-gray-900/40 backdrop-blur-lg rounded-3xl lg:rounded-lg lg:px-6 lg:py-6 relative grid grid-cols-1 lg:grid-cols-[repeat(2,_1fr)] grid-rows-1 lg:gap-8";

	const itemImage = document.createElement("img");
	itemImage.className =
		"col-start-1 row-start-1 w-full md:w-[min(100%,_480px))] md:m-12 md:m-0 justify-self-center object-cover rounded-2xl lg:rounded-lg";
	itemImage.src = `https://image.tmdb.org/t/p/w500${
		mediaItems.find(
			(media) =>
				media.title === item.target.alt ||
				media.name === item.target.alt
		).poster_path
	}`;
	itemImage.alt = item.target.alt;
	detailContent.appendChild(itemImage);

	const detail__container = document.createElement("div");
	detail__container.id = "detail__container";
	detail__container.className =
		"w-full bg-linear-to-t from-gray-950 from-30% to-gray-950/0 lg:bg-none col-start-1 lg:col-start-2 col-end-2 lg:col-end-3 row-start-1 row-end-2 self-end h-full px-4 md:px-24 lg:px-0 lg:pr-10 py-8 md:py-0 md:pb-24 lg:py-10 flex flex-col justify-end lg:items-start ";
	detailContent.appendChild(detail__container);

	const closeButton = document.createElement("button");
	closeButton.className =
		"lg:absolute lg:top-4 lg:right-4 w-12 h-12 bg-gray-600/40 backdrop-blur-lg rounded-full border-gray-400/40 text-gray-400 hover:text-gray-200 text-3xl flex items-center justify-center pb-1";
	closeButton.innerHTML = "&times;";
	closeButton.addEventListener("click", () => {
		detailContainer.remove();
	});

	if (window.innerWidth >= 1024 /* lg */) {
		detailContent.appendChild(closeButton);
	} else {
		detailContainer.appendChild(closeButton);
	}

	const title = document.createElement("h2");
	title.className = "text-4xl lg:text-3xl font-bold mb-4";
	title.textContent = item.target.alt;

	const overview = document.createElement("p");
	overview.className =
		"lg:h-full text-xl lg:text-base text-justify lg:text-left mb-4";
	overview.textContent = mediaItems.find(
		(media) =>
			media.title === item.target.alt || media.name === item.target.alt
	).overview;

	const rating = document.createElement("p");
	rating.className = "text-sm text-gray-400 font-bold mb-4";
	rating.textContent = `Rating: ${
		mediaItems.find(
			(media) =>
				media.title === item.target.alt ||
				media.name === item.target.alt
		).vote_average
	} / 10 (${
		mediaItems.find(
			(media) =>
				media.title === item.target.alt ||
				media.name === item.target.alt
		).vote_count
	} votes)`;

	const favoritButton = document.createElement("button");
	favoritButton.className =
		"w-full h-12 bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded";
	favoritButton.textContent = "Add to favorites";
	favoritButton.addEventListener("click", () => {
		const selectedItem = mediaItems.find(
			(media) =>
				media.title === item.target.alt ||
				media.name === item.target.alt
		);
		if (!favorites.includes(selectedItem)) {
			favorites.push(selectedItem);
			console.log(favorites);
			favoritButton.textContent = "Added to favorites";
		} else {
			favorites.pop(selectedItem);
			console.log(favorites);
			favoritButton.textContent = "Add to favorites";
		}
		// Favoriten im localStorage speichern
		localStorage.setItem("favorites", JSON.stringify(favorites));
	});
	detail__container.append(title, overview, rating, favoritButton);

	detailContainer.appendChild(detailContent);
	document.body.appendChild(detailContainer);
};

// Dynamische Hero-Bilder
const heroImages = [
	"https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
	"https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
	"https://image.tmdb.org/t/p/original/53BC9F2tpZnsGno2cLhzvGprDYS.jpg",
	"https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
];

const heroElement = document.getElementById("hero");

if (heroElement && heroImages.length) {
	let heroIndex = 0;

	const cycleHeroBackground = () => {
		heroElement.style.backgroundImage = `url("${heroImages[heroIndex]}")`;
		heroIndex = (heroIndex + 1) % heroImages.length;
	};

	cycleHeroBackground();
	setInterval(cycleHeroBackground, 5000);
}
