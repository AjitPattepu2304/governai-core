import { useState } from 'react';
import { riskApi } from './riskApi';

export default function RiskAssessmentForm({ system, onSaved, onCancel }) {
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const evaluate = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const assessment = await riskApi.create({ aiSystemId: system.id });
      setResult(assessment);
    } catch (err) { setError(err.message || 'Unable to evaluate AI system.'); }
    finally { setSaving(false); }
  };

  const label = value => value ? value.replaceAll('_', ' ') : '—';

  return <section className="panel form-panel">
    <div className="panel-header"><div><h3>AI Risk Evaluation</h3><p>{system.name} · GovernAI Risk Engine v1</p></div></div>
    <div className="context-summary">
      <h4>Evaluation context</h4>
      <div className="context-grid">
        <span><b>AI Type</b>{label(system.aiType)}</span>
        <span><b>Lifecycle</b>{label(system.lifecycle)}</span>
        <span><b>Decision Impact</b>{label(system.decisionImpact)}</span>
        <span><b>Human Oversight</b>{label(system.humanOversight)}</span>
        <span><b>Countries</b>{(system.countries || []).join(', ') || '—'}</span>
        <span><b>Personal Data</b>{system.personalData ? 'Yes' : 'No'}</span>
        <span><b>Sensitive Data</b>{system.sensitiveData ? 'Yes' : 'No'}</span>
        <span><b>External Provider</b>{system.externalAiProvider ? 'Yes' : 'No'}</span>
      </div>
    </div>
    {!result && <form onSubmit={evaluate}>
      <div className="info-box"><strong>No manual scores required.</strong><p>GovernAI calculates the assessment from the registered AI system context. The result is deterministic and includes an explanation and methodology version.</p></div>
      {error && <div className="error">{error}</div>}
      <div className="form-actions"><button type="button" className="secondary" onClick={onCancel}>Cancel</button><button className="primary" disabled={saving}>{saving ? 'Evaluating...' : 'Run Risk Evaluation'}</button></div>
    </form>}
    {result && <div className="evaluation-result">
      <div className="risk-preview"><span>Overall Risk Score</span><strong>{result.overallScore} / 100</strong><b>{result.riskLevel}</b></div>
      <div className="score-grid">
        {[[result.privacyScore,'Privacy'],[result.securityScore,'Security'],[result.fairnessScore,'Fairness / Bias'],[result.transparencyScore,'Transparency'],[result.regulatoryScore,'Regulatory']].map(([score,name]) => <div className="score-card" key={name}><span>{name}</span><strong>{score}</strong><small>/ 100</small></div>)}
      </div>
      <div className="info-box"><strong>Why this result?</strong><p>{result.explanation}</p><small>Methodology: {result.methodologyVersion}</small></div>
      <div className="form-actions"><button className="primary" onClick={onSaved}>Done</button></div>
    </div>}
  </section>;
}
