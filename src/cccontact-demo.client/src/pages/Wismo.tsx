import { OrderValidationStep, type OrderValidationType } from "../components/steps/OrderValidationStep"
import { ShippingStatusStep, type ShippingStatusType } from "../components/steps/ShippingStatusStep"
import { Wizard } from "../components/Wizard"

export type WismoData = OrderValidationType & ShippingStatusType;

export const Wismo = () => {
    
    const handleStepChange = (step: number, data: WismoData) => {
        console.log('Moved to', step, data);
    };
    
    
    return (
    <Wizard<WismoData>
        initialData={{ orderNumber: '', phoneEmailOrPostCode: '' }}
        stepLabels={['Order number', 'Shipping status']}
        onComplete={(data) => console.log('Finished', data)}
        onStepChange={handleStepChange}
    >
        <OrderValidationStep />
        <ShippingStatusStep />
    </Wizard>
    );
}