import React from 'react';
import './HealthInfo.css';

const Link = ({ href, children }) => (
  <a className="hi-link" href={href} target="_blank" rel="noreferrer">{children}</a>
);

const HealthInfo = ({ onBack }) => {
  return (
    <div className="hi-wrap">
      <header className="hi-header">
        {onBack && (
          <button className="hi-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
        )}
        <h1 className="hi-title">Healthy Desk — Official Guidance & Standards</h1>
        <p className="hi-sub">
          Curated summaries and links to Australian government guidance and relevant standards for workstation setup.
        </p>
      </header>

      <main className="hi-main">
        <section className="hi-card">
          <h2>Quick Setup Principles</h2>
          <ul className="hi-list">
            <li>Adjust chair, desk and monitor to reduce awkward/sustained postures and repetition.</li>
            <li>Top of the monitor about eye height; screen roughly 50–75&nbsp;cm away (adjust for comfort/vision).</li>
            <li>Keyboard/mouse at about elbow height with shoulders relaxed; keep wrists neutral.</li>
            <li>Feet supported (flat on floor or footrest); take regular micro-breaks and vary tasks.</li>
            <li>Minimise glare and poor lighting; place screen side-on to windows where possible.</li>
          </ul>
          <p className="hi-note">
            These align with Australian WHS guidance on office ergonomics and display-screen work.
          </p>
        </section>

        <section className="hi-card">
          <h2>Authoritative Guidance (Australia)</h2>
          <ul className="hi-links">
            <li>
              Safe Work Australia — <Link href="https://www.safeworkaustralia.gov.au/sites/default/files/2023-07/workstation-set-up_infographic_july2023.pdf">Workstation set-up infographic (PDF)</Link>
            </li>
            <li>
              Model Code of Practice — <Link href="https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-work-environment-and-facilities">Managing the work environment and facilities</Link>
            </li>
            <li>
              WorkSafe Victoria — <Link href="https://www.worksafe.vic.gov.au/office-health-and-safety-office-layout-and-design">Office layout & workstation design</Link> and
              <Link href="https://www.worksafe.vic.gov.au/resources/compliance-code-workplace-facilities-and-working-environment"> Compliance Code: Workplace facilities & environment</Link>
            </li>
            <li>
              Comcare — <Link href="https://www.comcare.gov.au/office-safety-tool/spaces/work-areas/computers-workstations">Computers & workstations (Office Safety Tool)</Link>
            </li>
            <li>
              WorkSafe Queensland — <Link href="https://www.worksafe.qld.gov.au/safety-and-prevention/hazards/hazardous-manual-tasks/working-with-computers/setting-up-your-workstation">Setting up your workstation</Link>
            </li>
            <li>
              WorkSafe WA — <Link href="https://www.worksafe.wa.gov.au/office-ergonomics">Office ergonomics overview</Link> and
              <Link href="https://www.worksafe.wa.gov.au/system/files/migrated/sites/default/files/atoms/files/workstation_ergonomics_self-assessment_.pdf"> self-assessment checklist (PDF)</Link>
            </li>
          </ul>
        </section>

        <section className="hi-card">
          <h2>Relevant Product Standards (FYI)</h2>
          <p className="hi-text">
            While full standards are paid/licensed, the titles below help when specifying furniture:
          </p>
          <ul className="hi-list">
            <li>
              <strong>AS/NZS&nbsp;4438:1997</strong> — Height-adjustable swivel chairs (commonly referenced for office seating).
              See overviews from <Link href="https://www.officeseating.com.au/afrdi-certified-chairs">AFRDI</Link> or a public sample on Normsplash:
              <Link href="https://www.normsplash.com/Samples/AS/161362296/AS-NZS-4438-1997-%28R2016%29-en.pdf"> preview</Link>.
            </li>
            <li>
              <strong>AS/NZS&nbsp;4442:2018</strong> — Office desks/workstations mechanical & dimensional requirements.
              See info from <Link href="https://www.furntech.org.au/pdf/CommercialFurniture/OtherThanChairs/4442info.pdf">Furntech/AFRDI</Link> or
              <Link href="https://www.standards.govt.nz/shop/asnzs-44422018"> Standards NZ listing</Link>.
            </li>
          </ul>
          <p className="hi-note">If you’re buying furniture, look for AFRDI “Blue Tick” certifications for robustness and safety.</p>
        </section>

        <section className="hi-card">
          <h2>Practical Checks You Can Do</h2>
          <ol className="hi-list">
            <li>Seat height lets thighs stay roughly parallel; knees ~90°; feet supported.</li>
            <li>Backrest supports the natural lumbar curve; use a small cushion if needed.</li>
            <li>Desk/keyboard at about elbow height with relaxed shoulders.</li>
            <li>Monitor top around eye level; tilt slightly; keep at comfortable distance.</li>
            <li>Reduce glare with blinds/positioning; ensure adequate ambient light.</li>
            <li>Use short breaks every 20–30 min for posture resets and eye rest.</li>
          </ol>
        </section>
      </main>
    </div>
  );
};

export default HealthInfo;
