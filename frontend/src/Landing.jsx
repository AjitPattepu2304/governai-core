import { useState } from 'react';

export default function Landing({ onLogin, onRegister }) {
  return <div className="marketing-shell">
    <nav className="marketing-nav">
      <div className="marketing-brand"><div className="marketing-logo">G</div><strong>GovernAI</strong></div>
      <div className="marketing-nav-actions"><button className="link-button" onClick={onLogin}>Sign in</button><button className="nav-cta" onClick={onRegister}>Start free</button></div>
    </nav>
    <main>
      <section className="hero">
        <div className="hero-copy"><div className="pill">AI GOVERNANCE, WITHOUT THE SPREADSHEETS</div><h1>Know your AI.<br/><span>Govern it with confidence.</span></h1><p>GovernAI gives teams one place to inventory AI systems, assess risk, manage controls, collect evidence, and document governance decisions.</p><div className="hero-actions"><button className="hero-primary" onClick={onRegister}>Create your workspace <span>→</span></button><button className="hero-secondary" onClick={onLogin}>Sign in</button></div><div className="trust-row"><span>Risk assessment</span><span>Control tracking</span><span>Audit-ready evidence</span></div></div>
        <div className="hero-visual"><div className="glow"></div><div className="mock-window"><div className="mock-top"><span></span><span></span><span></span><b>GovernAI</b></div><div className="mock-content"><div className="mock-title"><div><small>AI GOVERNANCE</small><h3>Portfolio overview</h3></div><label>Last 30 days ▾</label></div><div className="mock-stats"><div><small>AI systems</small><strong>24</strong><em>+4 this month</em></div><div><small>High risk</small><strong>5</strong><em>2 need attention</em></div><div><small>Controls</small><strong>86%</strong><em>coverage</em></div></div><div className="mock-chart"><div className="chart-head"><b>Risk distribution</b><span>View details →</span></div><div className="bars"><i style={{height:'38%'}}></i><i style={{height:'62%'}}></i><i style={{height:'48%'}}></i><i style={{height:'78%'}}></i><i style={{height:'55%'}}></i><i style={{height:'88%'}}></i><i style={{height:'70%'}}></i></div></div></div></div></div>
      </section>
      <section className="feature-strip"><div><b>01</b><h3>Inventory</h3><p>Build a living registry of every AI system.</p></div><div><b>02</b><h3>Assess</h3><p>Turn system context into explainable risk.</p></div><div><b>03</b><h3>Govern</h3><p>Track controls, evidence, gaps, and decisions.</p></div></section>
    </main>
    <footer className="marketing-footer"><span>GovernAI</span><span>AI risk & governance workspace</span></footer>
  </div>;
}
