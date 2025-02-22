export default async function handler(req, res) {
    const { id } = req.query;
    if (!id || isNaN(id)) return res.status(400).json({ error: "Invalid Movie ID" });

    const vidSrcUrl = `https://multiembed.mov/embed/${id}`; // Alternative embed source

    try {
        const response = await fetch(vidSrcUrl);
        let html = await response.text();

        // Remove known ad-related scripts
        html = html.replace(/<script[^>]*(ads|popunder|googletag|analytics|tracking)[^>]*>[\s\S]*?<\/script>/gi, "");
        html = html.replace(/window\.open/g, "console.log"); // Prevent pop-ups
        html = html.replace(/location\.href/g, "console.log"); // Prevent forced redirects

        // Extract the correct iframe URL
        const match = html.match(/<iframe[^>]+src=["']([^"']+)["']/);
        if (match && match[1]) {
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
                    <iframe id="video-frame" src="${embedUrl}" allowfullscreen sandbox="allow-scripts allow-same-origin allow-presentation"></iframe>
                </body>
                </html>
            `);
        }

        // Fallback error if iframe extraction fails
        res.status(500).json({ error: "Failed to extract video player. The source might have changed." });

    } catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).json({ error: "Error fetching video source." });
    }
}
