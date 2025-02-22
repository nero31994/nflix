const apiKey = "488eb36776275b8ae18600751059fb49";
const proxyUrl = "/api/proxy";
const movieContainer = document.getElementById("movieContainer");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const watchButton = document.getElementById("watchButton");
const episodeList = document.getElementById("episodeList");
const searchBar = document.getElementById("searchBar");

let currentPage = 1;
let currentCategory = "popular";
let currentType = "movie"; // Default to movies

// Fetch content
async function fetchContent(category = "popular", type = "movie") {
    currentCategory = category;
    currentType = type;
    const url = `https://api.themoviedb.org/3/${type}/${category}?api_key=${apiKey}&page=${currentPage}`;
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
}

// Display movies & TV shows
function displayMovies(movies) {
    if (currentPage === 1) movieContainer.innerHTML = ""; // Clear only on first load
    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}" />
            <p>${movie.title || movie.name}</p>
        `;
        card.addEventListener("click", () => openModal(movie));
        movieContainer.appendChild(card);
    });
}

// Open Modal & Show Details
function openModal(movie) {
    modal.style.display = "flex";
    modalTitle.innerText = movie.title || movie.name;
    modalDescription.innerText = movie.overview;
    watchButton.onclick = () => window.open(`${proxyUrl}?id=${movie.id}`, "_blank");

    if (currentType === "tv") {
        loadEpisodes(movie.id);
    } else {
        episodeList.innerHTML = "";
    }
}

// Load TV Show Episodes
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

// Search Function
searchBar.addEventListener("keyup", async function () {
    const query = searchBar.value.trim();
    if (query.length > 2) {
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}`;
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);
    }
});

// Infinite Scrolling
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        currentPage++;
        fetchContent(currentCategory, currentType);
    }
});

// Navigation Buttons
document.getElementById("popularBtn").addEventListener("click", () => fetchContent("popular", "movie"));
document.getElementById("topRatedBtn").addEventListener("click", () => fetchContent("top_rated", "movie"));
document.getElementById("upcomingBtn").addEventListener("click", () => fetchContent("upcoming", "movie"));
document.getElementById("tvShowsBtn").addEventListener("click", () => fetchContent("popular", "tv"));
document.getElementById("animeBtn").addEventListener("click", () => fetchContent("on_the_air", "tv"));

// Close Modal
document.querySelector(".close").addEventListener("click", () => {
    modal.style.display = "none";
});

// Initial Load
fetchContent();
