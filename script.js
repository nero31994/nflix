const apiKey = "488eb36776275b8ae18600751059fb49";
const proxyUrl = "/api/proxy";
const movieContainer = document.getElementById("movieContainer");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const watchButton = document.getElementById("watchButton");
const episodeList = document.getElementById("episodeList");
let currentPage = 1;

// Fetch movies
async function fetchMovies(category = "popular") {
    const url = `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&page=${currentPage}`;
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
}

// Display movies
function displayMovies(movies) {
    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />`;
        card.addEventListener("click", () => openModal(movie));
        movieContainer.appendChild(card);
    });
}

// Open Modal & Show Movie Details
function openModal(movie) {
    modal.style.display = "flex";
    modalTitle.innerText = movie.title;
    modalDescription.innerText = movie.overview;
    watchButton.onclick = () => window.open(`${proxyUrl}?id=${movie.id}`, "_blank");

    if (movie.media_type === "tv") {
        loadEpisodes(movie.id);
    } else {
        episodeList.innerHTML = "";
    }
}

// Load Episodes for TV Shows & Anime
async function loadEpisodes(tvId) {
    episodeList.innerHTML = "<h3>Episodes</h3>";
    const url = `https://api.themoviedb.org/3/tv/${tvId}/season/1?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    data.episodes.forEach(ep => {
        const epBtn = document.createElement("button");
        epBtn.innerText = `Episode ${ep.episode_number}`;
        epBtn.onclick = () => window.open(`${proxyUrl}?id=${ep.id}`, "_blank");
        episodeList.appendChild(epBtn);
    });
}

// Infinite Scrolling
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        currentPage++;
        fetchMovies();
    }
});

// Event Listeners for Navigation
document.getElementById("popularBtn").addEventListener("click", () => {
    movieContainer.innerHTML = "";
    fetchMovies("popular");
});

document.getElementById("topRatedBtn").addEventListener("click", () => {
    movieContainer.innerHTML = "";
    fetchMovies("top_rated");
});

document.getElementById("upcomingBtn").addEventListener("click", () => {
    movieContainer.innerHTML = "";
    fetchMovies("upcoming");
});

document.getElementById("tvShowsBtn").addEventListener("click", () => {
    movieContainer.innerHTML = "";
    fetchMovies("on_the_air");
});

document.getElementById("animeBtn").addEventListener("click", () => {
    movieContainer.innerHTML = "";
    fetchMovies("airing_today");
});

// Close Modal
document.querySelector(".close").addEventListener("click", () => {
    modal.style.display = "none";
});

// Initial Load
fetchMovies();
