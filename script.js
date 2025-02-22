const apiKey = "488eb36776275b8ae18600751059fb49";
const proxyUrl = "/api/proxy"; 
const movieList = document.getElementById("movie-list");
const searchInput = document.getElementById("search");
const genreFilter = document.getElementById("genreFilter");
const topRatedBtn = document.getElementById("topRatedBtn");
const upcomingBtn = document.getElementById("upcomingBtn");
let currentPage = 1;
let genreId = "";

// Fetch Genres
async function loadGenres() {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
    const data = await res.json();
    data.genres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        genreFilter.appendChild(option);
    });
}

// Load Movies
async function loadMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    data.results.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="playMovie(${movie.id})">Play</button>
        `;
        movieCard.addEventListener("click", () => loadMovieDetails(movie.id));
        movieList.appendChild(movieCard);
    });
}

// Infinite Scroll
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        currentPage++;
        loadMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${currentPage}&with_genres=${genreId}`);
    }
});

// Search Functionality
searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length > 2) {
        movieList.innerHTML = "";
        loadMovies(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
    }
});

// Filter by Genre
genreFilter.addEventListener("change", () => {
    genreId = genreFilter.value;
    movieList.innerHTML = "";
    loadMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`);
});

// Top Rated & Upcoming Buttons
topRatedBtn.addEventListener("click", () => {
    movieList.innerHTML = "";
    loadMovies(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`);
});

upcomingBtn.addEventListener("click", () => {
    movieList.innerHTML = "";
    loadMovies(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`);
});

// Movie Details Page
async function loadMovieDetails(movieId) {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
    const movie = await res.json();
    alert(`Title: ${movie.title}\nOverview: ${movie.overview}\nRelease Date: ${movie.release_date}`);
}

// Play Movie using Proxy
function playMovie(movieId) {
    window.location.href = `${proxyUrl}?id=${movieId}`;
}

// Initial Load
loadGenres();
loadMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`);
