export default async function handler(req, res) {
    const API_KEY = "488eb36776275b8ae18600751059fb49";
    const { id } = req.query;

    if (!id) return res.status(400).json({ error: "Missing movie ID" });

    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching movie details" });
    }
}
