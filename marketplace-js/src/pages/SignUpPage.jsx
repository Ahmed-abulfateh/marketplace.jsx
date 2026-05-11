import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import logoSrc from '../assets/logo.png';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';

function SignUpPage() {
  const { copy, language, translateRoleLabel } = useLanguage();
  const { isReady, session, signUp } = useMarketplace();
  const navigate = useNavigate();
  const publicRoles = ['buyer', 'seller'];
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'buyer',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isReady) {
    return <main className="loading-shell">{copy.common.loading}</main>;
  }
  if (session) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp(form);
      navigate('/', { replace: true });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : copy.signUp.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel auth-panel-narrow">
        <div className="auth-logo-lockup">
          <img src={logoSrc} alt={copy.layout.brand} className="auth-logo-img" />
          <span className="auth-brand-name">{copy.layout.brand}</span>
          <div style={{ marginInlineStart: 'auto' }}><LanguageSwitcher /></div>
        </div>

        <p className="section-kicker">{copy.signUp.kicker}</p>
        <h1 style={{ margin: '0.4rem 0 0', fontSize: 'clamp(1.6rem, 3vw, 2rem)' }}>{copy.signUp.title}</h1>
        <p className="lead page-lead" style={{ marginTop: '0.6rem', fontSize: '0.95rem' }}>{copy.signUp.summary}</p>

        {error && <p className="form-notice form-notice-error">{error}</p>}

        <form className="form-grid auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-two-col">
            <div className="form-field">
              <label className="section-kicker" htmlFor="signup-username">
                {language === 'ar' ? 'اسم المستخدم' : 'Username'}
              </label>
              <input
                id="signup-username"
                value={form.username}
                onChange={(e) => setForm((c) => ({ ...c, username: e.target.value }))}
                placeholder={copy.signUp.username}
                autoComplete="username"
                required
              />
            </div>
            <div className="form-field">
              <label className="section-kicker" htmlFor="signup-phone">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone number'}
              </label>
              <input
                id="signup-phone"
                value={form.phone}
                onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))}
                placeholder={copy.signUp.phone}
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label className="section-kicker" htmlFor="signup-email">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
            </label>
            <input
              id="signup-email"
              value={form.email}
              onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
              type="email"
              placeholder={copy.signUp.email}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label className="section-kicker" htmlFor="signup-password">
              {language === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              id="signup-password"
              value={form.password}
              onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
              type="password"
              placeholder={copy.signUp.password}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-field">
            <label className="section-kicker" htmlFor="role-select">
              {copy.signUp.role}
            </label>
            <select
              id="role-select"
              value={form.role}
              onChange={(e) => setForm((c) => ({ ...c, role: e.target.value }))}
            >
              {publicRoles.map((role) => (
                <option key={role} value={role}>{translateRoleLabel(role)}</option>
              ))}
            </select>
          </div>

          <div className="card-actions auth-actions" style={{ marginTop: '0.5rem' }}>
            <button type="submit" className="button button-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? (language === 'ar' ? 'جارٍ الإنشاء…' : 'Creating account…') : copy.signUp.submit}
            </button>
          </div>

          <p style={{ margin: '0.75rem 0 0', textAlign: 'center', fontSize: '0.88rem', color: 'var(--muted)' }}>
            {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
            <Link to="/sign-in" style={{ color: 'var(--accent-strong)', textDecoration: 'none' }}>
              {copy.signUp.haveAccount}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default SignUpPage;
