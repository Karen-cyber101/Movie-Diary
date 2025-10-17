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
const favorits = new Array();

if (localStorage.getItem("favorits") !== null) {
	favorits = JSON.parse(localStorage.getItem("favorits"));
}


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

// Galerie-Elemente erstellen
const galleryContainer = document.getElementById("gallery__container");

mediaItems.forEach((item) => {
	const listItem = document.createElement("li");
	listItem.className =
		"gallery__item rounded-lg overflow-hidden shadow-lg hover:scale-103 transition-transform duration-300";

	const image = document.createElement("img");
	image.className = "w-full h-full object-cover";
	image.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
	image.alt = item.title || item.name;

	listItem.addEventListener("click", (item) => detailView(item));

	listItem.appendChild(image);
	galleryContainer.appendChild(listItem);
});

// Detailansicht
const detailView = (item) => {
	const detailContainer = document.createElement("div");
	detailContainer.id = "detail__container";
	detailContainer.className =
		"fixed inset-0 flex items-center justify-center z-20";

	const detailContent = document.createElement("div");
	detailContent.className =
		"w-[min(100%-8rem,_800px)] bg-gray-900/40 backdrop-blur-lg rounded-lg px-12 py-16 relative grid grid-cols-[5fr_7fr] gap-8";

	const itemImage = document.createElement("img");
	itemImage.className = "grid-start-1 grid-end-2 w-full object-cover";
	itemImage.src = `https://image.tmdb.org/t/p/w500${mediaItems.find(
		(media) => media.title === item.target.alt || media.name === item.target.alt
	).poster_path}`;
	itemImage.alt = item.target.alt;
	detailContent.appendChild(itemImage);

	const closeButton = document.createElement("button");
	closeButton.className =
		"absolute top-6 right-8 text-gray-400 hover:text-gray-200";
	closeButton.innerHTML = "&times;";
	closeButton.addEventListener("click", () => {
		detailContainer.remove();
	});
	detailContent.appendChild(closeButton);

	const detail__container = document.createElement("div");
	detail__container.id = "detail__container";
	detail__container.className = "grid-start-2 grid-end-3 h-full";
	detailContent.appendChild(detail__container);

	const title = document.createElement("h2");
	title.className = "text-2xl font-bold mb-4";
	title.textContent = item.target.alt;


	const overview = document.createElement("p");
	overview.className = "mb-4";
	overview.textContent = mediaItems.find(
		(media) => media.title === item.target.alt || media.name === item.target.alt
	).overview;


	const rating = document.createElement("p");
	rating.className = "mb-12";
	rating.textContent = `Rating: ${mediaItems.find(
		(media) => media.title === item.target.alt || media.name === item.target.alt
	).vote_average} / 10 (${mediaItems.find(
		(media) => media.title === item.target.alt || media.name === item.target.alt
	).vote_count} votes)`;


	const favoritButton = document.createElement("button");
	favoritButton.className =
		"bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded";
	favoritButton.textContent = "Add to Favorits";
	favoritButton.addEventListener("click", () => {
		const selectedItem = mediaItems.find(
			(media) =>
				media.title === item.target.alt || media.name === item.target.alt
		);
		if (!favorits.includes(selectedItem)) {
			favorits.push(selectedItem);
			console.log(favorits);
			favoritButton.textContent = "Added to Favorits";
			favoritButton.disabled = true;

			// Favoriten im localStorage speichern
			localStorage.setItem("favorites", JSON.stringify(favorits));
		}
	});
	detail__container.append(title, overview, rating, favoritButton);

	detailContainer.appendChild(detailContent);
	document.body.appendChild(detailContainer);
}


// Dynamische Hero-Bilder
const heroImages = [
	"https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
	"https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
	"https://image.tmdb.org/t/p/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg",
	"https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
];

const heroElement = document.getElementById("hero");

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
