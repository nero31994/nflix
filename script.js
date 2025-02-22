const API_BASE = "https://nflix.vercel.app/api";

// Fetch movie list
async function fetchMovies(category = "popular") {
    const response = await fetch(`${API_BASE}/movies?category=${category}`);
    const data = await response.json();
    displayMovies(data.results);
}

// Fetch movie details
async function fetchMovieDetails(id) {
    const response = await fetch(`${API_BASE}/movie?id=${id}`);
    const data = await response.json();
    
    document.getElementById("movie-title").innerText = data.title;
    document.getElementById("movie-overview").innerText = data.overview;
    document.getElementById("movie-trailer").src = `https://www.youtube.com/embed/${data.videos.results[0]?.key}`;
    
    document.getElementById("play-button").onclick = () => playMovie(id);
}

// Play movie via proxy
function playMovie(id) {
    window.location.href = `${API_BASE}/proxy?id=${id}`;
}

// Display movies in the UI
function displayMovies(movies) {
    const container = document.getElementById("movies-container");
    container.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="fetchMovieDetails(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        </div>
    `).join("");
}

// Initial movie fetch
fetchMovies();
