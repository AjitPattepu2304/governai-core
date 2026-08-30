import {useEffect, useState} from 'react';
import {aiSystemsApi, authApi} from './api';
import Landing from './Landing';
import AuthPage from './AuthPage';
import RiskAssessmentForm from './RiskAssessmentForm';

const COUNTRY_OPTIONS = [{code: 'US', label: 'United States'}, {code: 'CA', label: 'Canada'}, {
    code: 'IN',
    label: 'India'
}];
const AI_TYPES = [['GENERATIVE_AI', 'Generative AI'], ['PREDICTIVE_ML', 'Predictive ML'], ['COMPUTER_VISION', 'Computer Vision'], ['RECOMMENDATION', 'Recommendation'], ['OTHER', 'Other']];
const LIFECYCLES = [['DEVELOPMENT', 'Development'], ['TESTING', 'Testing'], ['PRODUCTION', 'Production'], ['RETIRED', 'Retired']];
const IMPACTS = [['LOW', 'Low'], ['MEDIUM', 'Medium'], ['HIGH', 'High'], ['CRITICAL', 'Critical']];
const OVERSIGHT = [['NONE', 'None'], ['HUMAN_REVIEW', 'Human review'], ['HUMAN_APPROVAL', 'Human approval']];

function StatCard({label, value}) {
    return <div className="stat-card"><span>{label}</span><strong>{value}</strong></div>
}

function App() {
    const [user, setUser] = useState(undefined);
    const [authMode, setAuthMode] = useState('landing');
    const [activePage, setActivePage] = useState('Dashboard');
    const [systems, setSystems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [assessmentSystem, setAssessmentSystem] = useState(null);
    const emptyForm = {
        name: '',
        purpose: '',
        owner: '',
        businessUnit: '',
        riskLevel: 'MEDIUM',
        countries: ['IN'],
        aiType: 'GENERATIVE_AI',
        lifecycle: 'PRODUCTION',
        decisionImpact: 'MEDIUM',
        humanOversight: 'HUMAN_REVIEW',
        personalData: false,
        sensitiveData: false,
        externalAiProvider: false
    };
    const [form, setForm] = useState(emptyForm);
    useEffect(() => {
        authApi.me().then(setUser).catch(() => setUser(null))
    }, []);
    const loadSystems = async () => {
        setLoading(true);
        setError('');
        try {
            setSystems(await aiSystemsApi.list())
        } catch (e) {
            setError('Unable to load AI systems.')
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        if (user) loadSystems()
    }, [user]);
    if (user === undefined) return <div className="boot-screen">
        <div className="marketing-logo">G</div>
        <strong>GovernAI</strong></div>;
    if (!user) {
        if (authMode === 'landing') return <Landing onLogin={() => setAuthMode('login')}
                                                    onRegister={() => setAuthMode('register')}/>;
        return <AuthPage mode={authMode} onBack={() => setAuthMode('landing')}
                         onSwitch={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                         onAuthenticated={setUser}/>
    }
    const updateField = e => setForm({
        ...form,
        [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
    const toggleCountry = code => setForm({
        ...form,
        countries: form.countries.includes(code) ? form.countries.filter(c => c !== code) : [...form.countries, code]
    });
    const createSystem = async e => {
        e.preventDefault();
        setError('');
        if (!form.countries.length) {
            setError('Select at least one country.');
            return
        }
        try {
            await aiSystemsApi.create(form);
            setForm(emptyForm);
            await loadSystems();
            setActivePage('AI Systems')
        } catch (e) {
            setError(e.message || 'Unable to register AI system.')
        }
    };
    const highRisks = systems.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL').length;
    const logout = async () => {
        await authApi.logout();
        setUser(null);
        setAuthMode('landing')
    };
    return <div className="app-shell">
        <aside className="sidebar">
            <div className="brand">
                <div className="logo">G</div>
                <div><h1>GovernAI</h1><small>AI Governance</small></div>
            </div>
            <nav>{['Dashboard', 'AI Systems', 'Assessments', 'Risks', 'Controls', 'Evidence', 'Audit Log'].map(item =>
                <button key={item} className={activePage === item ? 'nav-item active' : 'nav-item'}
                        onClick={() => setActivePage(item)}>{item}</button>)}</nav>
            <div className="user-card">
                <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <div><strong>{user.name}</strong><small>{user.organizationName}</small></div>
                <button onClick={logout} title="Sign out">↗</button>
            </div>
        </aside>
        <main className="content">
            <header>
                <div><p className="eyebrow">AI GOVERNANCE</p><h2>{activePage}</h2><p className="subtitle">Monitor AI
                    systems, risk, controls, and evidence.</p></div>
                <button className="primary" onClick={() => setActivePage('Register AI System')}>+ Register AI System
                </button>
            </header>
            {error && <div className="error">{error}</div>}
            {activePage === 'Dashboard' && <>
                <section className="stats"><StatCard label="AI Systems" value={systems.length}/><StatCard
                    label="High Risks" value={highRisks}/><StatCard label="Open Assessments" value="0"/><StatCard
                    label="Control Coverage" value="—"/></section>
                <section className="panel">
                    <div className="panel-header">
                        <div><h3>AI Systems</h3><p>Live inventory for {user.organizationName}</p></div>
                        <button className="text-button" onClick={() => setActivePage('AI Systems')}>View all →</button>
                    </div>
                    <SystemTable systems={systems} loading={loading} onAssess={setAssessmentSystem}/></section>
            </>}
            {activePage === 'AI Systems' && <section className="panel">
                <div className="panel-header">
                    <div><h3>Registered AI Systems</h3><p>Systems in your organization</p></div>
                    <button className="primary" onClick={() => setActivePage('Register AI System')}>+ Register</button>
                </div>
                <SystemTable systems={systems} loading={loading} onAssess={setAssessmentSystem}/></section>}
            {activePage === 'Register AI System' && <section className="panel form-panel">
                <div className="panel-header">
                    <div><h3>Register AI System</h3><p>Create a governance record for an AI application.</p></div>
                </div>
                <form onSubmit={createSystem}><label>Name<input name="name" value={form.name} onChange={updateField}
                                                                required
                                                                placeholder="Customer Support AI"/></label><label>Purpose<textarea
                    name="purpose" value={form.purpose} onChange={updateField} required
                    placeholder="Describe what this AI system does..."/></label>
                    <div className="form-grid"><label>Owner<input name="owner" value={form.owner} onChange={updateField}
                                                                  required placeholder="Engineering"/></label><label>Business
                        Unit<input name="businessUnit" value={form.businessUnit} onChange={updateField} required
                                   placeholder="Customer Service"/></label><label>Risk Level<select name="riskLevel"
                                                                                                    value={form.riskLevel}
                                                                                                    onChange={updateField}>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                    </select></label></div>
                    <fieldset className="country-fieldset">
                        <legend>Countries where the AI system operates</legend>
                        <div className="country-grid">{COUNTRY_OPTIONS.map(c => <label className="country-option"
                                                                                       key={c.code}><input
                            type="checkbox" checked={form.countries.includes(c.code)}
                            onChange={() => toggleCountry(c.code)}/><span>{c.label}</span></label>)}</div>
                        <small>Select every country where the system is deployed, processes data, or serves
                            users.</small></fieldset>
                    <div className="context-section"><h3>AI System Context</h3><p>These factors will drive the
                        governance risk evaluation.</p>
                        <div
                            className="form-grid">{[["aiType", "AI Type", AI_TYPES], ["lifecycle", "Lifecycle", LIFECYCLES], ["decisionImpact", "Decision Impact", IMPACTS], ["humanOversight", "Human Oversight", OVERSIGHT]].map(([n, l, o]) =>
                            <label key={n}>{l}<select name={n} value={form[n]} onChange={updateField}>{o.map(([v, t]) =>
                                <option key={v} value={v}>{t}</option>)}</select></label>)}</div>
                        <div
                            className="toggle-grid">{[["personalData", "Processes personal data"], ["sensitiveData", "Processes sensitive data"], ["externalAiProvider", "Uses an external AI provider"]].map(([n, l]) =>
                            <label className="toggle-option" key={n}><input type="checkbox" name={n} checked={form[n]}
                                                                            onChange={updateField}/><span>{l}</span></label>)}</div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="secondary" onClick={() => setActivePage('Dashboard')}>Cancel
                        </button>
                        <button className="primary">Register AI System</button>
                    </div>
                </form>
            </section>}
            {activePage === 'Assessments' && <section className="panel empty">
                <div className="empty-icon">◆</div>
                <h3>Risk Assessments</h3><p>Select an AI system from the AI Systems page to run an explainable risk
                evaluation.</p>
                <button className="primary" onClick={() => setActivePage('AI Systems')}>Choose AI System</button>
            </section>}
            {['Risks', 'Controls', 'Evidence', 'Audit Log'].includes(activePage) && <section className="panel empty">
                <div className="empty-icon">◆</div>
                <h3>{activePage}</h3><p>This governance module is coming next.</p>
                <button className="primary" onClick={() => setActivePage('Dashboard')}>Back to Dashboard</button>
            </section>}
            {assessmentSystem && <RiskAssessmentForm system={assessmentSystem} onSaved={() => {
                setAssessmentSystem(null);
                setActivePage('Assessments')
            }} onCancel={() => setAssessmentSystem(null)}/>}</main>
    </div>
}

function SystemTable({systems, loading, onAssess}) {
    if (loading) return <div className="table-state">Loading AI systems...</div>;
    if (!systems.length) return <div className="table-state">No AI systems registered yet.</div>;
    return <div className="table-wrap">
        <table>
            <thead>
            <tr>
                <th>AI System</th>
                <th>Owner</th>
                <th>Business Unit</th>
                <th>Countries</th>
                <th>Risk</th>
                <th>Status</th>
                <th></th>
            </tr>
            </thead>
            <tbody>{systems.map(s => <tr key={s.id}>
                <td><strong>{s.name}</strong>
                    <div className="purpose">{s.purpose}</div>
                </td>
                <td>{s.owner}</td>
                <td>{s.businessUnit}</td>
                <td>{(s.countries || []).join(', ')}</td>
                <td><span className={`badge ${s.riskLevel.toLowerCase()}`}>{s.riskLevel}</span></td>
                <td>{s.status}</td>
                <td>
                    <button className="text-button" onClick={() => onAssess(s)}>Assess risk</button>
                </td>
            </tr>)}</tbody>
        </table>
    </div>
}

export default App;
