# Research Note

## 1. Learner problem

LLD practice has a feedback gap. A learner can read a problem such as Parking Lot or Elevator, produce a design, and still be unsure whether the design is maintainable or extensible. The hard part is not only finding a solution; it is understanding *why* a responsibility belongs in one class rather than another.

The most useful practice loop is therefore:

> Choose → Design → Submit → Receive evidence-based feedback → Review → Retry

The MVP focuses on that loop rather than becoming an LMS.

## 2. Existing approaches reviewed

### LLDCanvas

LLDCanvas combines an LLD problem library with a UML editor, interview mode, design patterns, and practice workflows. Its public site emphasizes visual modeling and structured LLD practice. This validates that learners benefit from seeing relationships and practicing repeatedly.

Source: https://www.lldcanvas.in/

### Hello Interview

Hello Interview's guided LLD practice includes problems such as Connect Four, Elevator, Parking Lot, and File System, and describes personalized feedback as part of guided practice.

Source: https://www.hellointerview.com/practice/low-level-design

### InstaMock

InstaMock offers AI-assisted LLD mock interviews and describes feedback around SOLID principles, design patterns, extensibility, and readability.

Source: https://instamock.in/lld

### Low Level Design Mastery

Low Level Design Mastery presents a workflow of selecting a problem, drawing a diagram, writing code, and receiving AI feedback. It also highlights problem libraries and class diagrams.

Source: https://www.lowleveldesignmastery.com/

## 3. Gaps and opportunity

The common pattern across these products is repeated practice plus feedback. For a two-day engineering prototype, attempting to reproduce a complete visual editor, code execution engine, community system, and large problem library would dilute the core experience.

A focused MVP can instead make feedback the differentiator:

1. Ask for structured evidence of the learner's design.
2. Evaluate against a stable rubric.
3. Explain the evidence behind each result.
4. Suggest one concrete improvement.
5. Ask the learner to retry with a changed requirement.

## 4. Product direction

The prototype uses four classic LLD problems:
- Parking Lot
- Elevator System
- Vending Machine
- Library Management

The learner submits a structured design containing:
- requirements/assumptions
- classes
- responsibilities
- relationships
- interfaces/abstractions
- patterns
- key decisions
- edge cases

This is intentionally smaller than a full diagram editor but gives the evaluator enough information to reason about the design.

## 5. Evaluation principle

There is rarely one universally correct LLD. Therefore the evaluator should not compare the learner to one reference implementation.

The MVP uses dimensions such as:
- requirement understanding
- responsibilities
- abstraction
- coupling/cohesion
- extensibility
- patterns/trade-offs
- edge cases/testability

The feedback should point to evidence in the learner's answer.

## 6. Key product hypothesis

A learner improves faster when feedback is:
- specific
- tied to their own design
- actionable
- repeatable across attempts

Therefore attempt history is a first-class feature rather than simply storing a final score.
