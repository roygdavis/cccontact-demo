import { useWizard } from '../WizardContext';

export const EnquiryWizard = () => {
  const { currentStep, navigateTo,
    description, setDescription,
  } = useWizard();

  const step = currentStep?.next?.[0];
  const useChildren = !!currentStep?.useChildren;

  return (
    <div className="step-content">
      <h2>How can we help you today?</h2>
      <p className="text-muted">
        Please describe your issue in detail.
      </p>
            
      {useChildren ? <div className="options-list">
        {currentStep?.next?.map((step, i) => (
          <button
            key={i}
            className="option-btn"
            onClick={() => navigateTo(step)}
          >
            {step.label}
          </button>
        ))}
      </div> : <>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-control"
            placeholder="Type your enquiry here"
              value={description ?? ''}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button className='btn btn-primary w-100' onClick={() => step && navigateTo(step)}>
          Submit Enquiry
        </button>
      </>}
    </div>
  );
}