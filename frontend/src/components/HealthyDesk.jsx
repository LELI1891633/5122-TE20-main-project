import React, { useState } from 'react';
import './HealthyDesk.css';

const initialForm = {
  heightCm: '',
  chairHasLumbar: 'no',
  deskType: 'fixed',
  monitorTopAtEye: 'no',
  keyboardAtElbow: 'no',
  screenDistanceCm: '',
  usesFootrest: 'no',
  breakEveryMins: '60',
  lightingGlare: 'yes',
  dualMonitors: 'no',
};

const HealthyDesk = ({ onBack, onInfo }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [advice, setAdvice] = useState([]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.heightCm || Number.isNaN(Number(form.heightCm)) || Number(form.heightCm) < 120 || Number(form.heightCm) > 220) {
      e.heightCm = 'Enter your height in cm (120–220).';
    }
    if (!form.screenDistanceCm || Number.isNaN(Number(form.screenDistanceCm)) || Number(form.screenDistanceCm) < 40 || Number(form.screenDistanceCm) > 100) {
      e.screenDistanceCm = 'Screen distance should be 40–100 cm.';
    }
    if (!form.breakEveryMins || Number.isNaN(Number(form.breakEveryMins)) || Number(form.breakEveryMins) < 15 || Number(form.breakEveryMins) > 120) {
      e.breakEveryMins = 'Break interval should be 15–120 minutes.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tips = [];

    // Height-based rough guide for desk/chair (no medical advice)
    const h = Number(form.heightCm);
    if (h) {
      const estElbowHeight = Math.round(0.62 * h); // rough anthropometric ratio
      tips.push(`Aim for keyboard height near elbow level (~${estElbowHeight} cm from floor). Adjust chair/desk to match.`);
    }

    if (form.deskType === 'fixed') {
      tips.push('Consider a sit-stand add-on or keyboard tray if desk height is not adjustable.');
    }

    if (form.chairHasLumbar === 'no') {
      tips.push('Add a small lumbar cushion or adjust chair back for lower back support.');
    }

    if (form.monitorTopAtEye === 'no') {
      tips.push('Raise/low er monitor so the top of the screen is ~at eye level to reduce neck flexion.');
    }

    if (form.keyboardAtElbow === 'no') {
      tips.push('Position keyboard/mouse so elbows are ~90° and shoulders relaxed.');
    }

    const dist = Number(form.screenDistanceCm);
    if (dist < 50) tips.push('Increase screen distance to ~50–75 cm to reduce eye strain.');
    if (dist > 80) tips.push('Bring the monitor closer (~50–75 cm) for comfortable viewing.');

    if (form.usesFootrest === 'no') {
      tips.push('If feet don’t rest flat, use a footrest to keep knees ~90°.');
    }

    const breakMin = Number(form.breakEveryMins);
    if (breakMin > 30) tips.push('Try micro-breaks: 20–30 min intervals with 20–30 sec posture resets or quick stands.');
    if (form.lightingGlare === 'yes') tips.push('Reduce glare: reposition monitor 90° to windows, use blinds, or an anti-glare screen.');
    if (form.dualMonitors === 'yes') tips.push('Place primary monitor front-and-center; angle secondary slightly to reduce head rotation.');

    setAdvice(tips);
  };

  const resetAll = () => {
    setForm(initialForm);
    setErrors({});
    setAdvice([]);
  };

  return (
    <div className="desk-wrap">
      <header className="desk-header">
        {onBack && (
          <button className="btn back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
        )}
        <h1 className="title">Healthy Desk Setup</h1>

        {/* NEW: info button */}
        {onInfo && (
          <button
            className="btn"
            onClick={onInfo}
            aria-label="Open official health information"
            title="Official guidance & standards"
            style={{ marginLeft: 'auto' }}
          >
            i
          </button>
        )}
      </header>

      <main className="desk-main">
        <form className="card form-card" onSubmit={handleSubmit} noValidate>
          <div className="grid">
            <label className="field">
              <span>Your height (cm)</span>
              <input
                type="number"
                name="heightCm"
                min="120"
                max="220"
                value={form.heightCm}
                onChange={onChange}
                placeholder="e.g., 165"
                aria-invalid={!!errors.heightCm}
                aria-describedby="heightHelp"
              />
              {errors.heightCm ? (
                <small className="error">{errors.heightCm}</small>
              ) : (
                <small id="heightHelp" className="hint">Used to estimate comfortable keyboard/desk height.</small>
              )}
            </label>

            <label className="field">
              <span>Chair lumbar support</span>
              <select name="chairHasLumbar" value={form.chairHasLumbar} onChange={onChange}>
                <option value="yes">Yes</option>
                <option value="no">No / Not sure</option>
              </select>
              <small className="hint">Supports natural curve of lower back.</small>
            </label>

            <label className="field">
              <span>Desk type</span>
              <select name="deskType" value={form.deskType} onChange={onChange}>
                <option value="fixed">Fixed height</option>
                <option value="sitstand">Sit-stand (adjustable)</option>
              </select>
              <small className="hint">Adjustable desks make alignment easier.</small>
            </label>

            <label className="field">
              <span>Monitor top at eye level?</span>
              <select name="monitorTopAtEye" value={form.monitorTopAtEye} onChange={onChange}>
                <option value="yes">Yes</option>
                <option value="no">No / Not sure</option>
              </select>
            </label>

            <label className="field">
              <span>Keyboard at elbow height?</span>
              <select name="keyboardAtElbow" value={form.keyboardAtElbow} onChange={onChange}>
                <option value="yes">Yes</option>
                <option value="no">No / Not sure</option>
              </select>
            </label>

            <label className="field">
              <span>Screen distance (cm)</span>
              <input
                type="number"
                name="screenDistanceCm"
                min="40"
                max="100"
                value={form.screenDistanceCm}
                onChange={onChange}
                placeholder="e.g., 60"
                aria-invalid={!!errors.screenDistanceCm}
              />
              {errors.screenDistanceCm && <small className="error">{errors.screenDistanceCm}</small>}
            </label>

            <label className="field">
              <span>Feet flat / footrest?</span>
              <select name="usesFootrest" value={form.usesFootrest} onChange={onChange}>
                <option value="yes">Yes / Flat on floor</option>
                <option value="no">No / Heels dangle</option>
              </select>
            </label>

            <label className="field">
              <span>Break every (minutes)</span>
              <input
                type="number"
                name="breakEveryMins"
                min="15"
                max="120"
                step="5"
                value={form.breakEveryMins}
                onChange={onChange}
                placeholder="e.g., 30"
                aria-invalid={!!errors.breakEveryMins}
              />
              {errors.breakEveryMins && <small className="error">{errors.breakEveryMins}</small>}
            </label>

            <label className="field">
              <span>Glare on screen?</span>
              <select name="lightingGlare" value={form.lightingGlare} onChange={onChange}>
                <option value="no">No</option>
                <option value="yes">Yes / Sometimes</option>
              </select>
            </label>

            <label className="field">
              <span>Dual monitors?</span>
              <select name="dualMonitors" value={form.dualMonitors} onChange={onChange}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>
          </div>

          <div className="actions">
            <button type="button" className="btn ghost" onClick={resetAll}>Reset</button>
            <button type="submit" className="btn primary">Get Suggestions</button>
          </div>
        </form>

        <section className="card tips-card">
          <h2>Suggestions</h2>
          {advice.length === 0 ? (
            <p className="muted">Fill the form and click <b>Get Suggestions</b> to see setup tips here.</p>
          ) : (
            <ul className="tips-list">
              {advice.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
          <p className="tiny-note">
            Note: General setup suggestions only—no medical or professional advice.
          </p>
        </section>
      </main>
    </div>
  );
};

export default HealthyDesk;
