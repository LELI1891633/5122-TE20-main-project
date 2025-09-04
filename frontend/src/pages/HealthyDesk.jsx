import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";


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
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* --------------------------------------------------------------------
          Header (no info button here; it appears with results after submit)
         -------------------------------------------------------------------- */}
      <header className="max-w-7xl mx-auto mb-4 grid grid-cols-1 gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Healthy Desk</h1>
          <p className="text-sm text-slate-400 mt-1.5">Quick checklist for your workstation setup.</p>
        </div>
      </header>

      {/* --------------------------------------------------------------------
          Guidance: collapsible helper for estimating inputs
         -------------------------------------------------------------------- */}
      <section className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl">
        <div
          className="cursor-pointer"
          onClick={() => setShowTips((v) => !v)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setShowTips((v) => !v)}
          aria-expanded={showTips}
        >
          <h2>How to estimate measurements</h2>
          <span className={`transition-transform ${showTips ? "rotate-180" : ""}`}>▾</span>
        </div>

        {showTips && (
          <div className={`transition-all duration-300 ${showTips ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
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
      <main className={`max-w-7xl mx-auto ${submitted ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}`}>
        {/* ------------------------------ Form ------------------------------ */}
        <form className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span>Your height (cm)</span>
              <input
                type="number"
                min="120"
                max="220"
                value={form.heightCm}
                onChange={onNumber("heightCm")}
                aria-label="Your height in centimeters"
                className="mt-1 p-2 bg-slate-700 border border-slate-600 rounded"
              />
            </label>

            <label className="flex flex-col">
              <span>Screen distance (cm)</span>
              <input
                type="range"
                min="40"
                max="100"
                value={form.screenDistanceCm}
                onChange={onNumber("screenDistanceCm")}
                aria-label="Screen distance in centimeters"
                className="mt-1"
              />
              <div className="text-sm text-slate-400 mt-1">{form.screenDistanceCm} cm</div>
            </label>

            <label className="flex flex-col">
              <span>Top of monitor at eye level?</span>
              <select
                value={form.monitorTopAtEye}
                onChange={onSelect("monitorTopAtEye")}
                aria-label="Top of monitor at eye level"
                className="mt-1 p-2 bg-slate-700 border border-slate-600 rounded"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span>Keyboard at elbow height?</span>
              <select
                value={form.keyboardAtElbow}
                onChange={onSelect("keyboardAtElbow")}
                aria-label="Keyboard at elbow height"
                className="mt-1 p-2 bg-slate-700 border border-slate-600 rounded"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span>Feet supported?</span>
              <select
                value={form.feetSupported}
                onChange={onSelect("feetSupported")}
                aria-label="Feet supported"
                className="mt-1 p-2 bg-slate-700 border border-slate-600 rounded"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span>Chair has lumbar support?</span>
              <select
                value={form.chairLumbar}
                onChange={onSelect("chairLumbar")}
                aria-label="Chair lumbar support"
                className="mt-1 p-2 bg-slate-700 border border-slate-600 rounded"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span>Glare on screen?</span>
              <select
                value={form.glare}
                onChange={onSelect("glare")}
                aria-label="Glare on screen"
                className="mt-1 p-2 bg-slate-700 border border-slate-600 rounded"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span>Break every (minutes)</span>
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                value={form.breakEveryMins}
                onChange={onNumber("breakEveryMins")}
                aria-label="Break interval in minutes"
                className="mt-1"
              />
              <div className="text-sm text-slate-400 mt-1">{form.breakEveryMins} min</div>
            </label>
          </div>

          {/* Form actions */}
          <div className="flex gap-4 mt-6">
            <button type="submit" className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700" aria-label="Submit form">
              Submit
            </button>
            <button type="button" className="bg-transparent text-slate-400 p-3 rounded border border-slate-600 hover:bg-slate-700" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {/* ----------------------------- Results ---------------------------- */}
        {submitted && (
          <section className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6" aria-live="polite">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20" role="img" aria-label={`Setup score ${score} percent`}>
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      className="fill-none stroke-slate-600 stroke-2"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="fill-none stroke-blue-500 stroke-2 transition-all duration-500"
                      strokeDasharray={`${score}, 100`}
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">{score}%</div>
                </div>
                <div className={`text-lg font-semibold ${verdict === "Great" ? "text-green-400" : verdict === "Needs Tuning" ? "text-yellow-400" : "text-red-400"}`}>
                  {verdict}
                </div>
              </div>

              {/* Info button (appears with results) */}
              <button
                className="border border-slate-600 bg-slate-700 text-white p-3 rounded-lg cursor-pointer hover:border-blue-400"
                onClick={() => navigate("/health-info")}
                aria-label="Open Health Info"
                title="Official guidance & standards"
              >
                ℹ️
              </button>
            </div>

            {/* Scrollable tips */}
            <div className="max-h-60 overflow-y-auto">
              <ul className="space-y-2">
                {details.map((d, i) => (
                  <li key={i} className={d.ok ? "text-green-400" : "text-yellow-400"}>
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
