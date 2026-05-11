import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import logoSrc from '../assets/logo.png';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';

function SignInPage() {
  const { copy, language } = useLanguage();
  const { isReady, session, signIn } = useMarketplace();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isReady) {
    return <main className="loading-shell">{copy.common.loading}</main>;
  }
  if (session) {
    return <Navigate to="/" replace />;
  }

  const redirectTo = location.state?.from ?? '/';

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(form);
      navigate(redirectTo, { replace: true });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : copy.signIn.error);
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

        <p className="section-kicker">{copy.signIn.kicker}</p>
        <h1 style={{ margin: '0.4rem 0 0', fontSize: 'clamp(1.6rem, 3vw, 2rem)' }}>{copy.signIn.title}</h1>
        <p className="lead page-lead" style={{ marginTop: '0.6rem', fontSize: '0.95rem' }}>{copy.signIn.summary}</p>

        {error && <p className="form-notice form-notice-error">{error}</p>}

        <form className="form-grid auth-form" onSubmit={handleSignIn}>
          <div className="form-field">
            <label className="section-kicker" htmlFor="signin-identifier">
              {language === 'ar' ? 'البريد الإلكتروني أو الهاتف' : 'Email or phone'}
            </label>
            <input
              id="signin-identifier"
              value={form.identifier}
              onChange={(e) => setForm((c) => ({ ...c, identifier: e.target.value }))}
              placeholder={copy.signIn.identifier}
              autoComplete="username"
              required
            />
          </div>
          <div className="form-field">
            <label className="section-kicker" htmlFor="signin-password">
              {language === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              id="signin-password"
              value={form.password}
              onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
              type="password"
              placeholder={copy.signIn.password}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="card-actions auth-actions" style={{ marginTop: '0.5rem' }}>
            <button type="submit" className="button button-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? (language === 'ar' ? 'جارٍ تسجيل الدخول…' : 'Signing in…') : copy.signIn.submit}
            </button>
          </div>

          <p style={{ margin: '0.75rem 0 0', textAlign: 'center', fontSize: '0.88rem', color: 'var(--muted)' }}>
            {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
            <Link to="/sign-up" style={{ color: 'var(--accent-strong)', textDecoration: 'none' }}>
              {copy.signIn.createAccount}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default SignInPage;
