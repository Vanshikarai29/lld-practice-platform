import { Router } from "express";
import { Store } from "../services/store";
import { EvaluationService } from "../services/evaluationService";

export function createApi(store: Store) {
  const router = Router();
  const evaluationService = new EvaluationService(store);

  router.get("/problems", (_req, res) => {
    res.json(store.getProblems());
  });

  router.get("/problems/:id", (req, res) => {
    const problem = store.getProblem(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  });

  router.get("/attempts", (req, res) => {
    res.json(store.getAttempts(req.query.problemId as string | undefined));
  });

  router.get("/attempts/:id", (req, res) => {
    const attempt = store.getAttempt(req.params.id);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    res.json(attempt);
  });

  router.post("/attempts", (req, res) => {
    const { problemId } = req.body;
    if (!problemId || !store.getProblem(problemId)) {
      return res.status(400).json({ message: "A valid problemId is required" });
    }
    res.status(201).json(store.createAttempt(problemId));
  });

  router.post("/attempts/:id/submit", async (req, res) => {
    const attempt = store.getAttempt(req.params.id);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    if (attempt.status === "EVALUATING") return res.status(409).json({ message: "Attempt is already being evaluated" });

    const content = req.body?.content;
    if (!content) return res.status(400).json({ message: "Submission content is required" });

    const required = ["requirements", "classes", "responsibilities", "relationships", "abstractions", "patterns", "decisions", "edgeCases"];
    const missing = required.filter(key => !String(content[key] || "").trim());
    if (missing.length) return res.status(400).json({ message: `Missing sections: ${missing.join(", ")}` });

    const submission = {
      id: crypto.randomUUID(),
      type: "TEXT" as const,
      content,
      createdAt: new Date().toISOString()
    };

    const updated = store.updateAttempt(attempt.id, {
      status: "SUBMITTED",
      submission,
      evaluation: undefined,
      failureReason: undefined
    });

    // Evaluation is intentionally started after persistence.
    // The HTTP request returns immediately, so a slow evaluator does not block submission.
    setImmediate(() => evaluationService.evaluate(updated!));

    res.status(202).json(updated);
  });

  router.post("/attempts/:id/retry", (req, res) => {
    const attempt = store.getAttempt(req.params.id);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    // A retry starts a new attempt but carries forward the previous design.
    // The learner can edit any section before submitting the improved attempt.
    const next = store.createAttempt(attempt.problemId, attempt.submission?.content);
    res.status(201).json(next);
  });

  router.post("/attempts/:id/retry-evaluation", async (req, res) => {
    const attempt = store.getAttempt(req.params.id);
    if (!attempt?.submission) return res.status(404).json({ message: "Attempt/submission not found" });
    const updated = store.updateAttempt(attempt.id, { status: "SUBMITTED", failureReason: undefined });
    setImmediate(() => evaluationService.evaluate(updated!));
    res.status(202).json(updated);
  });

  return router;
}
