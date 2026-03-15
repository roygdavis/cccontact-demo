import { useState, useCallback } from 'react';
import './App.css';
import { WizardSteps, type WizardStep } from './Flows';
import { WizardProvider, useWizard } from './WizardContext';
import type { ConfirmConfig } from './WizardContext';

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  config,
  isLoading,
  onCancel,
}: {
  config: ConfirmConfig;
  isLoading: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
        <p className="confirm-message">{config.message}</p>
        <div className="btn-row">
          <button
            className="btn btn-primary"
            onClick={config.onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting…' : 'Yes, submit'}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Initial split screen (no WizardStep active yet) ─────────────────────────

function InitialStep() {
  const { navigateTo } = useWizard();
  return (
    <div className="step-content">
      <h2>Is your query related to an order you have already placed?</h2>
      <div className="btn-row mt-4">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigateTo(WizardSteps.orders)}
        >
          Yes
        </button>
        <button
          className="btn btn-outline-secondary btn-lg"
          onClick={() => navigateTo(WizardSteps.enquiries)}
        >
          No
        </button>
      </div>
    </div>
  );
}

// ─── Wizard shell (handles animation + chrome) ────────────────────────────────

function WizardShell({
  stackDepth,
  isTransitioning,
  prevStep,
  direction,
  onAnimationEnd,
}: {
  stackDepth: number;
  isTransitioning: boolean;
  /** The step that was active before the current transition began */
  prevStep: WizardStep | null;
  direction: 'forward' | 'back';
  onAnimationEnd: () => void;
}) {
  const { currentStep, goBack, isLoading, confirm, setConfirm } = useWizard();

  const renderNode = (node: WizardStep | null) => {
    if (!node) return <InitialStep />;
    const Component = node.component;
    return <Component />;
  };

  return (
    <div className="app-container">
      {/* Back button — hidden on the initial split screen */}
      {stackDepth > 0 && (
        <button
          className="btn btn-outline-secondary btn-sm back-btn"
          onClick={goBack}
          disabled={isTransitioning || isLoading}
        >
          ← Back
        </button>
      )}

      {/* Sliding wizard viewport */}
      <div className="wizard-viewport">
        {isTransitioning && (
          <div
            className={`wizard-step ${
              direction === 'forward' ? 'slide-exit' : 'slide-exit-back'
            }`}
          >
            {renderNode(prevStep)}
          </div>
        )}
        <div
          className={`wizard-step${
            isTransitioning
              ? direction === 'forward'
                ? ' slide-enter'
                : ' slide-enter-back'
              : ''
          }`}
          onAnimationEnd={onAnimationEnd}
        >
          {renderNode(currentStep)}
        </div>
      </div>

      {/* Confirmation dialog overlay */}
      {confirm && (
        <ConfirmDialog
          config={confirm}
          isLoading={isLoading}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  // Animation state lives here; WizardProvider is a pure data/navigation layer.
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevStep, setPrevStep] = useState<WizardStep | null>(null);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [stackDepth, setStackDepth] = useState(0);

  /**
   * Called by WizardProvider whenever navigateTo / goBack is invoked.
   * `incomingStep` is the step that is about to become current.
   * `currentStepBeforeChange` is what was current just before — used as the
   * exiting slide during a forward navigation; for back it's the step we left.
   */
  const handleNavigate = useCallback((
    direction: 'forward' | 'back',
    exitingStep: WizardStep | null,
  ) => {
    setDirection(direction);
    setPrevStep(exitingStep);
    setIsTransitioning(true);
    setStackDepth(d => direction === 'forward' ? d + 1 : Math.max(0, d - 1));
  }, []);

  const handleReset = useCallback(() => {
    setStackDepth(0);
    setIsTransitioning(false);
    setPrevStep(null);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    setIsTransitioning(false);
    setPrevStep(null);
  }, []);

  return (
    <WizardProvider onNavigate={handleNavigate} onReset={handleReset}>
      <WizardShell
        stackDepth={stackDepth}
        isTransitioning={isTransitioning}
        prevStep={prevStep}
        direction={direction}
        onAnimationEnd={handleAnimationEnd}
      />
    </WizardProvider>
  );
}

export default App;
