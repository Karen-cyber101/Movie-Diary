export const HERO_IMAGES = [
	"https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
	"https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
	"https://image.tmdb.org/t/p/original/53BC9F2tpZnsGno2cLhzvGprDYS.jpg",
	"https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
];

export const initHeroRotation = (
	element,
	images = HERO_IMAGES,
	interval = 5000
) => {
	if (!element || !Array.isArray(images) || images.length === 0) return null;

	let currentIndex = 0;

	const updateBackground = () => {
		element.style.backgroundImage = `url("${images[currentIndex]}")`;
		currentIndex = (currentIndex + 1) % images.length;
	};

	updateBackground();
	const timerId = window.setInterval(updateBackground, interval);
	return timerId;
};
