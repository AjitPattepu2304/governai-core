import {useState} from 'react';
import {authApi} from './api';

export default function AuthPage({mode, onAuthenticated, onBack, onSwitch}) {
    const register = mode === 'register';
    const [form, setForm] = useState(register ? {
        name: '',
        email: '',
        password: '',
        organizationName: '',
        countryCode: 'IN'
    } : {email: '', password: ''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const update = e => setForm({...form, [e.target.name]: e.target.value});
    const submit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = register ? await authApi.register(form) : await authApi.login(form);
            onAuthenticated(user)
        } catch (err) {
            setError(err.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    };
    return <div className="auth-shell">
        <div className="auth-side">
            <button className="back-brand" onClick={onBack}><span
                className="marketing-logo">G</span><strong>GovernAI</strong></button>
            <div className="auth-side-copy">
                <div className="pill">AI GOVERNANCE PLATFORM</div>
                <h1>Make every AI decision <span>accountable.</span></h1><p>Bring AI inventory, risk, controls, and
                evidence into one focused workspace.</p>
                <div className="auth-points">
                    <div><b>✓</b><span>Understand AI risk before deployment</span></div>
                    <div><b>✓</b><span>Keep evidence tied to controls</span></div>
                    <div><b>✓</b><span>Build an audit-ready governance trail</span></div>
                </div>
            </div>
            <small className="auth-note">GovernAI provides governance tooling and risk analysis, not legal
                certification.</small></div>
        <div className="auth-main">
            <div className="auth-card">
                <button className="mobile-back" onClick={onBack}>← GovernAI</button>
                <div className="auth-header">
                    <div className="auth-mark">G</div>
                    <h2>{register ? 'Create your workspace' : 'Welcome back'}</h2>
                    <p>{register ? 'Set up your organization and start governing AI systems.' : 'Sign in to your GovernAI workspace.'}</p>
                </div>
                <form onSubmit={submit}>{register && <><label>Full name<input name="name" value={form.name}
                                                                              onChange={update} required
                                                                              placeholder="Alex Morgan"/></label><label>Organization<input
                    name="organizationName" value={form.organizationName} onChange={update} required
                    placeholder="Acme Inc."/></label><label>Organization country<select name="countryCode"
                                                                                        value={form.countryCode}
                                                                                        onChange={update}>
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                </select></label></>}<label>Work email<input type="email" name="email" value={form.email}
                                                             onChange={update} required placeholder="you@company.com"/></label><label>Password<input
                    type="password" name="password" value={form.password} onChange={update} required minLength="8"
                    placeholder="At least 8 characters"/></label>{error && <div className="auth-error">{error}</div>}
                    <button className="auth-submit"
                            disabled={loading}>{loading ? (register ? 'Creating workspace...' : 'Signing in...') : (register ? 'Create workspace' : 'Sign in')}
                        <span>→</span></button>
                </form>
                <div className="auth-switch">{register ? 'Already have an account?' : 'New to GovernAI?'}
                    <button onClick={onSwitch}>{register ? 'Sign in' : 'Create an account'}</button>
                </div>
            </div>
        </div>
    </div>;
}
