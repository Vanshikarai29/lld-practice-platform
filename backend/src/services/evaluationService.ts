import { Attempt, Evaluation } from "../domain/types";
import { Evaluator } from "../evaluators/Evaluator";
import { RuleBasedEvaluator } from "../evaluators/RuleBasedEvaluator";
import { AiEvaluator } from "../evaluators/AiEvaluator";
import { Store } from "./store";

export class EvaluationService {
  private fallback: Evaluator = new RuleBasedEvaluator();

  constructor(private store: Store) {}

  async evaluate(attempt: Attempt) {
    const problem = this.store.getProblem(attempt.problemId);
    if (!problem || !attempt.submission) throw new Error("Attempt is incomplete");

    this.store.updateAttempt(attempt.id, { status: "EVALUATING" });

    let evaluation: Evaluation;
    try {
      if (process.env.AI_ENABLED === "true" && process.env.AI_API_KEY) {
        evaluation = await new AiEvaluator().evaluate(problem, attempt);
      } else {
        evaluation = await this.fallback.evaluate(problem, attempt);
      }

      this.store.updateAttempt(attempt.id, {
        status: "COMPLETED",
        evaluation,
        failureReason: undefined
      });
    } catch (error: any) {
      this.store.updateAttempt(attempt.id, {
        status: "FAILED",
        failureReason: error?.message || "Evaluation failed"
      });
    }

    return this.store.getAttempt(attempt.id);
  }
}
