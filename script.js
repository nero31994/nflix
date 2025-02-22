const apiKey = "488eb36776275b8ae18600751059fb49";
const apiProxy = "https://nflix-zeta.vercel.app/api/proxy?id=";
const movieContainer = document.getElementById("movieContainer");
const searchInput = document.getElementById("searchInput");
let currentPage = 1;
let currentCategory = "popular";
let isLoading = false;

// Fetch Movies
async function fetchMovies(category, page = 1) {
    currentCategory = category;
    currentPage = page;
    movieContainer.innerHTML = "";
    isLoading = false;
    loadMovies(category, page);
}

// Load Movies with Infinite Scroll
async function loadMovies(category, page = 1) {
    if (isLoading) return;
    isLoading = true;

    let url = `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&page=${page}`;
    if (category === "tv") url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&page=${page}`;
    if (category === "anime") url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=16&page=${page}`;

    const res = await fetch(url);
    const data = await res.json();

    data.results.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}">
            <h3>${movie.title || movie.name}</h3>
            <button onclick="openMovieDetails(${movie.id}, '${category}')">View Details</button>
        `;
        movieContainer.appendChild(movieCard);
    });

    isLoading = false;
}

// Search Movies
async function searchMovies() {
    const query = searchInput.value.trim();
    if (!query) return;
    movieContainer.innerHTML = "";
    
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}`;
    const res = await fetch(url);
    const data = await res.json();

    data.results.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}">
            <h3>${movie.title || movie.name}</h3>
            <button onclick="openMovieDetails(${movie.id}, '${movie.media_type}')">View Details</button>
        `;
        movieContainer.appendChild(movieCard);
    });
}

// Open Movie Details
async function openMovieDetails(movieId, type) {
    const modal = document.getElementById("movieDetailsModal");
    modal.style.display = "block";

    let url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    if (type === "tv") url = `https://api.themoviedb.org/3/tv/${movieId}?api_key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    document.getElementById("movieTitle").innerText = data.title || data.name;
    document.getElementById("movieOverview").innerText = data.overview;
    document.getElementById("movieTrailer").src = `${apiProxy}${movieId}`;

    // Load Episodes for TV Shows
    if (type === "tv") {
        const episodeList = document.getElementById("episodeList");
        episodeList.innerHTML = "";

        for (let season = 1; season <= data.number_of_seasons; season++) {
            const seasonData = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/season/${season}?api_key=${apiKey}`);
            const seasonInfo = await seasonData.json();

            seasonInfo.episodes.forEach(episode => {
                const episodeItem = document.createElement("div");
                episodeItem.classList.add("episode-item");
                episodeItem.innerText = `S${season}E${episode.episode_number}: ${episode.name}`;
                episodeItem.onclick = () => window.location.href = `${apiProxy}${movieId}&season=${season}&episode=${episode.episode_number}`;
                episodeList.appendChild(episodeItem);
            });
        }
    }
}

// Close Modal
function closeModal() {
    document.getElementById("movieDetailsModal").style.display = "none";
}

// Infinite Scroll
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        currentPage++;
        loadMovies(currentCategory, currentPage);
    }
});

// Load Default Movies
fetchMovies("popular");
