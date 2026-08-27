"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ARW_HOSTED_QUOTE_URL,
  isMotorhomeClass,
  US_STATES,
  type ArwOption,
} from "@/lib/arw";
import { trackGenerateLead, trackQuizStep } from "@/lib/analytics";
import { trackMetaLead } from "@/lib/meta";
import { MakeCombobox } from "@/components/MakeCombobox";
import {
  captureLeadAttribution,
  getLeadAttribution,
} from "@/lib/attribution";

type FindCoverageSurveyProps = {
  classes: ArwOption[];
  makes: ArwOption[];
  apiEnabled: boolean;
  hostedQuoteUrl?: string;
};

type StepId =
  | "class"
  | "make"
  | "model"
  | "year"
  | "odometer"
  | "state"
  | "price"
  | "contact"
  | "matching"
  | "result";

const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-3 text-base text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand sm:text-sm";

const comboboxInputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-3 text-base text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand sm:text-sm";

const backBtn =
  "rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand disabled:opacity-60";

const primaryBtn =
  "rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-60";

export function FindCoverageSurvey({
  classes,
  makes,
  apiEnabled,
  hostedQuoteUrl = ARW_HOSTED_QUOTE_URL,
}: FindCoverageSurveyProps) {
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 22 }, (_, i) => currentYear + 1 - i),
    [currentYear]
  );

  const [step, setStep] = useState<StepId>("class");
  const [rvClass, setRvClass] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [modelYear, setModelYear] = useState("");
  const [odometer, setOdometer] = useState("");
  const [state, setState] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [useHostedFallback, setUseHostedFallback] = useState(!apiEnabled);

  useEffect(() => {
    captureLeadAttribution();
  }, []);

  useEffect(() => {
    trackQuizStep(step, getLeadAttribution());
  }, [step]);

  const needsOdometer = rvClass ? isMotorhomeClass(rvClass) : false;

  const steps = useMemo((): StepId[] => {
    const base: StepId[] = ["class", "make", "model", "year"];
    if (needsOdometer) base.push("odometer");
    base.push("state", "price", "contact", "matching", "result");
    return base;
  }, [needsOdometer]);

  const progressSteps = steps.filter(
    (s): s is Exclude<StepId, "matching" | "result"> =>
      s !== "matching" && s !== "result"
  );
  const progressIndex = Math.max(
    0,
    progressSteps.indexOf(
      step as Exclude<StepId, "matching" | "result">
    )
  );
  const progress =
    step === "result" || step === "matching"
      ? 100
      : Math.round(((progressIndex + 1) / progressSteps.length) * 100);

  function goBack() {
    setError("");
    const idx = steps.indexOf(step);
    if (idx > 0) {
      let prev = steps[idx - 1];
      if (prev === "matching") prev = steps[idx - 2];
      setStep(prev);
    }
  }

  function afterVehicleYear() {
    setError("");
    setStep(needsOdometer ? "odometer" : "state");
  }

  function finishToResult(ok: boolean, fallback: boolean) {
    setSuccess(ok);
    setUseHostedFallback(fallback);
    setStep("matching");
    window.setTimeout(() => setStep("result"), 1600);
  }

  async function submitLead() {
    setError("");

    const attribution = getLeadAttribution();

    if (!apiEnabled) {
      finishToResult(false, true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/arw-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          state,
          rvClass,
          make,
          model,
          modelYear: Number(modelYear),
          purchasePrice: Number(purchasePrice),
          odometer: needsOdometer && odometer ? Number(odometer) : undefined,
          website,
          utm_campaign: attribution?.utm_campaign,
          utm_source: attribution?.utm_source,
          utm_medium: attribution?.utm_medium,
          utm_content: attribution?.utm_content,
          utm_term: attribution?.utm_term,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fallback) {
          finishToResult(false, true);
          return;
        }
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      trackGenerateLead(attribution);
      trackMetaLead();
      finishToResult(true, false);
    } catch {
      finishToResult(false, true);
    } finally {
      setSubmitting(false);
    }
  }

  const showProgress = step !== "result" && step !== "matching";

  return (
    <div className="space-y-6">
      {showProgress && (
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
            <span>
              Step {progressIndex + 1} of {progressSteps.length}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {step === "class" && (
        <section className="space-y-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              What type of RV do you own?
            </h2>
            <p className="mt-2 text-sm text-muted">
              About 60 seconds total — tap your class and we&apos;ll match you
              to the best coverage.
            </p>
          </div>
          <div className="grid gap-3">
            {classes.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  setRvClass(c.value);
                  if (!isMotorhomeClass(c.value)) setOdometer("");
                  setError("");
                  setStep("make");
                }}
                className="rounded-2xl border border-border bg-background px-5 py-5 text-left text-base font-semibold text-foreground transition-all hover:border-brand hover:bg-brand/5 hover:text-brand active:scale-[0.99]"
              >
                {c.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {step === "make" && (
        <section className="space-y-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Who made your RV?
            </h2>
            <p className="mt-2 text-sm text-muted">
              Start typing to find your manufacturer.
            </p>
          </div>
          {makes.length > 0 ? (
            <MakeCombobox
              id="make"
              options={makes}
              value={make}
              onChange={(v) => {
                setMake(v);
                if (v) {
                  setError("");
                  setStep("model");
                }
              }}
              className={comboboxInputClass}
              placeholder="e.g. Forest River, Winnebago…"
            />
          ) : (
            <>
              <input
                id="make"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g. Forest River"
                className={inputClass}
              />
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={goBack} className={backBtn}>
                  Back
                </button>
                <button
                  type="button"
                  className={primaryBtn}
                  onClick={() => {
                    if (!make.trim()) {
                      setError("Please enter a make.");
                      return;
                    }
                    setError("");
                    setStep("model");
                  }}
                >
                  Continue
                </button>
              </div>
            </>
          )}
          {makes.length > 0 && (
            <button type="button" onClick={goBack} className={backBtn}>
              Back
            </button>
          )}
          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
        </section>
      )}

      {step === "model" && (
        <section className="space-y-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              What model is it?
            </h2>
            <p className="mt-2 text-sm text-muted">
              As it appears on your title or insurance card.
            </p>
          </div>
          <input
            id="model"
            value={model}
            autoFocus
            onChange={(e) => setModel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!model.trim()) {
                  setError("Please enter a model.");
                  return;
                }
                setError("");
                setStep("year");
              }
            }}
            placeholder="e.g. Cherokee, Bounder, Airstream"
            className={inputClass}
          />
          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={goBack} className={backBtn}>
              Back
            </button>
            <button
              type="button"
              className={primaryBtn}
              onClick={() => {
                if (!model.trim()) {
                  setError("Please enter a model.");
                  return;
                }
                setError("");
                setStep("year");
              }}
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {step === "year" && (
        <section className="space-y-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              What year is your RV?
            </h2>
            <p className="mt-2 text-sm text-muted">
              Coverage typically fits RVs from the last 20 years.
            </p>
          </div>
          <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
            {years.map((y) => {
              const selected = modelYear === String(y);
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => {
                    setModelYear(String(y));
                    setError("");
                    afterVehicleYear();
                  }}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${
                    selected
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border bg-background text-foreground hover:border-brand/60"
                  }`}
                >
                  {y}
                </button>
              );
            })}
          </div>
          <button type="button" onClick={goBack} className={backBtn}>
            Back
          </button>
        </section>
      )}

      {step === "odometer" && (
        <section className="space-y-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Current mileage
            </h2>
            <p className="mt-2 text-sm text-muted">
              Motorhome quotes need your odometer reading.
            </p>
          </div>
          <input
            id="odometer"
            type="number"
            min={0}
            autoFocus
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
            placeholder="e.g. 45000"
            className={inputClass}
          />
          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={goBack} className={backBtn}>
              Back
            </button>
            <button
              type="button"
              className={primaryBtn}
              onClick={() => {
                const n = Number(odometer);
                if (!odometer || !Number.isFinite(n) || n < 0) {
                  setError("Please enter a valid odometer reading.");
                  return;
                }
                setError("");
                setStep("state");
              }}
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {step === "state" && (
        <section className="space-y-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Where is the RV registered?
            </h2>
            <p className="mt-2 text-sm text-muted">
              Select the full state name.
            </p>
          </div>
          <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
            {US_STATES.map((s) => {
              const selected = state === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setState(s);
                    setError("");
                    setStep("price");
                  }}
                  className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-colors ${
                    selected
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border bg-background text-foreground hover:border-brand/60"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <button type="button" onClick={goBack} className={backBtn}>
            Back
          </button>
        </section>
      )}

      {step === "price" && (
        <section className="space-y-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Approx. purchase price?
            </h2>
            <p className="mt-2 text-sm text-muted">
              What you paid (or estimate) for the RV — used for quoting.
            </p>
          </div>
          <input
            id="purchasePrice"
            type="number"
            min={0}
            step={100}
            autoFocus
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            placeholder="e.g. 85000"
            className={inputClass}
          />
          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={goBack} className={backBtn}>
              Back
            </button>
            <button
              type="button"
              className={primaryBtn}
              onClick={() => {
                const n = Number(purchasePrice);
                if (!purchasePrice || !Number.isFinite(n) || n < 0) {
                  setError("Please enter a valid purchase price.");
                  return;
                }
                setError("");
                setStep("contact");
              }}
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {step === "contact" && (
        <section className="relative space-y-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Where should we send your quote?
            </h2>
            <p className="mt-2 text-sm text-muted">
              Free, no obligation — a specialist follows up with options for
              your {modelYear || ""} {make || "RV"}.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-foreground"
              >
                First name *
              </label>
              <input
                id="firstName"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-foreground"
              >
                Last name *
              </label>
              <input
                id="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-foreground"
            >
              Phone *
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>

          <div
            className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
            aria-hidden
          >
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={submitting}
              className={backBtn}
            >
              Back
            </button>
            <button
              type="button"
              disabled={submitting}
              className={primaryBtn}
              onClick={() => {
                if (
                  !firstName.trim() ||
                  !lastName.trim() ||
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
                  phone.replace(/\D/g, "").length < 10
                ) {
                  setError("Please enter a valid name, email, and phone.");
                  return;
                }
                void submitLead();
              }}
            >
              {submitting ? "Submitting…" : "Get My Free Quote"}
            </button>
          </div>

          <p className="text-xs leading-relaxed text-muted">
            By continuing, you agree to be contacted about RV warranty coverage
            options. No obligation to buy.
          </p>
        </section>
      )}

      {step === "matching" && (
        <section
          className="flex flex-col items-center justify-center gap-4 py-16 text-center"
          aria-live="polite"
        >
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-brand/20 border-t-brand"
            aria-hidden
          />
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Matching coverage…
          </h2>
          <p className="max-w-xs text-sm text-muted">
            Reviewing plans for your {modelYear} {make} {model}.
          </p>
        </section>
      )}

      {step === "result" && (
        <section className="space-y-5 py-2 text-center sm:text-left">
          {success ? (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand sm:mx-0">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                You&apos;re matched
              </p>
              <h2 className="font-serif text-3xl font-semibold text-foreground">
                Best coverage for your RV
              </h2>
              <p className="text-base leading-relaxed text-muted">
                Request received for your {modelYear} {make} {model}. A
                specialist will follow up with a free quote — usually within one
                business day.
              </p>
              <p className="text-sm text-muted">
                Keep an eye on your phone and email ({email}).
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                Almost there
              </p>
              <h2 className="font-serif text-3xl font-semibold text-foreground">
                Finish your free quote
              </h2>
              <p className="text-base leading-relaxed text-muted">
                {useHostedFallback
                  ? "One more step on the secure quote form to complete your match."
                  : "We couldn’t finish on this page. Continue on the quote form."}
              </p>
              <a
                href={hostedQuoteUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className={`inline-block ${primaryBtn}`}
              >
                Continue to Quote Form
              </a>
            </>
          )}
        </section>
      )}
    </div>
  );
}
