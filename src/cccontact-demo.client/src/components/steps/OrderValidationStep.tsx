import { useEffect, useState } from "react";
import type { WismoData } from "../../pages/Wismo";
import { useWizard, WizardStep } from "../Wizard";
import { OrderValidationDetailsStep } from "./OrderValidationDetailsStep";

export type OrderValidationType = {
    orderNumber: string;
    phoneEmailOrPostCode: string;
}

/**
 * This component is incomplete. It should handle the steps for invalidation as well as progressing the flow
 * to the next step if details are valid.
 * Note that this is a "soft" validation - one time links via email will come later if
 * certain actions are requested by the customer
 **/
export function OrderValidationStep() {
    const { data } = useWizard<WismoData>();
    const [validated, setValidated] = useState(false);

    const handleNext = (): Promise<boolean> => {
        if (data.orderNumber.trim().length === 0 || data.phoneEmailOrPostCode.trim().length === 0) {
            return Promise.resolve("Cannot proceed: Order number and phone/email/post code are required" as unknown as boolean);
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                setValidated(true);
                resolve(true);
            }, 1000);
        });
    }

    return (
        <WizardStep
            title="Please provide your order details"
            validate={handleNext}
            onContactCustomerCare={() => alert('reason: wismo')}
            contactCareVariant={validated ? "link" : "button"}
        >
            <OrderValidationDetailsStep />
        </WizardStep>
    );
}