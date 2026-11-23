export default function Home() {
  return (
    <main className="page-shell" id="overview">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="QYX20 Interac Edition home">
          <img className="brand-lockup" src="/brand/qyx20-lockup.png" alt="QYX20 by QuantumYield" />
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-label">INTERAC EDITION</span>
        </a>
        <nav className="topbar-nav" aria-label="Page navigation">
          <a href="#concept">The concept</a>
          <a className="status" href="#project-status"><span className="status-dot" /> CONCEPT PREVIEW</a>
        </nav>
      </header>

      <section className="hero" id="concept" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span aria-hidden="true" /> QYX20 / INTERAC EDITION</p>
          <h1 id="hero-title">A considered<br /><span>exchange.</span></h1>
          <p className="description">A concept interface for the next chapter of Interac Edition.</p>
          <a className="action" href="#project-status">
            <span>Explore the concept</span>
            <span className="action-arrow" aria-hidden="true">↗</span>
          </a>
        </div>

        <figure className="identity-panel">
          <div className="identity-panel-header">
            <span className="panel-label">IDENTITY STUDY</span>
            <span className="panel-index">01 / 01</span>
          </div>
          <div className="identity-stage">
            <span className="stage-rule stage-rule-top" aria-hidden="true" />
            <img src="/brand/qyx20-lockup.png" alt="QYX20 by QuantumYield" width="208" height="79" />
            <span className="stage-rule stage-rule-bottom" aria-hidden="true" />
          </div>
          <figcaption>Concept artwork · QYX20</figcaption>
        </figure>
      </section>

      <section className="project-status" id="project-status" aria-label="Project status">
        <div className="status-heading">
          <span className="detail-label">PROJECT STATUS</span>
          <span className="status-marker" aria-hidden="true" />
        </div>
        <p>Concept preview <span aria-hidden="true">/</span> Product details to be defined</p>
        <span className="detail-code">INTERAC EDITION · 01</span>
      </section>

      <footer className="page-footer">
        <span>QYX20</span>
        <span className="footer-principle">PRECISION OVER DECORATION</span>
        <a href="#overview">Back to top <span aria-hidden="true">↑</span></a>
      </footer>
    </main>
  );
}
