const apiKey = "488eb36776275b8ae18600751059fb49";
const proxyUrl = "/api/proxy";
let currentPage = 1;
let currentCategory = "movie";
let isLoading = false;

document.addEventListener("DOMContentLoaded", () => {
    loadMovies();

    document.getElementById("topRatedBtn").addEventListener("click", () => loadMovies("movie", "top_rated"));
    document.getElementById("upcomingBtn").addEventListener("click", () => loadMovies("movie", "upcoming"));
    document.getElementById("moviesBtn").addEventListener("click", () => loadMovies("movie"));
    document.getElementById("tvShowsBtn").addEventListener("click", () => loadMovies("tv"));
    document.getElementById("animeBtn").addEventListener("click", () => loadMovies("tv", "anime"));

    document.getElementById("searchBar").addEventListener("input", (e) => searchMovies(e.target.value));

    window.addEventListener("scroll", handleInfiniteScroll);
});

async function loadMovies(category = "movie", type = "popular", page = 1) {
    if (isLoading) return;
    isLoading = true;
    document.getElementById("loading").style.display = "block";

    currentCategory = category;
    currentPage = page;

    let url = `https://api.themoviedb.org/3/${category}/${type}?api_key=${apiKey}&page=${page}`;

    if (type === "anime") {
        url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=16&page=${page}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results, page === 1);

    document.getElementById("loading").style.display = "none";
    isLoading = false;
}

function displayMovies(movies, clear = false) {
    const container = document.getElementById("movieContainer");
    if (clear) container.innerHTML = "";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}">
            <p>${movie.title || movie.name}</p>
        `;
        card.addEventListener("click", () => openModal(movie));
        container.appendChild(card);
    });
}

function openModal(movie) {
    document.getElementById("modalTitle").textContent = movie.title || movie.name;
    document.getElementById("modalOverview").textContent = movie.overview;
    document.getElementById("movieModal").style.display = "flex";

    document.getElementById("playButton").onclick = () => {
        window.location.href = `${proxyUrl}?id=${movie.id}`;
    };
}

document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("movieModal").style.display = "none";
});

async function searchMovies(query) {
    if (!query) {
        loadMovies();
        return;
    }

    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}`);
    const data = await response.json();
    displayMovies(data.results, true);
}

function handleInfiniteScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading) {
        loadMovies(currentCategory, "popular", currentPage + 1);
    }
}
