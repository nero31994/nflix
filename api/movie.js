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

document.getElementById("popularBtn").addEventListener("click", () => fetchContent("popular", "movie"));
document.getElementById("topRatedBtn").addEventListener("click", () => fetchContent("top_rated", "movie"));
document.getElementById("upcomingBtn").addEventListener("click", () => fetchContent("upcoming", "movie"));
document.getElementById("tvShowsBtn").addEventListener("click", () => fetchContent("popular", "tv")); 
document.getElementById("animeBtn").addEventListener("click", () => fetchContent("anime", "tv")); // Now filters Anime properly
