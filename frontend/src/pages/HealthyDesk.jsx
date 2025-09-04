import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HealthyDesk.css";


/* --------------------------------------------------------------------------
 * Initial form state
 * -------------------------------------------------------------------------- */
const initialForm = {
  heightCm: 165,
  screenDistanceCm: 60,
  monitorTopAtEye: "yes",
  keyboardAtElbow: "yes",
  feetSupported: "yes",
  chairLumbar: "yes",
  glare: "no",
  breakEveryMins: 30,
};

const HealthyDesk = () => {
  const navigate = useNavigate();

  /* ------------------------------------------------------------------------
   * UI state
   *  - form: live, local-only (no persistence)
   *  - showTips: collapsible "How to estimate" section
   *  - submitted: controls layout (form-only vs. form + results)
   * ------------------------------------------------------------------------ */
  const [form, setForm] = useState(initialForm);
  const [showTips, setShowTips] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  /* ------------------------------------------------------------------------
   * Field helpers
   * ------------------------------------------------------------------------ */
  const onNumber = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: Number(e.target.value) || 0 }));

  const onSelect = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: e.target.value }));

  /* ------------------------------------------------------------------------
   * Derived elbow height (simple anthropometric estimate)
   * ------------------------------------------------------------------------ */
  const elbowHeight = useMemo(
    () => Math.round(form.heightCm * 0.62),
    [form.heightCm]
  );

  /* ------------------------------------------------------------------------
   * Scoring + verdict (static guidance, calculated on the fly)
   * ------------------------------------------------------------------------ */
  const { score, verdict, details } = useMemo(() => {
    let s = 0;
    const det = [];

    if (form.screenDistanceCm >= 50 && form.screenDistanceCm <= 75) {
      s += 10;
      det.push({ ok: true, text: "Screen distance looks comfortable (50–75 cm)." });
    } else {
      det.push({ ok: false, text: "Adjust screen to ~50–75 cm to reduce strain." });
    }

    if (form.monitorTopAtEye === "yes") {
      s += 10;
      det.push({ ok: true, text: "Top of monitor around eye level." });
    } else {
      det.push({ ok: false, text: "Raise/lower monitor so the top is near eye level." });
    }

    if (form.keyboardAtElbow === "yes") {
      s += 10;
      det.push({ ok: true, text: "Keyboard at elbow height (~90° elbows)." });
    } else {
      det.push({
        ok: false,
        text: `Keyboard should be near elbow height (~${elbowHeight} cm for you).`,
      });
    }

    if (form.feetSupported === "yes") {
      s += 10;
      det.push({ ok: true, text: "Feet supported (flat or footrest)." });
    } else {
      det.push({
        ok: false,
        text: "Use a footrest or adjust seat so feet are supported.",
      });
    }

    if (form.chairLumbar === "yes") {
      s += 10;
      det.push({ ok: true, text: "Lower back supported." });
    } else {
      det.push({ ok: false, text: "Add a small lumbar cushion or adjust chair backrest." });
    }

    if (form.glare === "no") {
      s += 5;
      det.push({ ok: true, text: "Glare looks under control." });
    } else {
      det.push({ ok: false, text: "Reduce glare with blinds or reposition screen." });
    }

    if (form.breakEveryMins <= 30 && form.breakEveryMins >= 20) {
      s += 10;
      det.push({ ok: true, text: "Regular micro-breaks are on point." });
    } else {
      det.push({ ok: false, text: "Try breaks every 20–30 minutes." });
    }

    const max = 65;
    const pct = Math.round((s / max) * 100);

    let v = "Great";
    if (pct < 70) v = "Needs Tuning";
    if (pct < 45) v = "Adjust ASAP";

    return { score: pct, verdict: v, details: det };
  }, [form, elbowHeight]);

  /* ------------------------------------------------------------------------
   * Handlers: submit & reset
   * ------------------------------------------------------------------------ */
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(initialForm);
    setSubmitted(false);
  };

  return (
    <div className="hd-wrap">
      {/* --------------------------------------------------------------------
          Header (no info button here; it appears with results after submit)
         -------------------------------------------------------------------- */}
      <header className="hd-header">
        <div>
          <h1 className="hd-title">Healthy Desk</h1>
          <p className="hd-sub">Quick checklist for your workstation setup.</p>
        </div>
      </header>

      {/* --------------------------------------------------------------------
          Guidance: collapsible helper for estimating inputs
         -------------------------------------------------------------------- */}
      <section className="hd-guidelines card">
        <div
          className="hd-guidelines-header"
          onClick={() => setShowTips((v) => !v)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setShowTips((v) => !v)}
          aria-expanded={showTips}
        >
          <h2>How to estimate measurements</h2>
          <span className={`chev ${showTips ? "open" : ""}`}>▾</span>
        </div>

        {showTips && (
          <div className={`hd-guidelines-body ${showTips ? "open" : ""}`}>
            <ul>
              <li>Screen distance: arm’s length (~50–75 cm).</li>
              <li>Monitor: top at eye level.</li>
              <li>Keyboard: near elbow height (~{elbowHeight} cm for your height).</li>
              <li>Feet: flat on floor or footrest, knees ~90°.</li>
              <li>Lighting: reduce glare with blinds or reposition.</li>
              <li>Breaks: short resets every 20–30 minutes.</li>
            </ul>
          </div>
        )}
      </section>

      {/* --------------------------------------------------------------------
          Main: before submit → centered form only
                after submit  → two columns (form + results)
         -------------------------------------------------------------------- */}
      <main className={`hd-main ${submitted ? "submitted" : ""}`}>
        {/* ------------------------------ Form ------------------------------ */}
        <form className="card hd-form" onSubmit={handleSubmit} noValidate>
          <div className="hd-grid">
            <label className="hd-field">
              <span>Your height (cm)</span>
              <input
                type="number"
                min="120"
                max="220"
                value={form.heightCm}
                onChange={onNumber("heightCm")}
                aria-label="Your height in centimeters"
              />
            </label>

            <label className="hd-field">
              <span>Screen distance (cm)</span>
              <input
                type="range"
                min="40"
                max="100"
                value={form.screenDistanceCm}
                onChange={onNumber("screenDistanceCm")}
                aria-label="Screen distance in centimeters"
              />
              <div className="range-readout">{form.screenDistanceCm} cm</div>
            </label>

            <label className="hd-field">
              <span>Top of monitor at eye level?</span>
              <select
                value={form.monitorTopAtEye}
                onChange={onSelect("monitorTopAtEye")}
                aria-label="Top of monitor at eye level"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>

            <label className="hd-field">
              <span>Keyboard at elbow height?</span>
              <select
                value={form.keyboardAtElbow}
                onChange={onSelect("keyboardAtElbow")}
                aria-label="Keyboard at elbow height"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>

            <label className="hd-field">
              <span>Feet supported?</span>
              <select
                value={form.feetSupported}
                onChange={onSelect("feetSupported")}
                aria-label="Feet supported"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>

            <label className="hd-field">
              <span>Chair has lumbar support?</span>
              <select
                value={form.chairLumbar}
                onChange={onSelect("chairLumbar")}
                aria-label="Chair lumbar support"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>

            <label className="hd-field">
              <span>Glare on screen?</span>
              <select
                value={form.glare}
                onChange={onSelect("glare")}
                aria-label="Glare on screen"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>

            <label className="hd-field">
              <span>Break every (minutes)</span>
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                value={form.breakEveryMins}
                onChange={onNumber("breakEveryMins")}
                aria-label="Break interval in minutes"
              />
              <div className="range-readout">{form.breakEveryMins} min</div>
            </label>
          </div>

          {/* Form actions */}
          <div className="form-actions">
            <button type="submit" className="btn primary" aria-label="Submit form">
              Submit
            </button>
            <button type="button" className="btn ghost" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {/* ----------------------------- Results ---------------------------- */}
        {submitted && (
          <section className="card hd-result" aria-live="polite">
            <div className="score-row">
              <div className="score">
                <div className="score-ring" role="img" aria-label={`Setup score ${score} percent`}>
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path
                      className="circle-bg"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle"
                      strokeDasharray={`${score}, 100`}
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="score-label">{score}%</div>
                </div>
                <div className={`verdict ${verdict.replace(/\s/g, "").toLowerCase()}`}>
                  {verdict}
                </div>
              </div>

              {/* Info button (appears with results) */}
              <button
                className="hd-info-btn"
                onClick={() => navigate("/health-info")}
                aria-label="Open Health Info"
                title="Official guidance & standards"
              >
                ℹ️
              </button>
            </div>

            {/* Scrollable tips */}
            <div className="result-scroll">
              <ul className="result-list">
                {details.map((d, i) => (
                  <li key={i} className={d.ok ? "ok" : "warn"}>
                    {d.ok ? "✅" : "⚠️"} {d.text}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default HealthyDesk;
