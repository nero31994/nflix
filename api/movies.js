export default async function handler(req, res) {
    const API_KEY = "488eb36776275b8ae18600751059fb49";
    const TMDB_URL = "https://api.themoviedb.org/3";

    const { category, search } = req.query;
    let url = search 
        ? `${TMDB_URL}/search/movie?query=${search}&api_key=${API_KEY}`
        : `${TMDB_URL}/movie/${category}?api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching movies" });
    }
} 
