import { Attempt, Evaluation, Problem } from "../domain/types";
import { Evaluator } from "./Evaluator";

export class AiEvaluator implements Evaluator {
  name = "ai";

  async evaluate(problem: Problem, attempt: Attempt): Promise<Evaluation> {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) throw new Error("AI_API_KEY is not configured");

    const baseUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const model = process.env.AI_MODEL || "gpt-4o-mini";

    const prompt = {
      problem,
      submission: attempt.submission,
      instruction: "Evaluate this LLD design using the supplied rubric. Return ONLY valid JSON with overallScore, summary and results. Each result must contain criterionId, criterionName, score, maxScore, evidence, concern, suggestion, confidence. Be constructive and do not assume there is only one correct architecture."
    };

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a senior object-oriented design interviewer. Give evidence-based feedback." },
          { role: "user", content: JSON.stringify(prompt) }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`AI provider returned ${response.status}`);
    }

    const data: any = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI provider returned no content");

    const parsed = JSON.parse(content);
    return {
      id: crypto.randomUUID(),
      overallScore: Number(parsed.overallScore),
      summary: String(parsed.summary),
      results: parsed.results,
      evaluator: this.name,
      createdAt: new Date().toISOString()
    };
  }
}
