import { useState } from 'react';
import { useWizard } from '../WizardContext';

/**
 * Renders the list of order-related child steps the customer can choose from.
 * It reads its options from currentStep.next so the Flows.ts tree is the
 * single source of truth — no hard-coded labels here.
 */
export const OrderOptionsWizard = () => {
  const { currentStep, navigateTo, orderNumber, findStep } = useWizard();

  const [helpInput, setHelpInput] = useState('');

  const handleQuerySubmit = () => {
    const match = findStep(helpInput);
    if (match) {
      // Navigate through every ancestor in the path that hasn't been visited yet,
      // then navigate to the matched step itself.
      for (const ancestor of match.path) {
        navigateTo(ancestor);
      }
      navigateTo(match.step);
    }
    // If nothing matched, stay here so the customer can try again or pick manually.
  }


  return (
    <div className="step-content">
      <h2>What can we help you with?</h2>
      <p className="text-muted">
        Select the option that best describes your query about order{' '}
        <strong>{orderNumber}</strong>.
      </p>
      <div className="options-list">
        {currentStep?.next?.map((step, i) => (
          <button
            key={i}
            className="option-btn"
            onClick={() => navigateTo(step)}
          >
            {step.label}
          </button>
        ))}
      </div>
      <hr />
      <div className="mb-3">
        <label htmlFor="helpInput" className="form-label">Or type your query here</label>
        <input
          id="helpInput"
          className="form-control"
          value={helpInput}
          onChange={e => setHelpInput(e.target.value)}
        />
      </div>
      <button className="btn btn-primary w-100" onClick={() => handleQuerySubmit()}>
        Submit
      </button>
    </div>
  );
};