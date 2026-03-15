import { useWizard } from "../WizardContext";

export const OrderAmendmentWizard = () => {
    const {
            currentStep,navigateTo
    } = useWizard();
    
    const nextStep = currentStep?.next?.[0];
    
    return (
        <div className="step-content">
            <h2>Your order</h2>
            <p className="text-muted">
                It's too late to amend your order, but if you need to make changes or have any issues, please contact our customer service team for assistance.
            </p>
            <button
                className="btn btn-primary w-100"
                onClick={() => nextStep && navigateTo(nextStep)}
                disabled={!nextStep}
            >
                'Contact us →'
            </button>
        </div>
    );
}