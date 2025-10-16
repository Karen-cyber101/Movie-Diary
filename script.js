const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization:
			"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWNkMzBjMDE2MWM4ZDMzMzkxZDVhMDY4OWM0ZGUxYyIsIm5iZiI6MTc2MDM0MjEzNC40MjgsInN1YiI6IjY4ZWNiMDc2NjI1MTJlYzA4YzVlZTk4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9-XyUZbX9yLTLmGstCESN3JsJwsrW91KBSeArXEFRBg",
	},
};

fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", options)
	.then((result) => {
		if (!result.ok) throw new Error(`HTTP error! status: ${result.status}`);
		return result.json();
	})
	.then((data) => {
		console.log(data);
	})
	.catch((error) => console.error(error));
