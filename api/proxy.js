export default async function handler(req, res) {
    const { id } = req.query;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid Movie ID" });
    }

    const vidSrcUrl = `https://www.2embed.stream/embed/${id}`; // 2embed source

    try {
        const response = await fetch(vidSrcUrl, {
            headers: { "User-Agent": "Mozilla/5.0" } // Helps bypass bot detection
        });
        let html = await response.text();

        // Extract iframe URL
        const match = html.match(/<iframe[^>]+src=["']([^"']+)["']/);
        if (!match || !match[1]) {
            return res.status(500).json({ error: "Failed to extract video player." });
        }

        const embedUrl = match[1];

        return res.status(200).send(`
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { margin: 0; background: black; display: flex; justify-content: center; align-items: center; height: 100vh; }
                    iframe { width: 100%; height: 100vh; border: none; }
                </style>
            </head>
            <body>
                <iframe src="${embedUrl}" allowfullscreen sandbox="allow-scripts allow-same-origin allow-presentation"></iframe>
            </body>
            </html>
        `);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching video source." });
    }
}
