document.addEventListener('DOMContentLoaded', () => {
    fetchMovies('popular');
});

document.querySelectorAll('.filter').forEach(button => {
    button.addEventListener('click', () => {
        fetchMovies(button.dataset.category);
    });
});

document.getElementById('search').addEventListener('input', (event) => {
    const query = event.target.value;
    if (query.length > 2) {
        searchMovies(query);
    }
});

async function fetchMovies(category) {
    const response = await fetch(`/api/movies?category=${category}`);
    const data = await response.json();
    displayMovies(data.results);
}

async function searchMovies(query) {
    const response = await fetch(`/api/movies?search=${query}`);
    const data = await response.json();
    displayMovies(data.results);
}

function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" onclick="fetchMovieDetails(${movie.id})">
            <h3>${movie.title}</h3>
        `;
        movieList.appendChild(movieCard);
    });
}

async function fetchMovieDetails(movieId) {
    const response = await fetch(`/api/movie?id=${movieId}`);
    const data = await response.json();
    displayMovieDetails(data);
}

function displayMovieDetails(movie) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = `
        <div class="movie-details">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div>
                <h2>${movie.title}</h2>
                <p>${movie.overview}</p>
                <h3>Cast:</h3>
                <ul>${movie.credits.cast.slice(0, 5).map(actor => `<li>${actor.name}</li>`).join('')}</ul>
                ${movie.videos.results.length > 0 ? `<iframe src="https://www.youtube.com/embed/${movie.videos.results[0].key}" allowfullscreen></iframe>` : ''}
                <button onclick="fetchMoviePlayer(${movie.id})">Play Movie</button>
                <button onclick="fetchMovies('popular')">Back</button>
            </div>
        </div>
    `;
}

async function fetchMoviePlayer(movieId) {
    const response = await fetch(`/api/proxy?id=${movieId}`);
    const embedHtml = await response.text();
    
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = `
        <div class="movie-details">
            <h2>Now Playing</h2>
            <div class="video-player">${embedHtml}</div>
            <button onclick="fetchMovies('popular')">Back</button>
        </div>
    `;
}
