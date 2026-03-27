import React, { useState, useCallback, useRef, useEffect } from 'react';
import { WizardContext } from './WizardContext';
import type { WizardDirection } from './WizardContext';
import './wizard.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WizardProps<T extends object> {
  /**
   * The initial data object. Its shape defines the wizard's generic type T.
   * Every WizardStep can read and merge into this via `useWizard<T>()`.
   */
  initialData: T;

  /** Called with the final accumulated data when the user completes the last step. */
  onComplete: (data: T) => void;

  /** Called after every step change with the new step index and current data. */
  onStepChange?: (step: number, data: T) => void;

  /**
   * One React element per step. Each element should render a `<WizardStep>`
   * at its root so it gets the bullet progress bar and navigation controls.
   */
  children: React.ReactNode;

  /**
   * Optional labels for each step shown beneath the progress bullets.
   * Length should match the number of children.
   */
  stepLabels?: string[];

  /**
   * Whether the user can navigate backwards with the Back button or by
   * clicking completed progress bullets. Defaults to true.
   */
  allowBackNavigation?: boolean;

  /** Extra CSS class applied to the wizard root element. */
  className?: string;

  /**
   * Duration of the slide animation in milliseconds. Defaults to 350.
   * Set to 0 to disable animations. Automatically set to 0 when the user
   * has `prefers-reduced-motion` enabled.
   */
  animationDuration?: number;
}

interface TransitionState {
  /** The step currently being rendered (and animating in). */
  currentStep: number;
  /** The step that is animating out (-1 when idle). */
  exitingStep: number;
  direction: WizardDirection;
  isTransitioning: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Wizard<T>
 *
 * Wraps a series of step components, manages shared data accumulation,
 * handles forward/backward slide animations, and exposes everything
 * to children via `useWizard<T>()`.
 *
 * @example
 * ```tsx
 * type OnboardingData = { name: string; email: string; plan: string };
 *
 * <Wizard<OnboardingData>
 *   initialData={{ name: '', email: '', plan: '' }}
 *   stepLabels={['Profile', 'Contact', 'Plan']}
 *   onComplete={(data) => console.log('Done', data)}
 * >
 *   <ProfileStep />
 *   <ContactStep />
 *   <PlanStep />
 * </Wizard>
 * ```
 */
export function Wizard<T extends object>({
  initialData,
  onComplete,
  onStepChange,
  children,
  stepLabels = [],
  allowBackNavigation = true,
  className,
  animationDuration = 350,
}: WizardProps<T>) {
  // Detect reduced-motion preference once on mount.
  const reducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const effectiveDuration = reducedMotion ? 0 : animationDuration;

  // ── State ──────────────────────────────────────────────────────────────────
  const [data, setData] = useState<T>(initialData);

  const [transition, setTransition] = useState<TransitionState>({
    currentStep: 0,
    exitingStep: -1,
    direction: 'none',
    isTransitioning: false,
  });

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer on unmount.
  useEffect(() => {
    return () => {
      if (animationTimer.current) clearTimeout(animationTimer.current);
    };
  }, []);

  const steps = React.Children.toArray(children);
  const totalSteps = steps.length;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const updateData = useCallback((partial: Partial<T>) => {
    setData((prev) => ({ ...prev, ...partial } as T));
  }, []);

  /**
   * Core navigation primitive. All public navigation functions go through here.
   */
  const navigate = useCallback(
    (targetStep: number, direction: WizardDirection) => {
      // Read transition state via the setter's prev to avoid stale closure.
      setTransition((cur) => {
        if (cur.isTransitioning) return cur;
        if (targetStep < 0 || targetStep >= totalSteps) return cur;

        if (direction === 'forward') {
          setCompletedSteps((cs) => {
            const next = new Set(cs);
            next.add(cur.currentStep);
            return next;
          });
        }

        // Instant switch when animations are disabled.
        if (effectiveDuration === 0) {
          setTimeout(() => onStepChange?.(targetStep, data), 0);
          return {
            currentStep: targetStep,
            exitingStep: -1,
            direction: 'none',
            isTransitioning: false,
          };
        }

        // Animated switch.
        animationTimer.current = setTimeout(() => {
          setTransition((t) => ({ ...t, exitingStep: -1, isTransitioning: false }));
          onStepChange?.(targetStep, data);
        }, effectiveDuration);

        return {
          currentStep: targetStep,
          exitingStep: cur.currentStep,
          direction,
          isTransitioning: true,
        };
      });
    },
    [totalSteps, effectiveDuration, data, onStepChange],
  );

  const nextStep = useCallback(() => {
    setTransition((cur) => {
      if (cur.currentStep === totalSteps - 1) {
        setCompletedSteps((cs) => {
          const next = new Set(cs);
          next.add(cur.currentStep);
          return next;
        });
        setTimeout(() => onComplete(data), 0);
        return cur;
      }
      // Non-final step: trigger navigation as a side-effect after this render.
      setTimeout(() => navigate(cur.currentStep + 1, 'forward'), 0);
      return cur;
    });
  }, [totalSteps, navigate, onComplete, data]);

  const prevStep = useCallback(() => {
    if (!allowBackNavigation) return;
    setTransition((cur) => {
      setTimeout(() => navigate(cur.currentStep - 1, 'backward'), 0);
      return cur;
    });
  }, [allowBackNavigation, navigate]);

  const goToStep = useCallback(
    (index: number) => {
      setTransition((cur) => {
        if (!allowBackNavigation && index < cur.currentStep) return cur;
        const dir: WizardDirection =
          index > cur.currentStep ? 'forward' : index < cur.currentStep ? 'backward' : 'none';
        setTimeout(() => navigate(index, dir), 0);
        return cur;
      });
    },
    [allowBackNavigation, navigate],
  );

  // ── Context value ──────────────────────────────────────────────────────────
  const { currentStep, exitingStep, isTransitioning, direction } = transition;

  const contextValue = {
    data,
    updateData,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    stepLabels,
    completedSteps,
    direction,
    isTransitioning,
    allowBackNavigation,
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const enterClass = isTransitioning ? `wizard__slide--enter-${direction}` : '';
  const exitClass = isTransitioning ? `wizard__slide--exit wizard__slide--exit-${direction}` : '';

  return (
    <WizardContext.Provider value={contextValue}>
      <div className={['wizard', className].filter(Boolean).join(' ')}>
        <div
          className="wizard__slide-container"
          style={
            {
              '--wizard-animation-duration': `${effectiveDuration}ms`,
            } as React.CSSProperties
          }
        >
          {/* Step animating out — absolute so it doesn't push the layout. */}
          {isTransitioning && exitingStep >= 0 && (
            <div key={`exit-${exitingStep}`} className={`wizard__slide ${exitClass}`}>
              {steps[exitingStep]}
            </div>
          )}

          {/* Step animating in — stays in normal flow to size the container. */}
          <div key={`enter-${currentStep}`} className={`wizard__slide ${enterClass}`}>
            {steps[currentStep]}
          </div>
        </div>
      </div>
    </WizardContext.Provider>
  );
}
