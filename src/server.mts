// server.ts
import express from "express";
import fs from 'fs';
import https from 'https';
import http, { RequestListener } from 'http';
import path from 'path';

const app = express();
const port = process.env.PORT ?? 3001;

app.use(express.json());

app.get("/", (_req, res, next) => {
  try {
    res.send("ok");
  } catch (err) {
    next(err);
  }
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
);


const keyPath = process.env.SSL_KEY_PATH;
const certPath = process.env.SSL_CERT_PATH;

if (keyPath && certPath) {
  const sslOptions = {
    key: fs.readFileSync(path.resolve(keyPath)),
    cert: fs.readFileSync(path.resolve(certPath)),
  };

  https.createServer(sslOptions, app as RequestListener).listen(port, () => {
    console.log(`🔒 HTTPS server listening on https://localhost:${port.toString()}`);
  });
} else {
  http.createServer(app as RequestListener).listen(port, () => {
    console.log(`🌐 HTTP server listening on http://localhost:${port.toString()}`);
  });
}