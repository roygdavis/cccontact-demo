import { useWizard } from '../WizardContext';

export const DamagedItemsWizard = () => {
    const { apiData, setConfirm, submitEnquiry, currentStep } = useWizard();

    // Navigate to the first child step (e.g. a confirmation screen) after submit.
    const successStep = currentStep?.next?.[0];

    return (
        <div className="step-content">
            <h2>Which item does this relate to?</h2>
            <p className="text-muted">
                Please select the item from your order that this query is about.
            </p>
            <div className="items-list">
                {apiData?.items.map(item => (
                    <div key={item.id} className="item-card">
                        <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            <span className="item-qty">Qty: {item.quantity}</span>
                        </div>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                                successStep && setConfirm({
                                    message: `Submit a query about ${item.name}?`,
                                    onConfirm: () => submitEnquiry(item.name, successStep),
                                })
                            }
                            disabled={!successStep}
                        >
                            Select
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}