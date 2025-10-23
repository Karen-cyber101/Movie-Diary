import { fetchTrendingMedia } from "./modules/api.js";
import { openDetailOverlay } from "./modules/detailView.js";
import { renderGallery } from "./modules/gallery.js";
import { HERO_IMAGES, initHeroRotation } from "./modules/hero.js";

const galleryContainer = document.getElementById("gallery__container");

const initializeGallery = async () => {
	const mediaItems = await fetchTrendingMedia();
	renderGallery(galleryContainer, mediaItems, openDetailOverlay);
};

initializeGallery();

const heroElement = document.getElementById("hero");
if (heroElement) {
	initHeroRotation(heroElement, HERO_IMAGES);
}
