/**
 * Caption Maker AI — Local Server & Gemini API Proxy
 * Zero External Dependencies (Native Node.js)
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

// Helper: Forward request to Gemini API
function callGeminiAPI(apiKey, prompt, callback) {
  const model = "gemini-2.5-flash";
  const postData = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1200
    }
  });

  const options = {
    hostname: "generativelanguage.googleapis.com",
    path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let responseBody = "";
    res.on("data", (chunk) => { responseBody += chunk; });
    res.on("end", () => {
      try {
        const json = JSON.parse(responseBody);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          callback(null, json);
        } else {
          callback(new Error(json.error?.message || `HTTP ${res.statusCode}`));
        }
      } catch (e) {
        callback(e);
      }
    });
  });

  req.on("error", (e) => { callback(e); });
  req.write(postData);
  req.end();
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // Health check API
  if (pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "active",
      message: "Caption Maker Server is running",
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Gemini Proxy API
  if (pathname === "/api/gemini" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const apiKey = data.apiKey || process.env.GEMINI_API_KEY;
        const prompt = data.prompt;

        if (!apiKey) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            error: "API Key Google Gemini belum diisi. Masukkan kunci API di modal Pengaturan atau jalankan dengan GEMINI_API_KEY=... node server.js"
          }));
          return;
        }

        callGeminiAPI(apiKey, prompt, (err, geminiResponse) => {
          if (err) {
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
            return;
          }

          const generatedText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ text: generatedText }));
        });
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Format request tidak valid" }));
      }
    });
    return;
  }

  // Static File Serving
  let reqPath = pathname === "/" ? "/index.html" : pathname;
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<h1>404 File Not Found</h1><p>Direktori: ${safePath}</p>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache"
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Caption Maker AI Studio AKTIF:`);
  console.log(`👉 Akses di browser: http://localhost:${PORT}`);
  console.log(`👉 Endpoint Health: http://localhost:${PORT}/api/health`);
  console.log(`Standar Apple HIG & captions.ai Aesthetics`);
  console.log(`======================================================\n`);
});
