import { Attempt, Evaluation, Problem } from "../domain/types";

export interface Evaluator {
  name: string;
  evaluate(problem: Problem, attempt: Attempt): Promise<Evaluation>;
}
