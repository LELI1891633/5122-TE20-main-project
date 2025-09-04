import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  Info, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Monitor,
  User,
  Eye,
  Coffee,
  ArrowRight
} from "lucide-react";


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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
            <div className="bg-sky-600 p-2 rounded-lg">
              <Monitor className="text-white" size={24} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Healthy Desk</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            Quick checklist to optimize your workstation setup for better health and productivity.
          </p>
        </div>
      </header>

      {/* Guidance Section */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors duration-200"
            onClick={() => setShowTips((v) => !v)}
            aria-expanded={showTips}
          >
            <div className="flex items-center gap-3">
              <Info className="text-sky-600" size={20} />
              <h2 className="text-xl font-semibold text-slate-800">How to estimate measurements</h2>
            </div>
            <ChevronDown 
              className={`text-slate-400 transition-transform duration-300 ${showTips ? "rotate-180" : ""}`} 
              size={20}
            />
          </button>

          {showTips && (
            <div className="px-6 pb-6 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="flex gap-3">
                  <Monitor className="text-sky-600 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-slate-800">Screen distance</p>
                    <p className="text-sm text-slate-600">Arm's length (~50–75 cm)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Eye className="text-green-600 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-slate-800">Monitor position</p>
                    <p className="text-sm text-slate-600">Top at eye level</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <User className="text-purple-600 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-slate-800">Keyboard height</p>
                    <p className="text-sm text-slate-600">Near elbow height (~{elbowHeight} cm for you)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="text-orange-600 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-slate-800">Feet support</p>
                    <p className="text-sm text-slate-600">Flat on floor or footrest</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Eye className="text-yellow-600 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-slate-800">Lighting</p>
                    <p className="text-sm text-slate-600">Reduce glare with blinds</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Coffee className="text-red-600 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-slate-800">Breaks</p>
                    <p className="text-sm text-slate-600">Every 20–30 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>      {/* Main Content */}
      <main className={`max-w-7xl mx-auto ${submitted ? "grid grid-cols-1 xl:grid-cols-2 gap-8" : ""}`}>
        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Assessment Form</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Your height (cm)
                </label>
                <input
                  type="number"
                  min="120"
                  max="220"
                  value={form.heightCm}
                  onChange={onNumber("heightCm")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  aria-label="Your height in centimeters"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Screen distance (cm)
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={form.screenDistanceCm}
                  onChange={onNumber("screenDistanceCm")}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  aria-label="Screen distance in centimeters"
                />
                <div className="text-sm text-slate-600 font-medium">{form.screenDistanceCm} cm</div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Top of monitor at eye level?
                </label>
                <select
                  value={form.monitorTopAtEye}
                  onChange={onSelect("monitorTopAtEye")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  aria-label="Top of monitor at eye level"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Keyboard at elbow height?
                </label>
                <select
                  value={form.keyboardAtElbow}
                  onChange={onSelect("keyboardAtElbow")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  aria-label="Keyboard at elbow height"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Feet supported?
                </label>
                <select
                  value={form.feetSupported}
                  onChange={onSelect("feetSupported")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  aria-label="Feet supported"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Chair has lumbar support?
                </label>
                <select
                  value={form.chairLumbar}
                  onChange={onSelect("chairLumbar")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  aria-label="Chair lumbar support"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Glare on screen?
                </label>
                <select
                  value={form.glare}
                  onChange={onSelect("glare")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  aria-label="Glare on screen"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Break every (minutes)
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={form.breakEveryMins}
                  onChange={onNumber("breakEveryMins")}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  aria-label="Break interval in minutes"
                />
                <div className="text-sm text-slate-600 font-medium">{form.breakEveryMins} min</div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button 
                type="submit" 
                className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                <CheckCircle size={18} />
                Analyze Setup
              </button>
              <button 
                type="button" 
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-lg border border-slate-200 transition-colors duration-200"
              >
                <RotateCcw size={18} />
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {submitted && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8" aria-live="polite">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20" role="img" aria-label={`Setup score ${score} percent`}>
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path
                      className="fill-none stroke-slate-200 stroke-2"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`fill-none stroke-2 transition-all duration-1000 ${
                        verdict === "Great" ? "stroke-green-500" : 
                        verdict === "Needs Tuning" ? "stroke-yellow-500" : "stroke-red-500"
                      }`}
                      strokeDasharray={`${score}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-800">
                    {score}%
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    verdict === "Great" ? "text-green-600" : 
                    verdict === "Needs Tuning" ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {verdict}
                  </div>
                  <p className="text-sm text-slate-600">Workspace Assessment</p>
                </div>
              </div>

              {/* Info button */}
              <button
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                onClick={() => navigate("/health-info")}
                aria-label="View official health guidance"
              >
                <Info size={16} />
                <span className="hidden sm:inline">Health Info</span>
              </button>
            </div>

            {/* Recommendations */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <h4 className="font-semibold text-slate-800 mb-3">Recommendations:</h4>
              {details.map((d, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    d.ok ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  {d.ok ? (
                    <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                  ) : (
                    <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={16} />
                  )}
                  <p className={`text-sm ${d.ok ? "text-green-800" : "text-yellow-800"}`}>
                    {d.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthyDesk;
