import { useState } from 'react';
import { riskApi } from './riskApi';

const dimensions = [
  ['privacyScore', 'Privacy Risk'], ['securityScore', 'Security Risk'], ['fairnessScore', 'Fairness / Bias Risk'],
  ['transparencyScore', 'Transparency Risk'], ['regulatoryScore', 'Regulatory Risk']
];

export default function RiskAssessmentForm({ system, onSaved, onCancel }) {
  const [scores, setScores] = useState(Object.fromEntries(dimensions.map(([key]) => [key, 50])));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const overall = Object.values(scores).reduce((a, b) => a + Number(b), 0) / dimensions.length;

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try { await riskApi.create({ aiSystemId: system.id, ...Object.fromEntries(Object.entries(scores).map(([k,v]) => [k, Number(v)])) }); onSaved(); }
    catch (err) { setError(err.message || 'Unable to save assessment.'); } finally { setSaving(false); }
  };

  return <section className="panel form-panel"><div className="panel-header"><div><h3>Risk Assessment</h3><p>{system.name} · Score each dimension from 0 to 100.</p></div></div>
    <form onSubmit={submit}><div className="risk-preview"><span>Current overall score</span><strong>{overall.toFixed(0)} / 100</strong></div>
      {dimensions.map(([key, label]) => <label key={key} className="score-field"><span>{label}<strong>{scores[key]}</strong></span><input type="range" min="0" max="100" value={scores[key]} onChange={e => setScores({...scores, [key]: e.target.value})}/><div className="range-labels"><span>Low risk</span><span>High risk</span></div></label>)}
      {error && <div className="error">{error}</div>}<div className="form-actions"><button type="button" className="secondary" onClick={onCancel}>Cancel</button><button className="primary" disabled={saving}>{saving ? 'Saving...' : 'Save Assessment'}</button></div>
    </form></section>;
}
