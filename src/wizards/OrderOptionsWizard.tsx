import { useWizard } from '../WizardContext';

/**
 * Renders the list of order-related child steps the customer can choose from.
 * It reads its options from currentStep.next so the Flows.ts tree is the
 * single source of truth — no hard-coded labels here.
 */
export const OrderOptionsWizard = () => {
    const { currentStep, navigateTo, orderNumber } = useWizard();

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
        </div>
    );
};
