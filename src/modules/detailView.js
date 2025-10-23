import {
	clearFavoriteNotes,
	isFavorite,
	toggleFavorite,
} from "./favorites.js";
import { removeNotesFor } from "./notes.js";

const closeOverlay = (overlay) => {
	if (overlay && overlay.parentElement) {
		overlay.parentElement.removeChild(overlay);
	}
};

const createCloseButton = (overlay, onClose) => {
	const closeButton = document.createElement("button");
	closeButton.className =
		"lg:absolute lg:top-4 lg:right-4 w-12 h-12 bg-gray-600/40 backdrop-blur-lg rounded-full border-gray-400/40 text-gray-400 hover:text-gray-200 text-3xl flex items-center justify-center pb-1";
	closeButton.innerHTML = "&times;";
	closeButton.addEventListener("click", () => {
		closeOverlay(overlay);
		onClose?.();
	});
	return closeButton;
};

const buildDetailContent = (mediaItem) => {
	const detailContent = document.createElement("div");
	detailContent.className =
		"overflow-hidden w-[min(100svw-1.5rem,_800px)] h-[80svh] lg:h-auto bg-gray-900/40 backdrop-blur-lg rounded-3xl lg:rounded-lg lg:px-6 lg:py-6 relative grid grid-cols-1 lg:grid-cols-[repeat(2,_1fr)] grid-rows-1 lg:gap-8";

	const poster = document.createElement("img");
	poster.className =
		"col-start-1 row-start-1 w-full md:w-[min(100%,_480px))] md:m-12 md:m-0 justify-self-center object-cover rounded-2xl lg:rounded-lg";
	poster.src = `https://image.tmdb.org/t/p/w500${mediaItem.poster_path}`;
	poster.alt = mediaItem.title || mediaItem.name || "Selected media poster";

	const detailPanel = document.createElement("div");
	detailPanel.className =
		"w-full bg-linear-to-t from-gray-950 from-30% to-gray-950/0 lg:bg-none col-start-1 lg:col-start-2 col-end-2 lg:col-end-3 row-start-1 row-end-2 self-end h-full px-4 md:px-24 lg:px-0 lg:pr-10 py-8 md:py-0 md:pb-24 lg:py-10 flex flex-col justify-end lg:items-start";

	const title = document.createElement("h2");
	title.className = "text-4xl lg:text-3xl font-bold mb-4";
	title.textContent = mediaItem.title || mediaItem.name || "Unknown title";

	const overview = document.createElement("p");
	overview.className =
		"lg:h-full text-xl lg:text-base text-justify lg:text-left mb-4";
	overview.textContent =
		mediaItem.overview || "No description available at the moment.";

	const rating = document.createElement("p");
	rating.className = "text-sm text-gray-400 font-bold mb-4";
	const votes = mediaItem.vote_count ?? 0;
	const average = mediaItem.vote_average ?? 0;
	rating.textContent = `Rating: ${average} / 10 (${votes} votes)`;

	const favoriteButton = document.createElement("button");
	favoriteButton.className =
		"w-full h-12 bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded";

	const setFavoriteState = (favorite) => {
		favoriteButton.textContent = favorite
			? "Remove from favorites"
			: "Add to favorites";
	};

	setFavoriteState(isFavorite(mediaItem));

	favoriteButton.addEventListener("click", () => {
		const { added } = toggleFavorite(mediaItem);
		if (!added) {
			clearFavoriteNotes(mediaItem);
			removeNotesFor(mediaItem);
		}
		setFavoriteState(added);
	});

	detailPanel.append(title, overview, rating, favoriteButton);
	detailContent.append(poster, detailPanel);

	return detailContent;
};

export const openDetailOverlay = (mediaItem) => {
	if (!mediaItem) return;

	const overlay = document.createElement("div");
	overlay.id = "detail__container";
	overlay.className =
		"fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20";

	const detailContent = buildDetailContent(mediaItem);
	overlay.appendChild(detailContent);

	const onKeyDown = (event) => {
		if (event.key === "Escape") {
			closeOverlay(overlay);
			teardown();
		}
	};

	const teardown = () => {
		document.removeEventListener("keydown", onKeyDown);
	};

	const closeButton = createCloseButton(overlay, teardown);
	if (window.innerWidth >= 1024) {
		detailContent.appendChild(closeButton);
	} else {
		overlay.appendChild(closeButton);
	}

	document.addEventListener("keydown", onKeyDown);
	document.body.appendChild(overlay);
};
