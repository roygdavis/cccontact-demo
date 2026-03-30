import { useState } from "react";
import type { WismoData } from "../../pages/Wismo";
import { useWizard, WizardStep } from "../Wizard";
import { OrderValidationDetailsStep } from "./OrderValidationDetailsStep";
import { OrderValidationModal } from "./OrderValidationModal";

export type OrderValidationType = {
    orderNumber: string;
    phoneEmailOrPostCode: string;
}

/**
 * This component is incomplete. It should handle the steps for invalidation as well as progressing the flow
 * to the next step if details are valid.
 * Note that this is a "soft" validation - one time links via email will come later if
 * certain actions are requested by the customer.
 * We might need to consider an alternative escape hatch - maybe change the contactCareVariant button to button rather than link
 **/
export function OrderValidationStep() {
    const { data } = useWizard<WismoData>();
    const [validated, setValidated] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleNext = (): Promise<boolean> => {
        if (data.orderNumber.trim().length === 0 || data.phoneEmailOrPostCode.trim().length === 0) {
            return Promise.resolve(false);
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                const found = Math.random() < 0.5;
                if (found) {
                    setValidated(true);
                    resolve(true);
                } else {
                    setShowModal(true);
                    resolve(false);
                }
            }, 1000);
        });
    };

    return (
        <>
            <WizardStep
                title="Please provide your order details"
                validate={handleNext}
                onContactCustomerCare={() => alert('reason: wismo')}
                contactCareVariant={validated ? "link" : "button"}
            >
                <OrderValidationDetailsStep />
            </WizardStep>

            {/* modal - shown when the order lookup "fails" */}
            <OrderValidationModal setShowModal={setShowModal} showModal={showModal} />
        </>
    );
}