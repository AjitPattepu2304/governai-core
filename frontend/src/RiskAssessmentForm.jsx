import {useState} from 'react';
import {riskApi} from './riskApi';
import './risk-assessment.css';

const label = value => value ? value.replaceAll('_', ' ') : '—';
const yesNo = value => value ? 'Yes' : 'No';

const dimensions = [
    ['privacyScore', 'Privacy'],
    ['securityScore', 'Security'],
    ['fairnessScore', 'Fairness / Bias'],
    ['transparencyScore', 'Transparency'],
    ['regulatoryScore', 'Regulatory']
];

const contextItems = [
    ['aiType', 'AI Type'],
    ['lifecycle', 'Lifecycle'],
    ['decisionImpact', 'Decision Impact'],
    ['humanOversight', 'Human Oversight'],
    ['countries', 'Countries'],
    ['personalData', 'Personal Data'],
    ['sensitiveData', 'Sensitive Data'],
    ['externalAiProvider', 'External Provider']
];

function riskTone(score) {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
}

function riskLevelTone(level) {
    const normalized = String(level || '').toLowerCase();
    return normalized === 'critical' ? 'high' : normalized || 'medium';
}

function contextValue(system, key) {
    if (key === 'countries') return (system.countries || []).join(', ') || '—';
    if (['personalData', 'sensitiveData', 'externalAiProvider'].includes(key)) return yesNo(system[key]);
    return label(system[key]);
}

export default function RiskAssessmentForm({system, onSaved, onCancel}) {
    const [result, setResult] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const evaluate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const assessment = await riskApi.create({aiSystemId: system.id});
            setResult(assessment);
        } catch (err) {
            setError(err.message || 'Unable to evaluate AI system.');
        } finally {
            setSaving(false);
        }
    };

    const overall = Number(result?.overallScore ?? 0);
    const overallTone = result ? riskLevelTone(result.riskLevel) : 'medium';

    return (
        <section className="risk-assessment panel form-panel">
            <div className="risk-assessment-header">
                <div>
                    <p className="risk-kicker">GOVERNANCE ASSESSMENT</p>
                    <h3>AI Risk Evaluation</h3>
                    <p>{system.name} <span>·</span> GovernAI Risk Engine v1</p>
                </div>
                {result && <span className={`risk-status risk-status-${overallTone}`}>{result.riskLevel}</span>}
            </div>

            <div className="risk-context">
                <div className="risk-section-heading">
                    <div>
                        <h4>Evaluation context</h4>
                        <p>Risk is calculated from the registered AI system characteristics.</p>
                    </div>
                </div>
                <div className="risk-context-grid">
                    {contextItems.map(([key, title]) => (
                        <div className="risk-context-item" key={key}>
                            <span>{title}</span>
                            <strong>{contextValue(system, key)}</strong>
                        </div>
                    ))}
                </div>
            </div>

            {!result && (
                <form className="risk-run-form" onSubmit={evaluate}>
                    <div className="risk-info-card">
                        <div className="risk-info-icon">✓</div>
                        <div>
                            <strong>No manual scores required</strong>
                            <p>GovernAI will evaluate this system using the registered context and save an auditable
                                assessment with methodology version.</p>
                        </div>
                    </div>
                    {error && <div className="error">{error}</div>}
                    <div className="form-actions">
                        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
                        <button className="primary"
                                disabled={saving}>{saving ? 'Evaluating...' : 'Run Risk Evaluation →'}</button>
                    </div>
                </form>
            )}

            {result && (
                <div className="risk-result">
                    <section className={`risk-overall risk-overall-${overallTone}`}>
                        <div>
                            <span className="risk-overall-label">Overall risk score</span>
                            <p>Combined assessment across five governance dimensions</p>
                        </div>
                        <div className="risk-overall-value">
                            <strong>{result.overallScore}</strong><span>/ 100</span>
                        </div>
                        <span className={`risk-status risk-status-${overallTone}`}>{result.riskLevel}</span>
                    </section>

                    <section className="risk-dimensions">
                        <div className="risk-section-heading">
                            <div>
                                <h4>Risk dimensions</h4>
                                <p>Higher scores indicate greater assessed risk.</p>
                            </div>
                        </div>
                        <div className="risk-score-grid">
                            {dimensions.map(([key, name]) => {
                                const score = Number(result[key] ?? 0);
                                const tone = riskTone(score);
                                return (
                                    <div className="risk-score-card" key={key}>
                                        <div className="risk-score-top">
                                            <span>{name}</span>
                                            <span
                                                className={`risk-mini-status risk-mini-${tone}`}>{tone.toUpperCase()}</span>
                                        </div>
                                        <div className="risk-score-number"><strong>{score}</strong><span>/ 100</span>
                                        </div>
                                        <div className="risk-score-track"><span
                                            className={`risk-score-fill risk-fill-${tone}`}
                                            style={{width: `${Math.min(score, 100)}%`}}/></div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="risk-explanation">
                        <div className="risk-section-heading">
                            <div>
                                <h4>Why this result?</h4>
                                <p>Assessment rationale generated by the current methodology.</p>
                            </div>
                        </div>
                        <div className="risk-explanation-body">
                            <p>{result.explanation}</p>
                        </div>
                    </section>

                    <div className="risk-methodology">
                        <span>Methodology</span>
                        <strong>GovernAI Risk Engine {result.methodologyVersion}</strong>
                    </div>

                    <div className="form-actions risk-result-actions">
                        <button className="primary" onClick={onSaved}>Done</button>
                    </div>
                </div>
            )}
        </section>
    );
}
