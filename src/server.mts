// server.ts
import express from "express";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", async (_req, res, next) => {
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

app.listen(port, () => {
  console.log(`🚀 Proxy server listening at http://localhost:${port}`);
});
