import { showStatusMessage } from "./statusView.js";

// Renders the hero gallery list and wires click handlers for detail overlays.
export const renderGallery = (container, mediaItems, onSelect) => {
	if (!container || !Array.isArray(mediaItems)) return;

	container.innerHTML = "";

	// Shows "No movies found" if list is empty or invalid
	if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
		showStatusMessage(container, "No movies found. Please try again later.");
		return;
	}

	const fragment = document.createDocumentFragment();

	mediaItems.forEach((item) => {
		const listItem = document.createElement("li");
		listItem.className =
			"gallery__item rounded-lg overflow-hidden shadow-lg hover:scale-103 transition-transform duration-300";

		const image = document.createElement("img");
		image.className = "w-full h-full object-cover m-4 lg:m-0 rounded-lg";
		image.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
		image.alt = item.title || item.name || "Selected media poster";

		listItem.appendChild(image);

		if (typeof onSelect === "function") {
			listItem.addEventListener("click", () => onSelect(item));
		}

		fragment.appendChild(listItem);
	});

	container.appendChild(fragment);
};
