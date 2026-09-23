import { describe, expect, it } from "vitest";
import request from "supertest";
import express from "express";
import cors from "cors";
import { Store } from "../src/services/store";
import { createApi } from "../src/routes/api";

function makeApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api", createApi(new Store()));
  return app;
}

describe("API", () => {
  it("lists problems", async () => {
    const response = await request(makeApp()).get("/api/problems");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(4);
  });

  it("rejects empty submissions", async () => {
    const app = makeApp();
    const created = await request(app).post("/api/attempts").send({ problemId: "parking-lot" });
    const response = await request(app)
      .post(`/api/attempts/${created.body.id}/submit`)
      .send({ content: { requirements: "" } });

    expect(response.status).toBe(400);
  });

  it("rejects unknown problems", async () => {
    const response = await request(makeApp()).post("/api/attempts").send({ problemId: "unknown" });
    expect(response.status).toBe(400);
  });

  it("preserves the previous submission when retrying", async () => {
    const app = makeApp();
    const created = await request(app).post("/api/attempts").send({ problemId: "parking-lot" });
    const content = {
      requirements: "actors and requirements",
      classes: "ParkingLot, Vehicle, ParkingSpot",
      responsibilities: "ParkingLot coordinates parking",
      relationships: "ParkingLot contains floors",
      abstractions: "PricingStrategy interface",
      patterns: "Strategy pattern",
      decisions: "Separate pricing from allocation",
      edgeCases: "full lot and payment failure"
    };

    await request(app)
      .post(`/api/attempts/${created.body.id}/submit`)
      .send({ content });

    const retry = await request(app).post(`/api/attempts/${created.body.id}/retry`);

    expect(retry.status).toBe(201);
    expect(retry.body.id).not.toBe(created.body.id);
    expect(retry.body.status).toBe("DRAFT");
    expect(retry.body.submission.content).toEqual(content);
  });
});
