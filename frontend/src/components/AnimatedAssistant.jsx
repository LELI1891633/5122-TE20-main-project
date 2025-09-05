import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronRight, Info, Minimize2 } from "lucide-react";

const ACCENT_MAP = {
  indigo: "from-indigo-500 to-purple-500",
  emerald: "from-emerald-500 to-teal-500",
  pink: "from-pink-500 to-rose-500",
  amber: "from-amber-500 to-orange-500",
  sky: "from-sky-500 to-cyan-500",
};

function useTypewriter(text, speed = 22) {
  const [out, setOut] = useState("");
  const idxRef = useRef(0);
  const done = out.length === text.length;

  useEffect(() => {
    setOut("");
    idxRef.current = 0;
  }, [text]);

  useEffect(() => {
    if (!text) return;
    const id = setInterval(() => {
      setOut((prev) => {
        if (prev.length >= text.length) {
          clearInterval(id);
          return prev;
        }
        const next = text.slice(0, prev.length + 1);
        return next;
      });
      idxRef.current += 1;
    }, Math.max(8, speed));
    return () => clearInterval(id);
  }, [text, speed]);

  return { out, done };
}

function CartoonAvatar({ accent = "indigo" }) {
  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 120 120" className="w-16 h-16 drop-shadow">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" />
            <stop offset="100%" stopColor="currentColor" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="currentColor" opacity="0.15" className="text-gray-400" />
        <circle cx="60" cy="60" r="48" fill="currentColor" opacity="0.2" className="text-gray-500" />
        <circle cx="60" cy="60" r="40" fill="currentColor" opacity="0.25" className="text-gray-600" />
        {/* Face */}
        <circle cx="60" cy="60" r="34" fill="#fff" />
        <circle cx="46" cy="56" r="4" fill="#111827" />
        <circle cx="74" cy="56" r="4" fill="#111827" />
        <motion.path
          d="M42 72 C 52 84, 68 84, 78 72"
          fill="transparent"
          stroke="#111827"
          strokeWidth="5"
          strokeLinecap="round"
          animate={{ pathLength: [0.4, 1, 0.4], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <motion.div
        className="absolute -right-1 -top-1 w-3 h-3 rounded-full"
        style={{ backgroundColor: accent === 'sky' ? '#0ea5e9' : accent === 'indigo' ? '#6366f1' : accent === 'emerald' ? '#10b981' : accent === 'pink' ? '#ec4899' : '#f59e0b' }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </div>
  );
}

function Bubble({ children, accent = "indigo", width = 360 }) {
  return (
    <div
      className="relative max-w-[calc(100vw-2rem)] sm:max-w-none"
      style={{ maxWidth: width }}
    >
      <div className="absolute -left-3 top-6 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-white" />
      <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-3 sm:p-4">
        {children}
      </div>
      <div className={`mt-2 h-1 rounded-full bg-gradient-to-r ${ACCENT_MAP[accent]}`} />
    </div>
  );
}

export function AnimatedAssistant({
  open = true,
  name = "Ari",
  steps = [{ text: "Welcome! I can guide you through the site." }],
  initialStep = 0,
  position = "bottom-right",
  accent = "indigo",
  showMinimize = true,
  onClose,
  onStepChange,
  onFinish,
  width = 360,
  typingSpeed = 22,
  loop = false,
}) {
  const [visible, setVisible] = useState(open);
  const [step, setStep] = useState(initialStep);
  const current = steps[Math.min(step, steps.length - 1)];
  const { out, done } = useTypewriter(current?.text ?? "", typingSpeed);

  useEffect(() => setVisible(open), [open]);
  useEffect(() => {
    onStepChange?.(step);
  }, [step]);

  const posClass = useMemo(() => {
    const base = "fixed z-50 p-3";
    switch (position) {
      case "bottom-left":
        return `${base} left-4 bottom-4`;
      case "top-right":
        return `${base} right-4 top-4`;
      case "top-left":
        return `${base} left-4 top-4`;
      default:
        return `${base} right-4 bottom-4`;
    }
  }, [position]);

  const next = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else if (loop) {
      setStep(0);
    } else {
      onFinish?.();
      setVisible(false);
    }
  };

  const close = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="assistant"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={posClass}
          role="dialog"
          aria-label={`${name} assistant`}
        >
          <div className="flex items-start gap-3">
            <CartoonAvatar accent={accent} />
            <Bubble accent={accent} width={width}>
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <Info className="w-4 h-4" style={{ color: accent === 'sky' ? '#0ea5e9' : accent === 'indigo' ? '#6366f1' : accent === 'emerald' ? '#10b981' : accent === 'pink' ? '#ec4899' : '#f59e0b' }} />
                  <span>{name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {showMinimize && (
                    <button
                      type="button"
                      className="p-1 rounded-md hover:bg-gray-100"
                      aria-label="Minimize"
                      onClick={() => setVisible(false)}
                    >
                      <Minimize2 className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                  <button
                    type="button"
                    className="p-1 rounded-md hover:bg-gray-100"
                    aria-label="Close"
                    onClick={close}
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <p className="text-gray-800 leading-relaxed" aria-live="polite">
                {out}
                {!done && <span className="inline-block w-2 h-5 align-middle bg-gray-300 animate-pulse ml-0.5" />}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">Step {Math.min(step + 1, steps.length)} / {steps.length}</div>
                <button
                  onClick={next}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full text-white bg-gradient-to-r ${ACCENT_MAP[accent]} shadow hover:opacity-95`}
                >
                  {step < steps.length - 1 ? "Next" : loop ? "Restart" : "Finish"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </Bubble>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}