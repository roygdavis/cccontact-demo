import { useEffect } from "react";
import type { WismoData } from "../../pages/Wismo";
import { useWizard, WizardStep } from "../Wizard";

export type ShippingStatusType = {
    shippingStatus?: string;
}

export function ShippingStatusStep() {
    const { data, updateData } = useWizard<WismoData>();

    useEffect(() => {
        // Simulate fetching shipping status based on order number
        if (data.orderNumber) {
            setTimeout(() => {
                updateData({ ...data, shippingStatus: 'In Transit' });
            }, 1000);
        }
    }, [data, updateData]);

    return (
        <WizardStep
            title="Shipping Status"
            validate={() => data.orderNumber.trim().length > 0 || 'Email is required'}
        >
            <div className="d-flex">
<input value={data.orderNumber} onChange={e => updateData({ ...data, orderNumber: e.target.value })} />
            <input value={data.phoneEmailOrPostCode} onChange={e => updateData({ ...data, phoneEmailOrPostCode: e.target.value })} />
            </div>
            
        </WizardStep>
    );
}