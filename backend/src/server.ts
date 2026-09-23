import "dotenv/config";
import express from "express";
import cors from "cors";
import { Store } from "./services/store";
import { createApi } from "./routes/api";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const store = new Store();

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "lld-practice-backend" });
});

app.use("/api", createApi(store));

app.listen(port, () => {
  console.log(`LLD Practice API running at http://localhost:${port}`);
});
