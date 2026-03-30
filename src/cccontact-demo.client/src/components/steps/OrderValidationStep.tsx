import type { WismoData } from "../../pages/Wismo";
import { useWizard, WizardStep } from "../Wizard";

export type OrderValidationType = {
    orderNumber: string;
    phoneEmailOrPostCode: string;
}

export function OrderValidationStep() {
    const { data, updateData } = useWizard<WismoData>();
    return (
        <WizardStep
            title="Please provide your order details"
            validate={() => data.orderNumber.trim().length > 0 || 'Email is required'}
        >
            <input value={data.orderNumber} onChange={e => updateData({ ...data, orderNumber: e.target.value })} />
            <input value={data.phoneEmailOrPostCode} onChange={e => updateData({ ...data, phoneEmailOrPostCode: e.target.value })} />
        </WizardStep>
    );
}