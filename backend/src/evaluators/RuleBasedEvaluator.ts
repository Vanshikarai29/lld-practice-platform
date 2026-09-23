import { Attempt, Evaluation, Problem, CriterionResult } from "../domain/types";
import { Evaluator } from "./Evaluator";

function countMeaningful(text: string | undefined) {
  return (text ?? "").trim().length;
}

export class RuleBasedEvaluator implements Evaluator {
  name = "rule-based";

  async evaluate(problem: Problem, attempt: Attempt): Promise<Evaluation> {
    const c = attempt.submission!.content;

    const checks = [
      {
        id: "requirements",
        evidence: countMeaningful(c.requirements) > 100 ? "The submission contains explicit assumptions/requirements." : "Requirements are present but fairly brief.",
        concern: countMeaningful(c.requirements) > 100 ? "No major issue detected by the structural evaluator." : "The requirements section may not capture enough assumptions.",
        suggestion: "State the main actors, boundaries and assumptions before designing classes.",
        score: Math.min(15, countMeaningful(c.requirements) > 180 ? 15 : countMeaningful(c.requirements) > 100 ? 12 : 7),
        max: 15
      },
      {
        id: "responsibility",
        evidence: countMeaningful(c.classes) > 80 && countMeaningful(c.responsibilities) > 120 ? "Classes and responsibilities are explicitly listed." : "The class/responsibility evidence is limited.",
        concern: countMeaningful(c.responsibilities) > 120 ? "Some responsibilities may still belong to larger service objects." : "Responsibilities are not detailed enough to judge cohesion.",
        suggestion: "For each important class, state exactly what it owns and what it deliberately does not own.",
        score: Math.min(20, countMeaningful(c.classes) > 150 && countMeaningful(c.responsibilities) > 250 ? 18 : 12),
        max: 20
      },
      {
        id: "abstraction",
        evidence: countMeaningful(c.abstractions) > 80 ? "The submission identifies abstraction/interfaces." : "No substantial abstraction evidence was found.",
        concern: countMeaningful(c.abstractions) > 80 ? "Check that each interface represents real variation rather than ceremony." : "Potential variation points are not clearly isolated.",
        suggestion: "Use interfaces where a behaviour can vary independently, such as pricing or dispatch.",
        score: countMeaningful(c.abstractions) > 150 ? 14 : countMeaningful(c.abstractions) > 80 ? 10 : 5,
        max: 15
      },
      {
        id: "coupling",
        evidence: countMeaningful(c.relationships) > 100 ? "Relationships/dependencies are explicitly described." : "Relationships are only lightly described.",
        concern: countMeaningful(c.relationships) > 100 ? "The evaluator cannot fully verify dependency direction from prose alone." : "The design may hide coupling because relationships are underspecified.",
        suggestion: "Explain dependency direction and avoid a single god object coordinating every business rule.",
        score: countMeaningful(c.relationships) > 180 ? 13 : 9,
        max: 15
      },
      {
        id: "extensibility",
        evidence: countMeaningful(c.decisions) > 100 ? "Trade-offs and change points are discussed." : "Few explicit change scenarios were provided.",
        concern: countMeaningful(c.decisions) > 100 ? "Consider one concrete future requirement and trace what would change." : "Extensibility is difficult to judge without a change scenario.",
        suggestion: "Pick one likely change and explain how your abstractions keep existing classes stable.",
        score: countMeaningful(c.decisions) > 180 ? 14 : 9,
        max: 15
      },
      {
        id: "patterns",
        evidence: countMeaningful(c.patterns) > 50 ? "The submission names and explains patterns." : "Patterns/trade-offs are not substantially documented.",
        concern: countMeaningful(c.patterns) > 50 ? "Avoid adding patterns solely for pattern-counting." : "The design does not explain why a pattern is needed.",
        suggestion: "For every pattern, name the variation it isolates and the complexity it introduces.",
        score: countMeaningful(c.patterns) > 120 ? 9 : 5,
        max: 10
      },
      {
        id: "edge",
        evidence: countMeaningful(c.edgeCases) > 100 ? "Multiple edge cases are captured." : "Edge-case coverage is limited.",
        concern: countMeaningful(c.edgeCases) > 100 ? "Add failure-path tests for the most important invariants." : "Important invalid and boundary states may be missing.",
        suggestion: "Include duplicate requests, unavailable resources, invalid input and failure recovery where relevant.",
        score: countMeaningful(c.edgeCases) > 220 ? 9 : 5,
        max: 10
      }
    ];

    const results: CriterionResult[] = checks.map(x => ({
      criterionId: x.id,
      criterionName: problem.rubric.find(r => r.id === x.id)?.name ?? x.id,
      score: x.score,
      maxScore: x.max,
      evidence: x.evidence,
      concern: x.concern,
      suggestion: x.suggestion,
      confidence: 0.72
    }));

    const overallScore = Math.round(results.reduce((sum, x) => sum + x.score, 0));

    return {
      id: crypto.randomUUID(),
      overallScore,
      summary: `Your design shows a workable LLD direction. The strongest next improvement is to make responsibilities and change points more explicit for ${problem.title}.`,
      results,
      evaluator: this.name,
      createdAt: new Date().toISOString()
    };
  }
}
