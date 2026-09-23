import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, History, Lightbulb, Play, RotateCcw, Sparkles, Target, TriangleAlert } from "lucide-react";
import { api } from "./api";

type Problem = {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  requirements: string[];
  hints: string[];
};

type Attempt = {
  id: string;
  problemId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  failureReason?: string;
  submission?: {
    id: string;
    type: string;
    createdAt: string;
    content: typeof emptyForm;
  };
  evaluation?: {
    overallScore: number;
    summary: string;
    evaluator: string;
    results: {
      criterionId: string;
      criterionName: string;
      score: number;
      maxScore: number;
      evidence: string;
      concern: string;
      suggestion: string;
      confidence: number;
    }[];
  };
};

const emptyForm = {
  requirements: "",
  classes: "",
  responsibilities: "",
  relationships: "",
  abstractions: "",
  patterns: "",
  decisions: "",
  edgeCases: ""
};

function App() {
  const [page, setPage] = useState<"home" | "practice" | "feedback" | "history">("home");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Problem[]>("/api/problems").then(setProblems).catch(e => setError(e.message));
    refreshAttempts();
  }, []);

  async function refreshAttempts() {
    try {
      setAttempts(await api<Attempt[]>("/api/attempts"));
    } catch {}
  }

  async function startPractice(p: Problem) {
    setError("");
    const a = await api<Attempt>("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ problemId: p.id })
    });
    setProblem(p);
    setAttempt(a);
    setForm(emptyForm);
    setPage("practice");
  }

  async function submit() {
    if (!attempt) return;
    setError("");
    try {
      const updated = await api<Attempt>(`/api/attempts/${attempt.id}/submit`, {
        method: "POST",
        body: JSON.stringify({ content: form })
      });
      setAttempt(updated);
      setPage("feedback");
      poll(updated.id);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function poll(id: string) {
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 700));
      const latest = await api<Attempt>(`/api/attempts/${id}`);
      setAttempt(latest);
      if (latest.status === "COMPLETED" || latest.status === "FAILED") {
        refreshAttempts();
        return;
      }
    }
  }

  async function retry() {
    if (!attempt || !problem) return;
    const next = await api<Attempt>(`/api/attempts/${attempt.id}/retry`, { method: "POST" });
    setAttempt(next);
    // Preserve the previous design so retry means "edit and improve",
    // not "start the same problem from an empty form".
    setForm(next.submission?.content ?? emptyForm);
    setPage("practice");
  }

  const recent = useMemo(() => attempts.slice(0, 5), [attempts]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setPage("home")}>
          <span className="brand-mark">D</span>
          <span>DesignLoop</span>
        </button>
        <nav>
          <button className={page === "home" ? "nav-active" : ""} onClick={() => setPage("home")}>Practice</button>
          <button className={page === "history" ? "nav-active" : ""} onClick={() => setPage("history")}>History</button>
        </nav>
      </header>

      {error && <div className="error-banner"><TriangleAlert size={17}/>{error}</div>}

      <main>
        {page === "home" && (
          <>
            <section className="hero">
              <div>
                <p className="eyebrow">LOW-LEVEL DESIGN PRACTICE</p>
                <h1>Design it. Submit it.<br/><span>Understand why.</span></h1>
                <p className="hero-copy">Practice real LLD problems and get evidence-based feedback on responsibilities, abstractions, coupling, extensibility and edge cases.</p>
                <button className="primary" onClick={() => document.getElementById("problems")?.scrollIntoView({ behavior: "smooth" })}>
                  Start practicing <ArrowRight size={18}/>
                </button>
              </div>
              <div className="hero-card">
                <div className="mini-label">YOUR PRACTICE LOOP</div>
                <div className="loop-step"><span>01</span><b>Choose a problem</b></div>
                <div className="loop-step"><span>02</span><b>Write your design</b></div>
                <div className="loop-step"><span>03</span><b>Get explainable feedback</b></div>
                <div className="loop-step"><span>04</span><b>Retry & improve</b></div>
              </div>
            </section>

            <section id="problems" className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PROBLEM LIBRARY</p>
                  <h2>Pick your next design challenge</h2>
                </div>
                <span className="count">{problems.length} problems</span>
              </div>
              <div className="problem-grid">
                {problems.map(p => (
                  <article className="problem-card" key={p.id}>
                    <div className="card-top">
                      <span className={`difficulty ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                      <Target size={20}/>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <ul>
                      {p.requirements.slice(0, 3).map(r => <li key={r}><CheckCircle2 size={15}/>{r}</li>)}
                    </ul>
                    <button className="outline" onClick={() => startPractice(p)}>Start Practice <Play size={15}/></button>
                  </article>
                ))}
              </div>
            </section>

            <section className="insight-strip">
              <Sparkles size={24}/>
              <div><b>Feedback is not just a score.</b><span>Every criterion explains what your design showed, what could be improved, and what to try next.</span></div>
            </section>

            <section className="section">
              <div className="section-heading">
                <div><p className="eyebrow">RECENT ATTEMPTS</p><h2>Your progress</h2></div>
                <button className="text-btn" onClick={() => setPage("history")}>View all <ArrowRight size={15}/></button>
              </div>
              {recent.length === 0 ? <div className="empty">No attempts yet. Pick a problem above to start.</div> :
                <div className="attempt-list">{recent.map(a => <AttemptRow key={a.id} attempt={a} problems={problems} onClick={() => {
                  const p = problems.find(x => x.id === a.problemId);
                  if (p) { setProblem(p); setAttempt(a); setPage(a.evaluation ? "feedback" : "practice"); }
                }}/>)}</div>}
            </section>
          </>
        )}

        {page === "practice" && problem && attempt && (
          <PracticePage problem={problem} form={form} setForm={setForm} onSubmit={submit} onBack={() => setPage("home")} />
        )}

        {page === "feedback" && problem && attempt && (
          <FeedbackPage problem={problem} attempt={attempt} onRetry={retry} onHome={() => setPage("home")} onHistory={() => { refreshAttempts(); setPage("history"); }} />
        )}

        {page === "history" && (
          <section className="section history-page">
            <div className="section-heading"><div><p className="eyebrow">PROGRESS</p><h1>Attempt history</h1></div><History size={28}/></div>
            <div className="attempt-list">
              {attempts.length === 0 ? <div className="empty">No attempts yet.</div> : attempts.map(a =>
                <AttemptRow key={a.id} attempt={a} problems={problems} onClick={() => {
                  const p = problems.find(x => x.id === a.problemId);
                  if (p) { setProblem(p); setAttempt(a); setPage(a.evaluation ? "feedback" : "practice"); }
                }}/>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function PracticePage({ problem, form, setForm, onSubmit, onBack }: any) {
  const fields = [
    ["requirements", "Requirements & Assumptions", "What are the actors, functional requirements and assumptions?"],
    ["classes", "Classes", "List the important classes, entities and value objects."],
    ["responsibilities", "Responsibilities", "For each class, explain what it owns and what it does."],
    ["relationships", "Relationships", "Describe composition, association, inheritance and dependency direction."],
    ["abstractions", "Interfaces & Abstractions", "Which behaviours should vary independently? Where would you use interfaces?"],
    ["patterns", "Patterns & Trade-offs", "Name patterns only when useful. Explain why you chose them and the trade-off."],
    ["decisions", "Key Design Decisions", "Explain the most important choices and how the design can evolve."],
    ["edgeCases", "Edge Cases & Testability", "List failure paths, invalid input, boundaries and important tests."]
  ];

  return <section className="practice-page">
    <div className="practice-header">
      <button className="back-btn" onClick={onBack}><ArrowLeft size={17}/> Back</button>
      <div><span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span><h1>{problem.title}</h1></div>
      <div className="practice-badge"><Clock3 size={15}/> Practice mode</div>
    </div>
    <div className="practice-layout">
      <aside className="problem-panel">
        <p className="eyebrow">PROBLEM</p>
        <h2>Requirements</h2>
        <p>{problem.description}</p>
        <ul className="requirement-list">{problem.requirements.map((r: string) => <li key={r}><CheckCircle2 size={16}/>{r}</li>)}</ul>
        <div className="hint-box"><Lightbulb size={18}/><div><b>Think about</b><p>{problem.hints[0]}</p></div></div>
      </aside>
      <div className="form-panel">
        <div className="form-intro"><div><p className="eyebrow">YOUR SOLUTION</p><h2>Make your design reviewable</h2></div><span>8 sections</span></div>
        <div className="form-grid">
          {fields.map(([key, title, help], index) => <label className="field" key={key}>
            <span><b>{index + 1}. {title}</b><small>{help}</small></span>
            <textarea value={form[key]} onChange={e => setForm((f: any) => ({...f, [key]: e.target.value}))} placeholder={`Write your ${title.toLowerCase()}...`} />
          </label>)}
        </div>
        <div className="submit-bar"><span>Feedback uses a fixed rubric and evidence from your submission.</span><button className="primary" onClick={onSubmit}>Submit for feedback <ArrowRight size={17}/></button></div>
      </div>
    </div>
  </section>;
}

function FeedbackPage({ problem, attempt, onRetry, onHome, onHistory }: any) {
  const done = attempt.status === "COMPLETED";
  return <section className="section feedback-page">
    <button className="back-btn" onClick={onHome}><ArrowLeft size={17}/> Back to practice</button>
    <div className="feedback-head">
      <div><p className="eyebrow">EVALUATION</p><h1>{problem.title}</h1><p className="muted">Attempt {attempt.id.slice(0, 8)}</p></div>
      {done && <div className="score-circle"><b>{attempt.evaluation.overallScore}</b><span>/ 100</span></div>}
    </div>

    {!done && attempt.status !== "FAILED" && <div className="evaluating"><div className="spinner"/><div><b>Evaluating your design…</b><p>Your submission is safely stored. We are checking it against the LLD rubric.</p><span>SUBMITTED → EVALUATING</span></div></div>}
    {attempt.status === "FAILED" && <div className="error-card"><TriangleAlert/><div><b>Evaluation failed</b><p>{attempt.failureReason}</p><button className="outline" onClick={() => window.location.reload()}>Retry page</button></div></div>}

    {done && <>
      <div className="summary-card"><Sparkles size={22}/><div><b>Overall feedback</b><p>{attempt.evaluation.summary}</p></div></div>
      <div className="criteria">
        {attempt.evaluation.results.map((r: any) => <article className="criterion" key={r.criterionId}>
          <div className="criterion-top"><div><h3>{r.criterionName}</h3><span>{Math.round(r.confidence * 100)}% confidence</span></div><strong>{r.score}/{r.maxScore}</strong></div>
          <div className="progress"><i style={{ width: `${(r.score/r.maxScore)*100}%` }}/></div>
          <div className="feedback-columns">
            <div><small>EVIDENCE</small><p>{r.evidence}</p></div>
            <div><small>CONCERN</small><p>{r.concern}</p></div>
            <div><small>NEXT STEP</small><p>{r.suggestion}</p></div>
          </div>
        </article>)}
      </div>
      <div className="retry-card"><div><p className="eyebrow">TRY AGAIN</p><h2>Turn feedback into a second attempt.</h2><p>Keep the same problem, change your design, and see whether the feedback improves.</p></div><button className="primary" onClick={onRetry}><RotateCcw size={17}/> New attempt</button></div>
      <div className="feedback-actions"><button className="outline" onClick={onHistory}>View history</button></div>
    </>}
  </section>;
}

function AttemptRow({ attempt, problems, onClick }: { attempt: Attempt; problems: Problem[]; onClick: () => void }) {
  const p = problems.find(x => x.id === attempt.problemId);
  return <button className="attempt-row" onClick={onClick}>
    <div className="attempt-icon"><Target size={18}/></div>
    <div className="attempt-main"><b>{p?.title || attempt.problemId}</b><span>{new Date(attempt.createdAt).toLocaleString()}</span></div>
    <span className={`status ${attempt.status.toLowerCase()}`}>{attempt.status}</span>
    {attempt.evaluation && <strong className="row-score">{attempt.evaluation.overallScore}</strong>}
    <ArrowRight size={17}/>
  </button>;
}

export default App;
