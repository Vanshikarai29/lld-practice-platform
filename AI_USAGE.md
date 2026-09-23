# AI_USAGE.md

## AI-assisted decisions

AI tools were used as a development aid, but final architecture and scope decisions were reviewed manually.

### 1. Evaluation rubric

**AI suggested:** evaluating an LLD submission with a single overall score.

**Decision:** rejected as the primary approach.

**Why:** the assignment asks for useful and explainable feedback. A single score does not tell a learner what to improve.

**Final decision:** use criterion-level results with:
- score
- evidence
- concern
- suggestion
- confidence

### 2. Evaluator abstraction

**AI suggested:** directly calling an LLM from the submission controller.

**Decision:** rejected.

**Why:** this would couple the practice workflow to one evaluation mechanism.

**Final decision:** `Evaluator` is an interface. `RuleBasedEvaluator` is the deterministic implementation and `AiEvaluator` is an optional implementation/decorator. This allows human review or another evaluator to be added later.

### 3. Submission format

**AI suggested:** supporting code editor + UML editor + diagram uploads.

**Decision:** rejected for the MVP.

**Why:** those features increase implementation risk without being necessary to demonstrate the learner loop.

**Final decision:** structured text submission. The domain keeps a submission type so diagram/code support can be added later.

### 4. Evaluation lifecycle

**AI suggested:** making the submit API wait for the complete AI response.

**Decision:** rejected.

**Why:** LLM calls can be slow or fail.

**Final decision:** persist first, mark `SUBMITTED`, then evaluate asynchronously and expose `SUBMITTED → EVALUATING → COMPLETED/FAILED`.

### 5. Feedback style

**AI suggested:** generic comments such as “use SOLID principles.”

**Decision:** rejected.

**Final decision:** feedback should reference evidence from the learner's submitted design and provide a concrete next change, e.g. separating pricing policy from `ParkingLot`.
