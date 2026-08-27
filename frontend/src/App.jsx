import { useState } from 'react';

const systems = [
  { id: 1, name: 'Customer Support AI', owner: 'Engineering', risk: 'High', status: 'Assessment Due' },
  { id: 2, name: 'Fraud Detection Model', owner: 'Risk', risk: 'Medium', status: 'Compliant' },
  { id: 3, name: 'HR Assistant', owner: 'People', risk: 'High', status: 'Evidence Missing' }
];

function StatCard({ label, value }) {
  return <div className="stat-card"><span>{label}</span><strong>{value}</strong></div>;
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">G</div><div><h1>GovernAI</h1><small>AI Governance Platform</small></div></div>
        <nav>{['Dashboard', 'AI Systems', 'Assessments', 'Risks', 'Controls', 'Evidence', 'Audit Log'].map(item => <button key={item} className={activePage === item ? 'nav-item active' : 'nav-item'} onClick={() => setActivePage(item)}>{item}</button>)}</nav>
      </aside>
      <main className="content">
        <header><div><p className="eyebrow">AI GOVERNANCE</p><h2>{activePage}</h2><p className="subtitle">Monitor AI systems, risk, controls, and evidence.</p></div><button className="primary" onClick={() => setActivePage('AI Systems')}>+ Register AI System</button></header>
        {activePage === 'Dashboard' ? <>
          <section className="stats"><StatCard label="AI Systems" value="12"/><StatCard label="High Risks" value="3"/><StatCard label="Open Assessments" value="5"/><StatCard label="Compliance" value="82%"/></section>
          <section className="panel"><div className="panel-header"><div><h3>Recent AI Systems</h3><p>Current governance status</p></div><button className="text-button" onClick={() => setActivePage('AI Systems')}>View all →</button></div><div className="table-wrap"><table><thead><tr><th>AI System</th><th>Owner</th><th>Risk</th><th>Status</th></tr></thead><tbody>{systems.map(s => <tr key={s.id}><td><strong>{s.name}</strong></td><td>{s.owner}</td><td><span className={`badge ${s.risk.toLowerCase()}`}>{s.risk}</span></td><td>{s.status}</td></tr>)}</tbody></table></div></section>
        </> : <section className="panel empty"><div className="empty-icon">◆</div><h3>{activePage}</h3><p>This module is coming next. We will connect it to the Spring Boot API as we build each feature.</p><button className="primary" onClick={() => setActivePage('Dashboard')}>Back to Dashboard</button></section>}
      </main>
    </div>
  );
}

export default App;
