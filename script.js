const API_KEY = "488eb36776275b8ae18600751059fb49";
const API_PROXY = "/api/proxy";
let currentCategory = "popular";
let page = 1;
let isLoading = false;

async function loadMovies(category, pageNum = 1) {
    if (isLoading) return;
    isLoading = true;

    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&page=${pageNum}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Error fetching movies:", error);
    } finally {
        isLoading = false;
    }
}

function displayMovies(movies) {
    const container = document.getElementById("movies-container");

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        `;
        card.onclick = () => openMovieModal(movie);
        container.appendChild(card);
    });
}

function openMovieModal(movie) {
    const modal = document.getElementById("movie-modal");
    const details = document.getElementById("movie-details");
    const playButton = document.getElementById("play-movie");

    details.innerHTML = `
        <h2>${movie.title}</h2>
        <p>${movie.overview}</p>
    `;
    
    playButton.onclick = () => playMovie(movie.id);
    
    modal.style.display = "flex";
}

function playMovie(movieId) {
    window.location.href = `${API_PROXY}?id=${movieId}`;
}

function closeModal() {
    document.getElementById("movie-modal").style.display = "none";
}

function loadCategory(category) {
    currentCategory = category;
    page = 1;
    document.getElementById("movies-container").innerHTML = "";
    loadMovies(category, page);
}

// ** Infinite Scroll **
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
        page++;
        loadMovies(currentCategory, page);
    }
});

// Load initial movies
loadMovies(currentCategory, page);
