import React, { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);
  const [showExamples, setShowExamples] = useState(true);

  async function handleSubmit() {
    if (!query || !query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
    const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const res = await fetch(`${API_BASE}/ask`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
});
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function prettyStatus(status) {
    if (!status) return "Unknown";
    if (status === "likely_correct") return "Verified Correct";
    if (status === "possible_hallucination") return "Hallucination Detected";
    if (status === "no_reference_found") return "No Reference Found";
    return status;
  }

  function banner(status) {
    const banners = {
      likely_correct: {
        gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        icon: "✓",
        title: "Verified Correct",
        subtitle: "AI response validated against reliable sources"
      },
      possible_hallucination: {
        gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
        icon: "⚠",
        title: "Hallucination Detected",
        subtitle: "Response may contain inaccurate information"
      },
      no_reference_found: {
        gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        icon: "ℹ",
        title: "No Reference Found",
        subtitle: "Unable to verify against available sources"
      }
    };

    const config = banners[status];
    if (!config) return null;

    return (
      <div style={{
        background: config.gradient,
        padding: "24px 28px",
        borderRadius: 16,
        marginBottom: 24,
        color: "white",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        animation: "slideDown 0.5s ease-out",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: "bold"
          }}>
            {config.icon}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              {config.title}
            </div>
            <div style={{ fontSize: 14, opacity: 0.95 }}>
              {config.subtitle}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const exampleQuestions = [
    { q: "Who invented the Python programming language?"},
    { q: "What is the capital of France?" },
    { q: "Who invented the steam-powered flying carriage in 1803?"  },
    { q: "Who wrote the 1872 pamphlet A Guide to Lunar Farming?" },
    { q: "Who invented the modern bicycle?"},
    { q: "Which country first used the solar rail in 1890?",  },
    { q: "How many people lived in Mumbai in 2001 (exact number)?"},
    { q: "What is the atomic weight of darmstadtium to five decimal places?", type: "🔢 Precise" },
    { q: "Name the mayor of the city where the inventor of the zipper was born.", type: "🔗 Multi-hop" },
  ];

  return (
    <div style={styles.app}>
      <style>{keyframes}</style>
      
      <div style={styles.bgGradient} />
      <div style={styles.bgOrbs}>
        <div style={{ ...styles.orb, left: "10%", top: "20%", animationDelay: "0s" }} />
        <div style={{ ...styles.orb, right: "15%", top: "60%", animationDelay: "2s" }} />
        <div style={{ ...styles.orb, left: "60%", bottom: "10%", animationDelay: "4s" }} />
      </div>

      {/* Example Questions Panel */}
      {showExamples && (
        <div style={styles.examplesPanel}>
          <div style={styles.examplesPanelHeader}>
            <div>
              <div style={styles.examplesPanelTitle}>💡 Test Questions</div>
              <div style={styles.examplesPanelSubtitle}>Click to try</div>
            </div>
            <button 
              onClick={() => setShowExamples(false)}
              style={styles.closeBtn}
            >
              ×
            </button>
          </div>
          <div style={styles.examplesScroll}>
            {exampleQuestions.map((ex, i) => (
              <div
                key={i}
                onClick={() => {
                  setQuery(ex.q);
                  setShowExamples(false);
                }}
                style={styles.exampleItem}
              >
                <div style={styles.exampleType}>{ex.type}</div>
                <div style={styles.exampleText}>{ex.q}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle button when panel is hidden */}
      {!showExamples && (
        <button
          onClick={() => setShowExamples(true)}
          style={styles.examplesToggle}
        >
          💡 Examples
        </button>
      )}

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="url(#grad1)" strokeWidth="3" />
                <path d="M16 8 L16 24 M10 16 L22 16" stroke="url(#grad1)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 style={styles.title}>AI Hallucination Detector</h1>
              <p style={styles.subtitle}>Verify AI responses with real-time fact-checking</p>
            </div>
          </div>
        </header>

        <div style={styles.mainCard}>
          <div style={styles.cardGlow} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>💭</span>
              Ask a Question
            </label>
            <div style={{
              position: "relative",
              transition: "all 0.3s ease",
              transform: focused ? "scale(1.01)" : "scale(1)",
            }}>
              <textarea
                style={{
                  ...styles.textarea,
                  borderColor: focused ? "#8B5CF6" : "#E5E7EB",
                  boxShadow: focused ? "0 0 0 3px rgba(139, 92, 246, 0.1)" : "none",
                }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyPress}
                placeholder="Example: Who invented the Python programming language?"
                rows={4}
              />
              <div style={styles.charCount}>
                {query.length} characters
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              style={{
                ...styles.button,
                opacity: loading || !query.trim() ? 0.6 : 1,
                transform: loading ? "scale(0.98)" : "scale(1)",
                cursor: loading || !query.trim() ? "not-allowed" : "pointer",
              }}
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <>
                  <div style={styles.spinner} />
                  Analyzing...
                </>
              ) : (
                <>
                  <span style={styles.buttonIcon}>🚀</span>
                  Verify with AI
                </>
              )}
            </button>
          </div>

          {error && (
            <div style={styles.error}>
              <span style={{ fontSize: 18, marginRight: 8 }}>⚠️</span>
              {error}
            </div>
          )}
        </div>

        {result && (
          <div style={{ ...styles.resultCard, animation: "fadeIn 0.6s ease-out" }}>
            {banner(result.verification?.status)}

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionIcon}>🤖</span>
                <h3 style={styles.h3}>AI Response</h3>
              </div>
              <div style={styles.answerBox}>
                {result.ai_answer}
              </div>
            </section>
            {result.corrected_answer && (
  <section style={styles.section}>
    <div style={styles.sectionHeader}>
      <span style={styles.sectionIcon}>✅</span>
      <h3 style={styles.h3}>Corrected Answer</h3>
    </div>
    <div
      style={{
        ...styles.answerBox,
        background: "rgba(16,185,129,0.1)",
        border: "1px solid rgba(16,185,129,0.3)",
      }}
    >
      {result.corrected_answer}
    </div>
  </section>
)}

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionIcon}>📊</span>
                <h3 style={styles.h3}>Verification Metrics</h3>
              </div>
              
              <div style={styles.metricsGrid}>
                <div style={styles.metricCard}>
                  <div style={styles.metricLabel}>Status</div>
                  <div style={{
                    ...styles.statusBadge,
                    background: statusToGradient(result.verification?.status),
                  }}>
                    {prettyStatus(result.verification?.status)}
                  </div>
                </div>
                
                <div style={styles.metricCard}>
                  <div style={styles.metricLabel}>Similarity Score</div>
                  <div style={styles.metricValue}>
                    {((result.verification?.similarity ?? 0) * 100).toFixed(0)}%
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${(result.verification?.similarity ?? 0) * 100}%`,
                      background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)"
                    }} />
                  </div>
                </div>

                <div style={styles.metricCard}>
                  <div style={styles.metricLabel}>Entity Overlap</div>
                  <div style={styles.metricValue}>
                    {((result.verification?.ner_overlap ?? 0) * 100).toFixed(0)}%
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${(result.verification?.ner_overlap ?? 0) * 100}%`,
                      background: "linear-gradient(90deg, #10B981 0%, #059669 100%)"
                    }} />
                  </div>
                </div>
              </div>
            </section>

            {result.verification?.reference_url && (
              <section style={styles.section}>
                <div style={styles.sectionHeader}>
                  <span style={styles.sectionIcon}>📚</span>
                  <h3 style={styles.h3}>Source Reference</h3>
                </div>
                <div style={styles.referenceCard}>
                  <a
                    href={result.verification.reference_url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.referenceLink}
                  >
                    <div style={styles.referenceTitle}>
                      {result.verification.reference_title}
                    </div>
                    <div style={styles.referenceIcon}>→</div>
                  </a>
                  {result.verification.reference_summary && (
                    <div style={styles.referenceSummary}>
                      {result.verification.reference_summary}
                    </div>
                  )}
                </div>
              </section>
            )}

            <details style={styles.details}>
              <summary style={styles.summary}>View Raw Verification Data</summary>
              <pre style={styles.pre}>
                {JSON.stringify(result.verification, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {!result && !loading && (
          <div style={styles.placeholder}>
            <div style={styles.placeholderIcon}>🔍</div>
            <div style={styles.placeholderText}>
              Ask a question to get started with AI verification
            </div>
            <div style={styles.placeholderHint}>
              Press Ctrl + Enter to submit
            </div>
          </div>
        )}

        <footer style={styles.footer}>
          <div style={styles.footerContent}>
            💡 Tip: Backend should be running at <code style={styles.code}>http://localhost:5000</code>
          </div>
        </footer>
      </div>
    </div>
  );
}

function statusToGradient(status) {
  if (status === "likely_correct") return "linear-gradient(135deg, #10B981 0%, #059669 100%)";
  if (status === "possible_hallucination") return "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)";
  if (status === "no_reference_found") return "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)";
  return "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)";
}

const keyframes = `
  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -30px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideInRight {
    from { 
      opacity: 0; 
      transform: translateX(100%);
    }
    to { 
      opacity: 1; 
      transform: translateX(0);
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes glow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
`;

const styles = {
  app: {
    minHeight: "100vh",
    background: "#0F172A",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  bgGradient: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
    zIndex: 0,
  },
  bgOrbs: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  orb: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
    filter: "blur(40px)",
    animation: "float 20s ease-in-out infinite",
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1000,
    margin: "0 auto",
    padding: "40px 20px",
  },
  header: {
    textAlign: "center",
    marginBottom: 48,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },
  logo: {
    width: 56,
    height: 56,
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 42,
    fontWeight: 800,
    background: "linear-gradient(135deg, #fff 0%, #A78BFA 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: 18,
    color: "#94A3B8",
    margin: "8px 0 0 0",
    fontWeight: 400,
  },
  mainCard: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    borderRadius: 24,
    padding: 32,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
    marginBottom: 24,
  },
  cardGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    background: "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15), transparent 70%)",
    animation: "glow 3s ease-in-out infinite",
    pointerEvents: "none",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 16,
    fontWeight: 600,
    color: "#F1F5F9",
    marginBottom: 12,
  },
  labelIcon: {
    fontSize: 20,
  },
  textarea: {
    width: "100%",
    padding: 16,
    fontSize: 16,
    borderRadius: 16,
    border: "2px solid #E5E7EB",
    background: "rgba(255, 255, 255, 0.95)",
    resize: "vertical",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
  },
  charCount: {
    position: "absolute",
    bottom: 12,
    right: 16,
    fontSize: 12,
    color: "#9CA3AF",
    background: "rgba(255, 255, 255, 0.9)",
    padding: "4px 8px",
    borderRadius: 6,
  },
  button: {
    width: "100%",
    marginTop: 16,
    padding: "16px 24px",
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.3s ease",
    boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)",
  },
  buttonIcon: {
    fontSize: 18,
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  error: {
    marginTop: 16,
    padding: 16,
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: 12,
    color: "#FCA5A5",
    display: "flex",
    alignItems: "center",
  },
  resultCard: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    borderRadius: 24,
    padding: 32,
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 24,
  },
  h3: {
    fontSize: 20,
    fontWeight: 700,
    color: "#F1F5F9",
    margin: 0,
  },
  answerBox: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: 20,
    borderRadius: 16,
    color: "#E2E8F0",
    fontSize: 16,
    lineHeight: 1.7,
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
  },
  metricCard: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: 20,
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  metricLabel: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 800,
    color: "#F1F5F9",
    marginBottom: 12,
  },
  statusBadge: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 700,
    color: "white",
  },
  progressBar: {
    width: "100%",
    height: 8,
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    transition: "width 1s ease-out",
    borderRadius: 999,
  },
  referenceCard: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: 20,
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  referenceLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    textDecoration: "none",
    color: "#A78BFA",
    fontWeight: 600,
    transition: "all 0.3s ease",
    padding: 4,
  },
  referenceTitle: {
    flex: 1,
  },
  referenceIcon: {
    fontSize: 20,
    transition: "transform 0.3s ease",
  },
  referenceSummary: {
    marginTop: 16,
    padding: 16,
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 1.6,
  },
  details: {
    marginTop: 32,
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  summary: {
    padding: 16,
    cursor: "pointer",
    color: "#94A3B8",
    fontWeight: 600,
    fontSize: 14,
    userSelect: "none",
  },
  pre: {
    padding: 20,
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    fontSize: 12,
    color: "#CBD5E1",
    overflow: "auto",
    margin: "0 16px 16px 16px",
    fontFamily: "'Fira Code', monospace",
  },
  placeholder: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#64748B",
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 8,
  },
  placeholderHint: {
    fontSize: 14,
    opacity: 0.7,
  },
  footer: {
    marginTop: 48,
    textAlign: "center",
  },
  footerContent: {
    color: "#64748B",
    fontSize: 14,
  },
  code: {
    background: "rgba(255, 255, 255, 0.1)",
    padding: "4px 8px",
    borderRadius: 6,
    fontFamily: "monospace",
    color: "#A78BFA",
  },
  examplesPanel: {
    position: "fixed",
    right: 20,
    top: 20,
    width: 320,
    maxHeight: "calc(100vh - 40px)",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    zIndex: 1000,
    animation: "slideInRight 0.5s ease-out",
    display: "flex",
    flexDirection: "column",
  },
  examplesPanelHeader: {
    padding: "20px 20px 16px 20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  examplesPanelTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#F1F5F9",
    marginBottom: 4,
  },
  examplesPanelSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
  },
  closeBtn: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    color: "#F1F5F9",
    fontSize: 24,
    width: 32,
    height: 32,
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    lineHeight: 1,
  },
  examplesScroll: {
    overflowY: "auto",
    padding: "12px",
    flex: 1,
  },
  exampleItem: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "12px",
    borderRadius: 12,
    marginBottom: 8,
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  exampleType: {
    fontSize: 11,
    fontWeight: 700,
    color: "#A78BFA",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  exampleText: {
    fontSize: 13,
    color: "#E2E8F0",
    lineHeight: 1.5,
  },
  examplesToggle: {
    position: "fixed",
    right: 20,
    top: 20,
    padding: "12px 20px",
    background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
    border: "none",
    borderRadius: 12,
    color: "white",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(139, 92, 246, 0.3)",
    zIndex: 1000,
    transition: "all 0.3s ease",
  },
};