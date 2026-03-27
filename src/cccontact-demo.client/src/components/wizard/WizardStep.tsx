import React, { useState } from 'react';
import { useWizard } from './useWizard';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Validation result returned from the `validate` prop.
 *  - `true`   → step is valid, proceed.
 *  - `false`  → step is invalid; show a generic error message.
 *  - `string` → step is invalid; the string is used as the error message.
 */
type ValidationResult = boolean | string;

export interface WizardStepProps {
  /**
   * Heading shown at the top of the step card.
   * Optional — omit it if your content already has its own heading.
   */
  title?: string;

  /** Smaller subtitle rendered beneath the title. */
  description?: string;

  /**
   * Called when the user clicks Next / Finish.
   * Return `true` to proceed, `false` for a generic error, or a `string`
   * to display a custom error message. May be async.
   */
  validate?: () => ValidationResult | Promise<ValidationResult>;

  /** Label for the Next button. Defaults to `'Next'`. */
  nextLabel?: string;

  /** Label for the Back button. Defaults to `'Back'`. */
  backLabel?: string;

  /** Label for the Next button on the final step. Defaults to `'Finish'`. */
  finishLabel?: string;

  /** Step content. */
  children: React.ReactNode;

  /**
   * Set to `false` to hide the built-in Back/Next navigation bar.
   * Useful when a step manages its own navigation (e.g. a summary/review page).
   */
  showNavigation?: boolean;

  /**
   * Whether clicking a completed progress bullet navigates directly to that step.
   * Defaults to `true`. Only respected when `allowBackNavigation` is also `true`
   * at the Wizard level.
   */
  allowJumpToStep?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * WizardStep
 *
 * The common "frame" that every step in a `<Wizard>` should render as its root.
 * It provides:
 *  - A bullet progress indicator with current/completed/upcoming states.
 *  - An optional title and description header.
 *  - A content area (children).
 *  - Inline validation error display.
 *  - Back / Next navigation buttons with async validation support.
 *
 * Access the shared wizard data via `useWizard<YourDataType>()` anywhere
 * inside (or nested within) this component.
 *
 * @example
 * ```tsx
 * function ProfileStep() {
 *   const { data, updateData } = useWizard<MyData>();
 *   return (
 *     <WizardStep
 *       title="Your Profile"
 *       validate={() => data.name.trim().length > 0 || 'Name is required'}
 *     >
 *       <input value={data.name} onChange={e => updateData({ name: e.target.value })} />
 *     </WizardStep>
 *   );
 * }
 * ```
 */
export function WizardStep({
  title,
  description,
  validate,
  nextLabel = 'Next',
  backLabel = 'Back',
  finishLabel = 'Finish',
  children,
  showNavigation = true,
  allowJumpToStep = true,
}: WizardStepProps) {
  const {
    currentStep,
    totalSteps,
    stepLabels,
    completedSteps,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    isTransitioning,
    allowBackNavigation,
  } = useWizard();

  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleNext = async () => {
    setError(null);

    if (!validate) {
      nextStep();
      return;
    }

    setIsValidating(true);
    let valid = false;

    try {
      const result = await validate();
      if (result === true) {
        valid = true;
      } else if (result === false) {
        setError('Please complete this step before continuing.');
      } else {
        // result is a non-empty string — use it as the error message.
        setError(result);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
    } finally {
      setIsValidating(false);
    }

    if (valid) nextStep();
  };

  const handleBulletClick = (index: number) => {
    if (!allowJumpToStep || !allowBackNavigation) return;
    if (completedSteps.has(index) || index < currentStep) {
      goToStep(index);
    }
  };

  // ── Bullet helpers ─────────────────────────────────────────────────────────
  const getBulletState = (index: number): 'current' | 'completed' | 'upcoming' => {
    if (index === currentStep) return 'current';
    if (completedSteps.has(index)) return 'completed';
    return 'upcoming';
  };

  const isClickable = (index: number) =>
    allowJumpToStep && allowBackNavigation && (completedSteps.has(index) || index < currentStep);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="wizard-step">
      {/* ── Progress bullets ───────────────────────────────────────────── */}
      <nav className="wizard-progress" aria-label="Wizard progress">
        {Array.from({ length: totalSteps }, (_, i) => {
          const state = getBulletState(i);
          const clickable = isClickable(i);
          const label = stepLabels[i] ?? `Step ${i + 1}`;

          return (
            <React.Fragment key={i}>
              <div
                className={`wizard-progress__bullet wizard-progress__bullet--${state}`}
                role="listitem"
              >
                <button
                  className="wizard-progress__bullet-btn"
                  onClick={() => handleBulletClick(i)}
                  disabled={!clickable}
                  aria-label={`${label}${state === 'completed' ? ' (completed)' : state === 'current' ? ' (current)' : ''}`}
                  aria-current={state === 'current' ? 'step' : undefined}
                  tabIndex={clickable ? 0 : -1}
                  title={label}
                >
                  <div className="wizard-progress__bullet-dot">
                    {state === 'completed' && (
                      <svg
                        className="wizard-progress__checkmark"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {state === 'current' && (
                      <div className="wizard-progress__bullet-pulse" aria-hidden="true" />
                    )}
                  </div>
                </button>

                {stepLabels.length > 0 && (
                  <span className="wizard-progress__label" aria-hidden="true">
                    {label}
                  </span>
                )}
              </div>

              {/* Connector line between bullets */}
              {i < totalSteps - 1 && (
                <div
                  className={[
                    'wizard-progress__connector',
                    completedSteps.has(i) ? 'wizard-progress__connector--completed' : '',
                  ]
                    .join(' ')
                    .trim()}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      {(title || description) && (
        <header className="wizard-step__header">
          {title && <h2 className="wizard-step__title">{title}</h2>}
          {description && <p className="wizard-step__description">{description}</p>}
        </header>
      )}

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="wizard-step__content">{children}</div>

      {/* ── Validation error ────────────────────────────────────────────── */}
      {error && (
        <p className="wizard-step__error" role="alert">
          {error}
        </p>
      )}

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      {showNavigation && (
        <div className="wizard-step__navigation">
          {!isFirstStep && allowBackNavigation ? (
            <button
              className="wizard-btn wizard-btn--back"
              onClick={prevStep}
              disabled={isTransitioning || isValidating}
              aria-label="Go to previous step"
            >
              ← {backLabel}
            </button>
          ) : (
            // Placeholder keeps Next button right-aligned even on step 1.
            <span aria-hidden="true" />
          )}

          <span className="wizard-step__step-counter" aria-live="polite">
            {currentStep + 1} / {totalSteps}
          </span>

          <button
            className={[
              'wizard-btn',
              'wizard-btn--next',
              isLastStep ? 'wizard-btn--finish' : '',
            ]
              .join(' ')
              .trim()}
            onClick={handleNext}
            disabled={isTransitioning || isValidating}
            aria-label={isLastStep ? finishLabel : nextLabel}
          >
            {isValidating ? '…' : isLastStep ? finishLabel : `${nextLabel} →`}
          </button>
        </div>
      )}
    </div>
  );
}
