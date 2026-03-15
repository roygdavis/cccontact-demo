import { useWizard } from '../WizardContext';

export const OrderLookupWizard = () => {
    const {
        orderNumber, setOrderNumber,
        email, setEmail,
        isLoading, error,
        currentStep, verifyOrder,
    } = useWizard();

    // After a successful order verification, advance to the options menu.
    // currentStep.next[0] is the OrderOptionsWizard node in the WizardSteps tree.
    const nextStep = currentStep?.next?.[0];

    return (
        <div className="step-content">
            <h2>Let's look up your order</h2>
            <p className="text-muted">
                Please enter your order number and the email address used when placing the order.
            </p>
            <div className="mb-3">
                <label htmlFor="orderNumber" className="form-label">Order number</label>
                <input
                    id="orderNumber"
                    type="text"
                    className="form-control"
                    placeholder="e.g. M123456"
                    value={orderNumber}
                    onChange={e => setOrderNumber(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button
                className="btn btn-primary w-100"
                onClick={() => nextStep && verifyOrder(nextStep)}
                disabled={isLoading || !orderNumber.trim() || !email.trim() || !nextStep}
            >
                {isLoading ? 'Verifying…' : 'Continue →'}
            </button>
        </div>
    );
};
