import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';

function HomePage() {
  const { copy, language } = useLanguage();
  const { listings, session } = useMarketplace();
  const h = copy.home;

  const stats = [
    { value: listings.length, label: language === 'ar' ? 'منتجات متاحة' : 'Active Listings' },
    { value: '100%', label: language === 'ar' ? 'بائعون موثقون' : 'Verified Sellers' },
    { value: 'BHD', label: language === 'ar' ? 'تسعير محلي للبحرين' : 'Local BHD Pricing' },
    { value: '3', label: language === 'ar' ? 'أدوار النظام' : 'System Roles' },
  ];

  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: language === 'ar' ? 'دفع آمن بالضمان' : 'Escrow-Protected Payments',
      desc: language === 'ar' ? 'يُحتفظ بالأموال حتى تأكيد التسليم.' : 'Funds are held until delivery is confirmed.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: language === 'ar' ? 'تتبع الشحنة' : 'Live Shipment Tracking',
      desc: language === 'ar' ? 'مزامنة حالة كل طلب بشكل مباشر.' : 'Every order status synced in real time.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: language === 'ar' ? 'التحقق من البائع' : 'Seller Verification',
      desc: language === 'ar' ? 'يُقبل البائعون فقط بعد مراجعة الهوية.' : 'Sellers are only accepted after identity review.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: language === 'ar' ? 'دعم النزاعات' : 'Dispute Support',
      desc: language === 'ar' ? 'مراسلة مدمجة لكل طلب ودعم.' : 'Built-in messaging per order and support thread.',
    },
  ];

  return (
    <main className="home-page">
      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="home-hero-content">
          <p className="section-kicker">{h.kicker}</p>
          <h1 className="home-hero-title">{h.title}</h1>
          <p className="home-hero-lead">{h.summary}</p>
          <div className="home-hero-actions">
            <Link to="/browse" className="button button-primary home-cta-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {h.browseCta}
            </Link>
            {!session && (
              <Link to="/sign-up" className="button button-ghost home-cta-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                {language === 'ar' ? 'إنشاء حساب' : 'Create Account'}
              </Link>
            )}
            {session?.role === 'seller' && (
              <Link to="/seller" className="button button-ghost home-cta-btn">
                {h.sellerCta}
              </Link>
            )}
          </div>

          {/* Status pills */}
          <div className="home-status-pills">
            {h.statusBand.map((s) => (
              <span key={s} className="home-status-pill">
                <span className="home-status-dot" aria-hidden="true" />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Hero card */}
        <div className="home-hero-card">
          <p className="card-label">{h.pulseLabel}</p>
          <h3>{h.pulseTitle}</h3>
          <ol className="home-workflow-list">
            {h.workflowSteps.map((step, i) => (
              <li key={i}>
                <span className="home-workflow-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Stats band ── */}
      <section className="home-stats-band">
        {stats.map((stat) => (
          <div key={stat.label} className="home-stat-item">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section className="home-features-section">
        <header className="home-section-header">
          <p className="section-kicker">{h.trustKicker}</p>
          <h2>{h.trustTitle}</h2>
        </header>
        <div className="home-features-grid">
          {features.map((f) => (
            <article key={f.title} className="home-feature-card">
              <div className="home-feature-icon">{f.icon}</div>
              <strong>{f.title}</strong>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Featured Listings ── */}
      <section className="home-listings-section">
        <header className="home-section-header home-section-header-row">
          <div>
            <p className="section-kicker">{h.featuredKicker}</p>
            <h2>{h.featuredTitle}</h2>
          </div>
          <Link to="/browse" className="button button-ghost home-view-all-btn">
            {language === 'ar' ? 'عرض الكل' : 'View all listings'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </header>
        <div className="listing-grid">
          {listings.length > 0
            ? listings.slice(0, 3).map((listing) => (
                <ListingCard listing={listing} key={listing.id} />
              ))
            : (
              <article className="queue-card">
                <p>{copy.common.noResults}</p>
              </article>
            )}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="home-how-section">
        <header className="home-section-header">
          <p className="section-kicker">{h.pulseLabel}</p>
          <h2>{language === 'ar' ? 'كيف تعمل السوق؟' : 'How the marketplace works'}</h2>
        </header>
        <div className="home-steps-grid">
          {h.workflowSteps.map((step, i) => (
            <div key={i} className="home-step-card">
              <div className="home-step-num">{i + 1}</div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Operating Rails ── */}
      <section className="home-rails-section">
        <header className="home-section-header">
          <p className="section-kicker">{h.railsLabel}</p>
          <h2>{h.railsTitle}</h2>
        </header>
        <div className="home-rails-grid">
          {h.operatingRails.map((rail) => (
            <article key={rail.label} className="home-rail-card">
              <strong>{rail.label}</strong>
              <p>{rail.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Seller CTA ── */}
      {!session && (
        <section className="home-seller-cta">
          <div className="home-seller-cta-copy">
            <p className="section-kicker">{h.sellerHubKicker}</p>
            <h2>{h.sellerHubTitle}</h2>
            <p className="home-hero-lead">{h.sellerHubSummary}</p>
            <ul className="home-feature-list">
              {h.sellerFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="home-hero-actions" style={{ marginTop: '1.5rem' }}>
              <Link to="/sign-up" className="button button-primary">
                {language === 'ar' ? 'انضم كبائع' : 'Join as a Seller'}
              </Link>
              <Link to="/browse" className="button button-ghost">
                {language === 'ar' ? 'تصفح كمشترٍ' : 'Browse as Buyer'}
              </Link>
            </div>
          </div>
          <div className="home-seller-cta-visual" aria-hidden="true">
            <div className="home-seller-cta-glow" />
            <div className="home-seller-metrics">
              {[
                { label: language === 'ar' ? 'قوائم نشطة' : 'Live listings', value: listings.length },
                { label: language === 'ar' ? 'معدل الموافقة' : 'Approval rate', value: '98%' },
                { label: language === 'ar' ? 'دفع سريع' : 'Fast payout', value: '24h' },
              ].map((m) => (
                <div key={m.label} className="home-seller-metric">
                  <strong>{m.value}</strong>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default HomePage;
