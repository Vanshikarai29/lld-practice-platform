export type Difficulty = "Easy" | "Medium" | "Hard";

export type AttemptStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "EVALUATING"
  | "COMPLETED"
  | "FAILED";

export type SubmissionType = "TEXT";

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number;
  description: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  requirements: string[];
  hints: string[];
  rubric: RubricCriterion[];
}

export interface SubmissionContent {
  requirements: string;
  classes: string;
  responsibilities: string;
  relationships: string;
  abstractions: string;
  patterns: string;
  decisions: string;
  edgeCases: string;
}

export interface Submission {
  id: string;
  type: SubmissionType;
  content: SubmissionContent;
  createdAt: string;
}

export interface CriterionResult {
  criterionId: string;
  criterionName: string;
  score: number;
  maxScore: number;
  evidence: string;
  concern: string;
  suggestion: string;
  confidence: number;
}

export interface Evaluation {
  id: string;
  overallScore: number;
  summary: string;
  results: CriterionResult[];
  evaluator: string;
  createdAt: string;
}

export interface Attempt {
  id: string;
  problemId: string;
  status: AttemptStatus;
  submission?: Submission;
  evaluation?: Evaluation;
  createdAt: string;
  updatedAt: string;
  failureReason?: string;
}

export interface Database {
  problems: Problem[];
  attempts: Attempt[];
}
