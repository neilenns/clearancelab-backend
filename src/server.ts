// server.ts
import express from "express";
import fs from "fs";
import https from "https";
import http, { RequestListener } from "http";
import path from "path";
import { ENV } from "./lib/env";
import applyMiddleware from "./middleware/index"; // adjust path as needed
import { connectToDatabase } from "./db/connect";

// Routes
import defaultRouter from "./routes/default";
import scenarioRoutes from "./routes/scenarios";

const app = express();
const port = ENV.PORT;

void (async () => {
  await connectToDatabase().catch(() => {
    console.error(`Unable to connect to database`);
  });
})();

app.set("trust proxy", ENV.TRUST_PROXY);
applyMiddleware(app);

// Set up the routes
app.use(defaultRouter);
app.use(scenarioRoutes);

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
