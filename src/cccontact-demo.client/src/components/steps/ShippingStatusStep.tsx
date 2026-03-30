import { useEffect, useState } from "react";
import type { WismoData } from "../../pages/Wismo";
import { useWizard, WizardStep } from "../Wizard";
import { ShippingStatusDeliveredStep } from "./ShippingStatusDeliveredStep";
import { ShippingStatusInTransitStep } from "./ShippingStatusInTransitStep";
import { ShippingStatusLateStep } from "./ShippingStatusLateStep";

export type ShippingStatusType = {
    shippingStatus?: string;
}

export function ShippingStatusStep() {
    const { data, updateData } = useWizard<WismoData>();
    const [randomShippingStatus] = useState<string>(() => {
        const statuses = ["In Transit", "Not shipped", "Delivered", "Late"];
        return statuses[Math.floor(Math.random() * statuses.length)];
    });

    useEffect(() => {
        // Simulate fetching shipping status based on order number
        if (data.orderNumber && randomShippingStatus) {
            setTimeout(() => {
                updateData({ ...data, shippingStatus: randomShippingStatus });
            }, 3000);
        }
    }, [data, updateData, randomShippingStatus]);

    const renderStatus = () => {
        if (randomShippingStatus === "Delivered") {
            return <ShippingStatusDeliveredStep status={data.shippingStatus!} expectedDelivery="Tuesday 24th March" delivered={true} deliveryDate="Friday 20th March" orderNumber={data.orderNumber} />
        }
        if (randomShippingStatus === "In Transit") {
            return <ShippingStatusInTransitStep status={data.shippingStatus!} expectedDelivery="Tuesday 24th March" delivered={false} deliveryDate="Friday 20th March" orderNumber={data.orderNumber} />
        }
        if (randomShippingStatus === "Not shipped") {
            return <ShippingStatusInTransitStep status={data.shippingStatus!} expectedDelivery="Tuesday 24th March" delivered={false} deliveryDate="Friday 20th March" orderNumber={data.orderNumber} />
        }
        if (randomShippingStatus === "Late") {
            return <ShippingStatusLateStep status={data.shippingStatus!} expectedDelivery="Tuesday 24th March" delivered={false} deliveryDate="Friday 20th March" orderNumber={data.orderNumber} />
        }
    }

    return (
        <WizardStep
            title="Shipping Status"
            validate={() => data.orderNumber.trim().length > 0 || 'Email is required'}
        >
            {renderStatus()}
        </WizardStep>
    );
}