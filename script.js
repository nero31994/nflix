const apiKey = "488eb36776275b8ae18600751059fb49";
const proxyUrl = "/api/proxy";

document.addEventListener("DOMContentLoaded", () => {
    loadMovies();

    document.getElementById("topRatedBtn").addEventListener("click", () => loadMovies("top_rated"));
    document.getElementById("upcomingBtn").addEventListener("click", () => loadMovies("upcoming"));
    document.getElementById("moviesBtn").addEventListener("click", () => loadMovies("movie"));
    document.getElementById("tvShowsBtn").addEventListener("click", () => loadMovies("tv"));
    document.getElementById("animeBtn").addEventListener("click", () => loadMovies("anime"));

    document.getElementById("searchBar").addEventListener("input", (e) => searchMovies(e.target.value));
});

async function loadMovies(type = "popular") {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=${apiKey}`);
    const data = await response.json();
    displayMovies(data.results);
}

function displayMovies(movies) {
    const container = document.getElementById("movieContainer");
    container.innerHTML = "";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <p>${movie.title}</p>
        `;
        card.addEventListener("click", () => openModal(movie));
        container.appendChild(card);
    });
}

function openModal(movie) {
    document.getElementById("modalTitle").textContent = movie.title;
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

    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
    const data = await response.json();
    displayMovies(data.results);
}
