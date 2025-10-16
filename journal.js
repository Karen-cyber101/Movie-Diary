const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const favoritesList = document.getElementById("favorites-list");

// Clearing favoritesList in case of reload
favoritesList.innerHTML = "";

favorites.forEach((movie) => {
  const movieContainer = document.createElement("div");
  movieContainer.className = "flex bg-gray-900/20 rounded-lg shadow-lg mb-6 overflow-hidden max-w-[1600px] mx-auto";

  // Left column: poster + remove button
  const leftColumn = document.createElement("div");
  leftColumn.className = "flex flex-col items-center p-4";

  const movieImage = document.createElement("img");
  movieImage.src = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
  movieImage.alt = movie.title;
  movieImage.className = "w-48 h-auto rounded-md mb-2";

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove from Favorites";
  removeButton.className = "bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded";
  removeButton.addEventListener("click", () => {
    const updatedFavorites = favorites.filter(fav => fav.title !== movie.title);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    movieContainer.remove();
  });

  leftColumn.appendChild(movieImage);
  leftColumn.appendChild(removeButton);

  // Right column: title, overview, personal notes
  const rightColumn = document.createElement("div");
  rightColumn.className = "flex-1 p-4 flex flex-col";

  const title = document.createElement("h2");
  title.textContent = movie.title;
  title.className = "text-2xl font-bold mb-2";

  const overview = document.createElement("p");
  overview.textContent = movie.overview || "No description available.";
  overview.className = "mb-4 text-gray-200";

  const notes = document.createElement("textarea");
  notes.placeholder = "Add personal notes here...";
  notes.className = "w-full p-2 rounded bg-gray-800 text-white resize-none";
  if (movie.note) notes.value = movie.note;
  notes.addEventListener("input", () => {
    movie.note = notes.value;
    localStorage.setItem("favorites", JSON.stringify(favorites));
  });

  rightColumn.appendChild(title);
  rightColumn.appendChild(overview);
  rightColumn.appendChild(notes);

  // Append columns to card
  movieContainer.appendChild(leftColumn);
  movieContainer.appendChild(rightColumn);

  // Append card to favorites list
  favoritesList.appendChild(movieContainer);
});
