document.addEventListener("DOMContentLoaded", () => {
    const API_PROXY = "/api/proxy.js";
    const API_KEY = "488eb36776275b8ae18600751059fb49";
    const BASE_URL = "https://api.themoviedb.org/3";
    const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
    const movieGrid = document.getElementById("movie-grid");
    const searchInput = document.getElementById("search");
    const topRatedBtn = document.getElementById("top-rated");
    const upcomingBtn = document.getElementById("upcoming");
    const modal = document.getElementById("movie-modal");
    const modalContent = document.getElementById("modal-content");
    const closeModal = document.getElementById("close-modal");
    let page = 1;
    let isLoading = false;

    async function fetchMovies(url) {
        if (isLoading) return;
        isLoading = true;
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
        isLoading = false;
    }

    function displayMovies(movies) {
        movies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");
            movieCard.innerHTML = `
                <img src="${IMAGE_URL + movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
            `;
            movieCard.addEventListener("click", () => showMovieDetails(movie));
            movieGrid.appendChild(movieCard);
        });
    }

    async function showMovieDetails(movie) {
        const response = await fetch(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}`);
        const details = await response.json();
        modalContent.innerHTML = `
            <h2>${details.title}</h2>
            <p>${details.overview}</p>
            <button onclick="playMovie(${movie.id})">Play</button>
        `;
        modal.classList.add("show");
    }

    function playMovie(movieId) {
        window.location.href = `${API_PROXY}?id=${movieId}`;
    }

    closeModal.addEventListener("click", () => modal.classList.remove("show"));
    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.classList.remove("show");
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value;
        if (query.length > 2) {
            movieGrid.innerHTML = "";
            fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        }
    });

    topRatedBtn.addEventListener("click", () => {
        movieGrid.innerHTML = "";
        fetchMovies(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=1`);
    });

    upcomingBtn.addEventListener("click", () => {
        movieGrid.innerHTML = "";
        fetchMovies(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=1`);
    });

    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            page++;
            fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
        }
    });

    fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`);
});
