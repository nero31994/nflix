export default async function handler(req, res) {
    const { id } = req.query;
    if (!id || isNaN(id)) return res.status(400).json({ error: "Invalid Movie ID" });

    const vidSrcUrl =  `https://multiembed.mov/embed/${id}`; // Alternative embed`;

    try {
        const response = await fetch(vidSrcUrl);
        let html = await response.text();

        // Remove ad-related scripts
        html = html.replace(/<script[^>]*(ads|popunder|googletag|analytics|tracking)[^>]*>[\s\S]*?<\/script>/gi, "");
        html = html.replace(/window\.open/g, "console.log");
        html = html.replace(/location\.href/g, "console.log");

        // Extract iframe
        const match = html.match(/<iframe[^>]+src="([^"]+)"/);
        if (match && match[1]) {
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
                    <iframe src="${match[1]}" allowfullscreen sandbox="allow-scripts allow-same-origin allow-presentation"></iframe>
                </body>
                </html>
            `);
        }
        res.status(500).json({ error: "Failed to extract video player." });
    } catch {
        res.status(500).json({ error: "Error fetching video source." });
    }
}
