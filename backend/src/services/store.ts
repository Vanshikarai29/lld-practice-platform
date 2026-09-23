import fs from "fs";
import path from "path";
import { Database, SubmissionContent } from "../domain/types";
import { problems } from "../domain/problemSeed";

const dataDir = path.resolve(process.cwd(), "data");
const dbFile = path.join(dataDir, "db.json");

export class Store {
  private db: Database;

  constructor() {
    fs.mkdirSync(dataDir, { recursive: true });
    if (fs.existsSync(dbFile)) {
      this.db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
    } else {
      this.db = { problems, attempts: [] };
      this.persist();
    }
  }

  private persist() {
    fs.writeFileSync(dbFile, JSON.stringify(this.db, null, 2));
  }

  getProblems() {
    return this.db.problems;
  }

  getProblem(id: string) {
    return this.db.problems.find(p => p.id === id);
  }

  createAttempt(problemId: string, previousContent?: SubmissionContent) {
    const now = new Date().toISOString();
    const attempt = {
      id: crypto.randomUUID(),
      problemId,
      status: "DRAFT" as const,
      ...(previousContent ? {
        submission: {
          id: crypto.randomUUID(),
          type: "TEXT" as const,
          content: structuredClone(previousContent),
          createdAt: now
        }
      } : {}),
      createdAt: now,
      updatedAt: now
    };
    this.db.attempts.unshift(attempt);
    this.persist();
    return attempt;
  }

  getAttempt(id: string) {
    return this.db.attempts.find(a => a.id === id);
  }

  getAttempts(problemId?: string) {
    return problemId
      ? this.db.attempts.filter(a => a.problemId === problemId)
      : this.db.attempts;
  }

  updateAttempt(id: string, patch: any) {
    const attempt = this.getAttempt(id);
    if (!attempt) return undefined;
    Object.assign(attempt, patch, { updatedAt: new Date().toISOString() });
    this.persist();
    return attempt;
  }
}
