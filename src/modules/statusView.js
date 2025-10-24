// Gracefully handling empty-result scenarios (e.g., “no movies found”).
export const showStatusMessage = (container, messageText) => {
	if (!container) return;

	container.innerHTML = "";

	const message = document.createElement("p");
	message.className = "text-center text-gray-400 text-xl mt-10";
	message.textContent = messageText;

	container.appendChild(message);
};