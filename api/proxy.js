import puppeteer from "puppeteer";

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid Movie ID" });
    }

    const vidSrcUrl = `https://multiembed.mov/embed/${id}`;

    try {
        const browser = await puppeteer.launch({ headless: "new" }); // Start browser
        const page = await browser.newPage();
        await page.goto(vidSrcUrl, { waitUntil: "domcontentloaded" });

        // Wait for iframe to load
        await page.waitForSelector("iframe");

        // Extract iframe source
        const embedUrl = await page.evaluate(() => {
            const iframe = document.querySelector("iframe");
            return iframe ? iframe.src : null;
        });

        await browser.close(); // Close browser

        if (!embedUrl) {
            return res.status(500).json({ error: "Failed to extract video player." });
        }

        // Return extracted iframe
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
