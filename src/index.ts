import { connectToDatabase } from "#db/connect.js";
import { ENV } from "#lib/env.js";
import applyMiddleware from "#middleware/index.js"; // adjust path as needed
import addRoutes from "#routes/index.js";
import express from "express";
import fs from "fs";
import http, { RequestListener } from "http";
import https from "https";
import path from "path";

const app = express();
const port = ENV.PORT;

void (async () => {
  await connectToDatabase().catch(() => {
    console.error(`Unable to connect to database`);
  });
})();

// Configuration
app.set("trust proxy", ENV.TRUST_PROXY);

applyMiddleware(app);
addRoutes(app);

const keyPath = ENV.SSL_PRIVATE_KEY_PATH;
const certPath = ENV.SSL_FULL_CHAIN_PATH;

if (keyPath && certPath) {
  const sslOptions = {
    key: fs.readFileSync(path.resolve(keyPath)),
    cert: fs.readFileSync(path.resolve(certPath)),
  };

  https.createServer(sslOptions, app as RequestListener).listen(port, () => {
    console.log(
      `🔒 HTTPS server listening on https://localhost:${port.toString()}`
    );
  });
} else {
  http.createServer(app as RequestListener).listen(port, () => {
    console.log(
      `🌐 HTTP server listening on http://localhost:${port.toString()}`
    );
  });
}
