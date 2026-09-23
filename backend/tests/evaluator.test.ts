import { describe, expect, it } from "vitest";
import { RuleBasedEvaluator } from "../src/evaluators/RuleBasedEvaluator";
import { problems } from "../src/domain/problemSeed";
import { Attempt } from "../src/domain/types";

const attempt: Attempt = {
  id: "a1",
  problemId: "parking-lot",
  status: "SUBMITTED",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  submission: {
    id: "s1",
    type: "TEXT",
    createdAt: new Date().toISOString(),
    content: {
      requirements: "Actors are drivers and operators. Multiple floors, spot types, tickets, pricing and exit are supported. Assume one vehicle per spot.",
      classes: "ParkingLot, Level, ParkingSpot, Vehicle, Ticket, PricingStrategy, PaymentService, ParkingAllocationStrategy.",
      responsibilities: "ParkingLot coordinates levels but does not calculate prices. PricingStrategy calculates fees. AllocationStrategy selects compatible spots. Ticket records entry and vehicle information.",
      relationships: "ParkingLot owns Levels. Levels contain ParkingSpots. Ticket references Vehicle. ParkingLot depends on interfaces for allocation and pricing.",
      abstractions: "PricingStrategy and ParkingAllocationStrategy are interfaces because pricing and allocation can change independently.",
      patterns: "Strategy is used for pricing and allocation. The trade-off is additional indirection in exchange for extensibility.",
      decisions: "If EV charging is added, introduce a compatible spot subtype and charging policy without changing the pricing abstraction. Avoid putting payment rules into ParkingLot.",
      edgeCases: "Full lot, incompatible spot, duplicate ticket, vehicle not found on exit, invalid payment, zero duration and failed payment should be tested."
    }
  }
};

describe("RuleBasedEvaluator", () => {
  it("returns all rubric criteria", async () => {
    const result = await new RuleBasedEvaluator().evaluate(problems[0], attempt);
    expect(result.results).toHaveLength(7);
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.results.every(r => r.evidence && r.suggestion)).toBe(true);
  });

  it("penalizes empty sections", async () => {
    const empty = structuredClone(attempt);
    empty.submission!.content.edgeCases = "";
    const result = await new RuleBasedEvaluator().evaluate(problems[0], empty);
    const edge = result.results.find(r => r.criterionId === "edge")!;
    expect(edge.score).toBeLessThan(10);
  });
});
