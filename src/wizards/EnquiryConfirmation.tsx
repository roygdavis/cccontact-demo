import { useWizard } from '../WizardContext';

export const EnquiryConfirmation = () => {
    const { reset } = useWizard();
    return (
        <div className="step-content success-step">
            <div className="success-icon">✓</div>
            <h2>Query submitted!</h2>
            <p className="text-muted">
                Thank you for getting in touch. A member of our team will be in contact with you
                shortly.
            </p>
            <button
                className="btn btn-outline-secondary w-100"
                onClick={reset}
            >
                Start over
            </button>
        </div>
    );
}