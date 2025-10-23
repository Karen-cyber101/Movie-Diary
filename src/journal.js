// Manages the favorites journal: loads saved media, allows note taking, and syncs localStorage.
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const notesStorageKey = "favoriteNotes";
const savedNotes = JSON.parse(localStorage.getItem(notesStorageKey)) || {};
const favoritesList = document.getElementById("favorites-list");

window.addEventListener("load", () => {
  if (favorites.length === 0) {
    const noFavoritesMessage = document.createElement("p");
    noFavoritesMessage.textContent = "You have no favorite movies yet.";
    noFavoritesMessage.className = "text-center text-gray-400 mt-8";
    favoritesList.appendChild(noFavoritesMessage);
  }
});

favorites.forEach((movie) => {
  const movieContainer = document.createElement("div");
  movieContainer.className = "flex bg-gray-900/20 rounded-lg shadow-lg mb-6 overflow-hidden max-w-[1600px] mx-auto";
  const movieId = movie.id ?? movie.title;

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
    const updatedFavorites = favorites.filter((fav) => {
      if (movie.id && fav.id) {
        return fav.id !== movie.id;
      }
      return fav.title !== movie.title;
    });
    favorites = updatedFavorites;
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    if (savedNotes[movieId]) {
      delete savedNotes[movieId];
      localStorage.setItem(notesStorageKey, JSON.stringify(savedNotes));
    }
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

  // List for personal notes
  const notesInput = document.createElement("textarea");
  notesInput.placeholder = "Add personal notes here...";
  notesInput.className = "w-full p-2 rounded bg-gray-800 text-white resize-none";
  notesInput.rows = 3;

  const saveNoteButton = document.createElement("button");
  saveNoteButton.textContent = "Save Note";
  saveNoteButton.className = "mt-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded self-start";

  const notesList = document.createElement("div");
  notesList.className = "mt-4 flex flex-col gap-2";

  // Normalize legacy note fields into a single array structure.
  const ensureNotesArray = () => {
    if (!Array.isArray(movie.notes)) {
      const legacyNote = movie.notes || movie.note;
      movie.notes = legacyNote ? [legacyNote] : [];
      if (movie.note) delete movie.note;
    }
    if (movie.notes.length === 0 && Array.isArray(savedNotes[movieId])) {
      movie.notes = [...savedNotes[movieId]];
    }
  };

  // Persist note changes to dedicated storage and keep favorites copy aligned.
  const persistNotes = () => {
    ensureNotesArray();
    if (movie.notes.length > 0) {
      savedNotes[movieId] = movie.notes;
    } else if (savedNotes[movieId]) {
      delete savedNotes[movieId];
    }
    localStorage.setItem(notesStorageKey, JSON.stringify(savedNotes));
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  // Re-render the visible list of notes after each mutation.
  const renderNotes = () => {
    ensureNotesArray();
    notesList.innerHTML = "";

    movie.notes.forEach((note, index) => {
      const noteItem = document.createElement("div");
      noteItem.className = "flex items-center justify-between bg-gray-800/60 rounded px-3 py-2";

      const noteText = document.createElement("p");
      noteText.textContent = note;
      noteText.className = "text-sm text-gray-100 pr-4";

      const deleteNoteButton = document.createElement("button");
      deleteNoteButton.textContent = "Remove";
      deleteNoteButton.className = "bg-red-600 hover:bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded";
      deleteNoteButton.addEventListener("click", () => {
        movie.notes.splice(index, 1);
        persistNotes();
        renderNotes();
      });

      noteItem.appendChild(noteText);
      noteItem.appendChild(deleteNoteButton);
      notesList.appendChild(noteItem);
    });
  };

  saveNoteButton.addEventListener("click", () => {
    const noteValue = notesInput.value.trim();
    if (!noteValue) return;
    ensureNotesArray();
    movie.notes.push(noteValue);
    persistNotes();
    notesInput.value = "";
    renderNotes();
  });

  rightColumn.appendChild(title);
  rightColumn.appendChild(overview);
  rightColumn.appendChild(notesInput);
  rightColumn.appendChild(saveNoteButton);
  rightColumn.appendChild(notesList);

  ensureNotesArray();
  if (movie.notes.length > 0) {
    persistNotes();
  }
  renderNotes();

  // Append columns to card
  movieContainer.appendChild(leftColumn);
  movieContainer.appendChild(rightColumn);

  // Append card to favorites list
  favoritesList.appendChild(movieContainer);
});
