import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Layout({ children }) {
  return (
    <div className="app">
      <header className="nav">
        <Link className="brand" to="/">Proof<span>Pass</span></Link>
        <div className="navlinks">
          <Link to="/verify">Verify</Link>
          <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </header>
      {children}
      <footer>ProofPass AI · Evidence → Hash → Proof</footer>
    </div>
  );
}

function Home() {
  return (
    <Layout>
      <main className="hero">
        <div className="eyebrow">AI × CRYPTO · TRUST LAYER</div>
        <h1>Turn digital claims<br /><em>into verifiable proof.</em></h1>
        <p className="lead">
          ProofPass analyzes supporting evidence with AI, creates a cryptographic
          fingerprint, and optionally anchors that proof on-chain.
        </p>
        <div className="actions">
          <Link className="button primary" to="/verify">Create a proof →</Link>
          <a className="button ghost" href="#how">How it works</a>
        </div>
        <div className="hero-grid">
          <div><strong>01</strong><span>AI evidence analysis</span></div>
          <div><strong>02</strong><span>SHA-256 integrity proof</span></div>
          <div><strong>03</strong><span>Optional blockchain anchor</span></div>
        </div>
      </main>
      <section id="how" className="section">
        <div>
          <div className="eyebrow">THE FLOW</div>
          <h2>Evidence, not empty claims.</h2>
        </div>
        <div className="flow">
          <div className="flowcard"><b>Claim</b><span>What do you want to prove?</span></div>
          <div className="arrow">→</div>
          <div className="flowcard"><b>Evidence</b><span>What supports the claim?</span></div>
          <div className="arrow">→</div>
          <div className="flowcard"><b>Proof</b><span>Hash + optional on-chain record.</span></div>
        </div>
      </section>
    </Layout>
  );
}

function Verify() {
  const [claim, setClaim] = useState("");
  const [evidence, setEvidence] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim, evidence, sourceUrl })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Verification failed");
      navigate(`/proof/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <main className="formpage">
        <div className="eyebrow">CREATE PROOF</div>
        <h1>What are you trying to verify?</h1>
        <p className="lead small">
          Give ProofPass a claim and the evidence supporting it. The AI assessment
          is informational; the hash records the exact submitted evidence.
        </p>
        <form onSubmit={submit} className="form">
          <label>
            Claim
            <input value={claim} onChange={e => setClaim(e.target.value)}
              placeholder="e.g. I built this project." required />
          </label>
          <label>
            Supporting evidence
            <textarea value={evidence} onChange={e => setEvidence(e.target.value)}
              placeholder="Explain the evidence that supports the claim..." required />
          </label>
          <label>
            Source URL <span>(optional)</span>
            <input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)}
              placeholder="https://github.com/..." />
          </label>
          {error && <div className="error">{error}</div>}
          <button className="button primary wide" disabled={loading}>
            {loading ? "Analyzing evidence…" : "Analyze & create proof →"}
          </button>
        </form>
      </main>
    </Layout>
  );
}

function Proof() {
  const { id } = useParams();
  const [proof, setProof] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/proofs/${id}`)
      .then(r => r.json())
      .then(data => data.error ? setError(data.error) : setProof(data))
      .catch(e => setError(e.message));
  }, [id]);

  if (error) return <Layout><main className="formpage"><h1>Proof not found</h1><p>{error}</p></main></Layout>;
  if (!proof) return <Layout><main className="formpage"><p>Loading proof…</p></main></Layout>;

  const a = proof.analysis;
  return (
    <Layout>
      <main className="proofpage">
        <div className="status"><span>✓</span> PROOF CREATED</div>
        <h1>{proof.claim}</h1>
        <div className="scorecard">
          <div>
            <span className="muted">AI assessment</span>
            <strong>{a.score}/100</strong>
            <b>{a.verdict.replaceAll("_", " ")}</b>
          </div>
          <div>
            <span className="muted">Integrity fingerprint</span>
            <code>{proof.proofHash}</code>
            <b>SHA-256</b>
          </div>
          <div>
            <span className="muted">Blockchain</span>
            <strong>{proof.chain.anchored ? "ANCHORED" : "DEMO MODE"}</strong>
            <b>{proof.chain.network || "Not configured"}</b>
          </div>
        </div>
        <section className="report">
          <h2>Verification report</h2>
          <p>{a.summary}</p>
          <ul>{a.findings.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
        {proof.sourceUrl && (
          <a className="source" href={proof.sourceUrl} target="_blank" rel="noreferrer">
            View source evidence ↗
          </a>
        )}
        {proof.chain.txHash && (
          <div className="tx">
            <span>Transaction</span>
            <code>{proof.chain.txHash}</code>
          </div>
        )}
        <Link className="button ghost" to="/verify">Create another proof</Link>
      </main>
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/proof/:id" element={<Proof />} />
    </Routes>
  );
}
