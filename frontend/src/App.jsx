import { useEffect, useState } from 'react';
import { aiSystemsApi } from './api';

function StatCard({ label, value }) {
  return <div className="stat-card"><span>{label}</span><strong>{value}</strong></div>;
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', purpose: '', owner: '', businessUnit: '', riskLevel: 'MEDIUM' });

  const loadSystems = async () => {
    setLoading(true); setError('');
    try { setSystems(await aiSystemsApi.list()); }
    catch (e) { setError('Backend unavailable. Start Spring Boot on port 8080.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadSystems(); }, []);

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const createSystem = async (event) => {
    event.preventDefault(); setError('');
    try {
      await aiSystemsApi.create(form);
      setForm({ name: '', purpose: '', owner: '', businessUnit: '', riskLevel: 'MEDIUM' });
      await loadSystems();
      setActivePage('AI Systems');
    } catch (e) { setError(e.message || 'Unable to register AI system.'); }
  };

  const highRisks = systems.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL').length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">G</div><div><h1>GovernAI</h1><small>AI Governance Platform</small></div></div>
        <nav>{['Dashboard', 'AI Systems', 'Assessments', 'Risks', 'Controls', 'Evidence', 'Audit Log'].map(item => <button key={item} className={activePage === item ? 'nav-item active' : 'nav-item'} onClick={() => setActivePage(item)}>{item}</button>)}</nav>
      </aside>
      <main className="content">
        <header><div><p className="eyebrow">AI GOVERNANCE</p><h2>{activePage}</h2><p className="subtitle">Monitor AI systems, risk, controls, and evidence.</p></div><button className="primary" onClick={() => setActivePage('Register AI System')}>+ Register AI System</button></header>
        {error && <div className="error">{error}</div>}
        {activePage === 'Dashboard' && <>
          <section className="stats"><StatCard label="AI Systems" value={systems.length}/><StatCard label="High Risks" value={highRisks}/><StatCard label="Open Assessments" value="0"/><StatCard label="Compliance" value="—"/></section>
          <section className="panel"><div className="panel-header"><div><h3>AI Systems</h3><p>Live data from the Spring Boot API</p></div><button className="text-button" onClick={() => setActivePage('AI Systems')}>View all →</button></div><SystemTable systems={systems} loading={loading}/></section>
        </>}
        {activePage === 'AI Systems' && <section className="panel"><div className="panel-header"><div><h3>Registered AI Systems</h3><p>Systems stored in PostgreSQL</p></div><button className="primary" onClick={() => setActivePage('Register AI System')}>+ Register</button></div><SystemTable systems={systems} loading={loading}/></section>}
        {activePage === 'Register AI System' && <section className="panel form-panel"><div className="panel-header"><div><h3>Register AI System</h3><p>Create a governance record for an AI application.</p></div></div><form onSubmit={createSystem}><label>Name<input name="name" value={form.name} onChange={updateField} required placeholder="Customer Support AI"/></label><label>Purpose<textarea name="purpose" value={form.purpose} onChange={updateField} required placeholder="Describe what this AI system does..."/></label><div className="form-grid"><label>Owner<input name="owner" value={form.owner} onChange={updateField} required placeholder="Engineering"/></label><label>Business Unit<input name="businessUnit" value={form.businessUnit} onChange={updateField} required placeholder="Customer Service"/></label><label>Risk Level<select name="riskLevel" value={form.riskLevel} onChange={updateField}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></label></div><div className="form-actions"><button type="button" className="secondary" onClick={() => setActivePage('Dashboard')}>Cancel</button><button className="primary" type="submit">Register AI System</button></div></form></section>}
        {['Assessments', 'Risks', 'Controls', 'Evidence', 'Audit Log'].includes(activePage) && <section className="panel empty"><div className="empty-icon">◆</div><h3>{activePage}</h3><p>This module comes next. The AI System Registry is now connected to the backend.</p><button className="primary" onClick={() => setActivePage('Dashboard')}>Back to Dashboard</button></section>}
      </main>
    </div>
  );
}

function SystemTable({ systems, loading }) {
  if (loading) return <div className="table-state">Loading AI systems...</div>;
  if (!systems.length) return <div className="table-state">No AI systems registered yet.</div>;
  return <div className="table-wrap"><table><thead><tr><th>AI System</th><th>Owner</th><th>Business Unit</th><th>Risk</th><th>Status</th></tr></thead><tbody>{systems.map(s => <tr key={s.id}><td><strong>{s.name}</strong><div className="purpose">{s.purpose}</div></td><td>{s.owner}</td><td>{s.businessUnit}</td><td><span className={`badge ${s.riskLevel.toLowerCase()}`}>{s.riskLevel}</span></td><td>{s.status}</td></tr>)}</tbody></table></div>;
}

export default App;
