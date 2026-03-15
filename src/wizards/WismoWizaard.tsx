import { useWizard } from '../WizardContext';

export const WismoWizard = () => {
    const { apiData } = useWizard();
    return (
        <div className="step-content">
            <h2>Track your order</h2>
            <p className="text-muted">
                Use the link below to see the current status and delivery details for your order.
            </p>
            <a
                href={apiData?.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg tracking-btn"
            >
                Track my order →
            </a>
            <p className="small text-muted mt-3">Opens tracking page in a new tab</p>
        </div>
    );
}