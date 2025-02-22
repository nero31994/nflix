const apiKey = "488eb36776275b8ae18600751059fb49"; 
const proxyUrl = "/api/proxy"; 
let currentPage = 1;
let currentCategory = "popular";
let currentType = "movie";

// Fetch Movies, TV Shows, or Anime
async function fetchContent(category = "popular", type = "movie") {
    currentCategory = category;
    currentType = type;

    let url = `https://api.themoviedb.org/3/${type}/${category}?api_key=${apiKey}&page=${currentPage}`;

    if (type === "tv" && category === "anime") {
        // Fetch only Anime (genre ID 16)
        url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=16&page=${currentPage}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
}

// Display Movies, TV Shows, or Anime
function displayMovies(movies) {
    const container = document.getElementById("movieContainer");
    container.innerHTML = ""; // Clear previous content

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}">
            <h3>${movie.title || movie.name}</h3>
            <button onclick="fetchMovieDetails(${movie.id}, '${currentType}')">View Details</button>
        `;
        container.appendChild(movieCard);
    });
}

// Fetch Movie or TV Show Details
async function fetchMovieDetails(id, type) {
    const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=videos,credits`);
    const data = await response.json();

    document.getElementById("movieTitle").innerText = data.title || data.name;
    document.getElementById("movieOverview").innerText = data.overview;
    document.getElementById("movieCast").innerHTML = data.credits.cast.slice(0, 5).map(actor => `<li>${actor.name}</li>`).join("");
    
    // Check for Trailer
    const trailer = data.videos.results.find(video => video.type === "Trailer");
    document.getElementById("movieTrailer").innerHTML = trailer
        ? `<iframe src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>`
        : "<p>No trailer available</p>";

    document.getElementById("movieDetailsModal").style.display = "block";

    // If TV Show, Load Episodes
    if (type === "tv") {
        fetchEpisodes(id);
    }
}

// Fetch Episodes for TV Shows & Anime
async function fetchEpisodes(tvId) {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/1?api_key=${apiKey}`);
    const data = await response.json();
    displayEpisodes(data.episodes);
}

// Display Episodes (Scrollable List)
function displayEpisodes(episodes) {
    const episodeContainer = document.getElementById("episodeList");
    episodeContainer.innerHTML = ""; // Clear previous episodes
    episodeContainer.classList.add("episode-list"); // Add scrollable style

    episodes.forEach(episode => {
        const episodeItem = document.createElement("div");
        episodeItem.classList.add("episode-item");
        episodeItem.innerHTML = `
            <p>Episode ${episode.episode_number}: ${episode.name}</p>
            <button onclick="playEpisode('${episode.id}')">Watch</button>
        `;
        episodeContainer.appendChild(episodeItem);
    });
}

// Play Episode using Proxy
function playEpisode(id) {
    window.open(`${proxyUrl}?id=${id}`, "_blank");
}

// Infinite Scrolling
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        currentPage++;
        fetchContent(currentCategory, currentType);
    }
});

// Button Click Events
document.getElementById("popularBtn").addEventListener("click", () => fetchContent("popular", "movie"));
document.getElementById("topRatedBtn").addEventListener("click", () => fetchContent("top_rated", "movie"));
document.getElementById("upcomingBtn").addEventListener("click", () => fetchContent("upcoming", "movie"));
document.getElementById("tvShowsBtn").addEventListener("click", () => fetchContent("popular", "tv"));
document.getElementById("animeBtn").addEventListener("click", () => fetchContent("anime", "tv"));

// Close Modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("movieDetailsModal").style.display = "none";
});
