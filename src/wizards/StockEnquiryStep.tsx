import { useWizard } from "../WizardContext";

export const StockEnquiryStep = () => {
    const { reset } = useWizard();
    
    return (
        <div className="step-content success-step">
            <div className="success-icon">✓</div>
            <h2>We don't know</h2>
            <p className="text-muted">
                Unfortunately, we don't have real-time stock information available. Please contact our customer service team for assistance with stock enquiries.
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