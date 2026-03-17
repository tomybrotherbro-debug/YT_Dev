import { useState } from 'react'
import axios from 'axios'

const LANGUAGES = [
  { id: 'tanglish', label: '🇮🇳 Tanglish' },
  { id: 'tamil', label: 'தமிழ் Tamil' },
  { id: 'english', label: '🇬🇧 English' },
  { id: 'hindi', label: '🇮🇳 Hindi' },
]

type SummaryMode = 'openai' | 'chatgpt-link' | 'demo' | ''

function App() {
  const [url, setUrl] = useState('')
  const [language, setLanguage] = useState('tanglish')
  const [transcript, setTranscript] = useState('')
  const [summary, setSummary] = useState('')
  const [summaryMode, setSummaryMode] = useState<SummaryMode>('')
  const [loadingTranscript, setLoadingTranscript] = useState(false)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const API_URL = import.meta.env.VITE_API_URL || ''

  const handleFetchTranscript = async () => {
    if (!url.trim()) return
    setError('')
    setTranscript('')
    setSummary('')
    setLoadingTranscript(true)
    try {
      const res = await axios.post(`${API_URL}/api/transcript`, { url })
      setTranscript(res.data.transcript)
      setStep(2)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch transcript. Please check the URL.')
    } finally {
      setLoadingTranscript(false)
    }
  }

  const handleSummarize = async () => {
    if (!transcript) return
    setError('')
    setSummary('')
    setLoadingSummary(true)
    try {
      const res = await axios.post(`${API_URL}/api/summarize`, { transcript, language })
      // res.data.summary is from OpenAI/Demo, res.data.prompt is from ChatGPT link fallback
      setSummary(res.data.summary || res.data.prompt)
      setSummaryMode(res.data.mode as SummaryMode)
      setStep(3)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to summarize. Please try again.')
    } finally {
      setLoadingSummary(false)
    }
  }

  const handleReset = () => {
    setUrl('')
    setTranscript('')
    setSummary('')
    setError('')
    setSummaryMode('')
    setStep(1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleFetchTranscript()
  }

  const modeBadgeLabel: Record<SummaryMode, string> = {
    'openai': '🔑 OpenAI API',
    'chatgpt-link': '🔗 ChatGPT Direct',
    'demo': '🟡 Demo Mode',
    '': '',
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">▶</div>
            <span className="logo-text">YT Tanglish</span>
          </div>
          <div className="header-badge">
            <span className="badge-dot" />
            YouTube AI Summarizer
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-tag">✨ AI-Powered • Tanglish Support</div>
        <h1 className="hero-title">
          Summarize YouTube<br />
          <span>in Tanglish</span>
        </h1>
        <p className="hero-subtitle">
          Paste any YouTube video URL and generate an instant summary via OpenAI or securely open it directly in ChatGPT.
        </p>
      </section>

      {/* Main */}
      <main className="main-content">

        {/* Step 1: URL Input */}
        <div className="card">
          <div className="card-title">Step 1 — Enter YouTube URL</div>
          <div className="url-input-wrapper">
            <input
              id="youtube-url-input"
              className="url-input"
              type="url"
              placeholder="https://www.youtube.com/watch?v=... or /shorts/..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loadingTranscript}
            />
            <button
              id="fetch-transcript-btn"
              className="btn-primary"
              onClick={handleFetchTranscript}
              disabled={loadingTranscript || !url.trim()}
            >
              {loadingTranscript ? <><span className="spinner" /> Fetching...</> : '⚡ Get Transcript'}
            </button>
          </div>

          {error && (
            <div className="error-box" id="error-message">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Step 2: Transcript + Summarize */}
        {transcript && (
          <div className="card" id="transcript-section">
            <div className="card-title">Step 2 — Transcript Fetched ✓</div>

            <div className="transcript-box" id="transcript-text">
              {transcript}
            </div>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">Choose language</span>
              <div className="divider-line" />
            </div>

            <div className="lang-options">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  id={`lang-${lang.id}`}
                  className={`lang-chip ${language === lang.id ? 'active' : ''}`}
                  onClick={() => setLanguage(lang.id)}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {loadingSummary && (
              <div className="progress-bar-wrapper">
                <div className="progress-label">
                  <span className="spinner" style={{ width: 14, height: 14 }} />
                  <span>Preparing transcript for AI...</span>
                </div>
                <div className="progress-track" style={{ animationDuration: '2s' }}>
                  <div className="progress-fill" />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                id="summarize-btn"
                className="btn-primary"
                onClick={handleSummarize}
                disabled={loadingSummary}
              >
                {loadingSummary ? <><span className="spinner" /> Loading...</> : '🤖 Summarize using ChatGPT'}
              </button>
              <button className="btn-secondary" onClick={handleReset}>
                ↩ Reset
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Summary / Prompt Link */}
        {summary && (
          <div className="card" id="summary-section">
            <div className="summary-header">
              <div className="summary-label">
                {summaryMode === 'chatgpt-link' ? '📝 Generated Prompt for ChatGPT' : '🧠 AI Summary'}
              </div>
              {summaryMode && (
                <span className={`mode-badge mode-${summaryMode}`} id="summary-mode-badge">
                  {modeBadgeLabel[summaryMode]}
                </span>
              )}
            </div>

            {summaryMode === 'chatgpt-link' ? (
              <div className="chatgpt-link-container" style={{ marginBottom: '1.5rem', background: 'rgba(16, 163, 127, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(16, 163, 127, 0.3)' }}>
                <p style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 500 }}>
                  Great! Your prompt is ready. Click the button below to open ChatGPT with your transcript pre-filled.
                </p>
                <a 
                  href={`https://chatgpt.com/?q=${encodeURIComponent(summary)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-flex', background: 'linear-gradient(135deg, #10a37f, #0b8063)', textDecoration: 'none', border: 'none', boxShadow: '0 4px 15px rgba(16, 163, 127, 0.4)' }}
                >
                  🚀 Open in ChatGPT
                </a>
              </div>
            ) : null}

            <div className="summary-box" id="summary-text">
              {summary}
            </div>
            
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn-secondary"
                onClick={() => navigator.clipboard.writeText(summary)}
                id="copy-summary-btn"
              >
                📋 {summaryMode === 'chatgpt-link' ? 'Copy Prompt' : 'Copy Summary'}
              </button>
              <button className="btn-secondary" onClick={handleReset}>
                ↩ Start Over
              </button>
            </div>
          </div>
        )}

      </main>

      {/* How it works */}
      {step === 1 && (
        <section className="steps">
          {[
            { num: '1', title: 'Paste URL', desc: 'Enter any YouTube video link in the search box' },
            { num: '2', title: 'Fetch Transcript', desc: 'We extract the full captions from the video' },
            { num: '3', title: 'Get Summary', desc: 'Auto-generate a prompt and open it in ChatGPT' },
          ].map(s => (
            <div className="step" key={s.num}>
              <div className="step-num">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>YT Tanglish — Made with ❤️ for Tamil YouTube lovers • {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
