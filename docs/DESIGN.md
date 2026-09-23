# Design Note

## MVP

The MVP supports:

1. problem selection
2. attempt creation
3. structured design submission
4. explicit evaluation lifecycle
5. deterministic evaluation
6. optional AI-assisted evaluation
7. criterion-level feedback
8. retry
9. attempt history

## Domain model

```text
Problem
  |
  | 1..*
  v
Attempt
  |
  +---- Submission
  |
  +---- Evaluation
          |
          +---- CriterionResult
```

### Problem

Owns the problem statement, requirements, difficulty and evaluation rubric.

### Attempt

Represents one learner attempt. It owns the lifecycle state and references the submitted design and evaluation.

### Submission

Represents what the learner actually submitted. The current type is `TEXT`.

### Evaluation

Represents the result of an evaluator. It owns criterion-level results and overall score.

### CriterionResult

Contains score, evidence, concern, suggestion and confidence for one rubric criterion.

## Important interfaces

```text
Evaluator
  ├── RuleBasedEvaluator
  └── AiEvaluator
```

`Evaluator` is the variation point because evaluation is expected to evolve.

The practice flow depends on the interface rather than a concrete evaluator.

## Attempt lifecycle

```text
DRAFT
  |
  v
SUBMITTED
  |
  v
EVALUATING
  |
  +------> COMPLETED
  |
  +------> FAILED
```

The submission is persisted before evaluation starts.

## Evaluation strategy

The default implementation is deterministic. It checks the presence and quality signals of required sections.

Optional AI feedback adds qualitative analysis. The LLM is given the problem, submission, and fixed rubric and is required to return structured JSON.

The application can continue operating if the AI provider is unavailable.

## Change test A: text → diagram

Today the learner uses `TextSubmission`.

Later:

```text
Submission
  ├── TextSubmission
  ├── DiagramSubmission
  └── CodeSubmission
```

The `Attempt` and evaluation flow do not need to be redesigned.

## Change test B: evaluator variation

Today:

```text
Evaluator
  └── RuleBasedEvaluator
```

Optional:

```text
Evaluator
  ├── RuleBasedEvaluator
  ├── AiEvaluator
  └── HumanEvaluator
```

A composite evaluator could combine deterministic and AI results.

## Why no microservices?

The assignment is explicitly an LLD exercise. At prototype scale, separate services add deployment and operational complexity without improving the learner loop.

If usage grows, the first extraction would be the evaluator worker because AI latency/failures have different operational characteristics from the synchronous practice API.

## Reliability considerations

- submission is stored before evaluation
- evaluation state is explicit
- evaluator errors become `FAILED`
- retry is supported
- deterministic evaluation provides a no-AI fallback
- JSON persistence makes the demo zero-config

## Known limitations

- no authentication
- single local JSON store
- no multi-user isolation
- no visual UML editor
- no code execution sandbox
- optional AI provider only
- deterministic scoring is intentionally heuristic

These are deliberate scope decisions for a two-day MVP.
