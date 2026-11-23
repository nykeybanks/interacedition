export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="QYX20 Interac Edition home">
          <span className="brand-mark">Q</span>
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-label">INTERAC EDITION</span>
        </a>
        <span className="status"><span className="status-dot" /> CONCEPT PREVIEW</span>
      </header>

      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span /> QYX20 / INTERAC EDITION</p>
          <h1 id="hero-title">A considered<br /><span>exchange.</span></h1>
          <p className="description">A concept interface for the next chapter of Interac Edition.</p>
          <a className="action" href="#about">Explore the concept <span aria-hidden="true">↗</span></a>
        </div>
        <div className="artwork" aria-label="QYX20 visual identity">
          <div className="artwork-ring ring-one" />
          <div className="artwork-ring ring-two" />
          <img src="/brand/qyx20-lockup.png" alt="QYX20" />
          <span className="artwork-index">QYX20 — 01</span>
        </div>
      </section>

      <section className="detail" id="about" aria-label="Project status">
        <span className="detail-label">PROJECT STATUS</span>
        <p>Concept preview <span aria-hidden="true">/</span> Product details to be defined</p>
        <span className="detail-code">INTERACEDITION</span>
      </section>
      <footer><span>QYX20</span><span>PRECISION OVER DECORATION</span><span>CONCEPT / 01</span></footer>
    </main>
  );
}
