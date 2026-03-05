const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 47821;
const HOST = "127.0.0.1";
const ROOT = __dirname;
const TASKS_FILE = path.join(ROOT, "tasks.json");
const MAX_BODY = 512 * 1024; // 512 KB

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".ico": "image/x-icon",
};

http.createServer((req, res) => {
    // POST /tasks.json — write items back to disk
    if (req.method === "POST" && req.url === "/tasks.json") {
        let body = "";
        let size = 0;

        req.on("data", (chunk) => {
            size += chunk.length;
            if (size > MAX_BODY) {
                res.writeHead(413);
                res.end("Payload too large");
                req.destroy();
                return;
            }
            body += chunk;
        });

        req.on("end", () => {
            let parsed;
            try {
                parsed = JSON.parse(body);
            } catch {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                return;
            }

            if (!Array.isArray(parsed.items)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Missing items array" }));
                return;
            }

            fs.writeFile(TASKS_FILE, JSON.stringify(parsed, null, 4), (err) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Write failed" }));
                    return;
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: true }));
            });
        });

        return;
    }

    // GET — serve static files
    if (req.method !== "GET") {
        res.writeHead(405);
        res.end("Method not allowed");
        return;
    }

    let urlPath = req.url.split("?")[0];
    if (urlPath === "/" || urlPath === "") {
        urlPath = "/plan.html";
    }

    // Prevent path traversal
    const resolved = path.resolve(ROOT, "." + urlPath);
    if (!resolved.startsWith(ROOT + path.sep) && resolved !== ROOT) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    const ext = path.extname(resolved);
    const contentType = MIME[ext] || "application/octet-stream";

    fs.readFile(resolved, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Not found");
            return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
}).listen(PORT, HOST, () => {
    console.log(`Tracker running at http://${HOST}:${PORT}`);
});
