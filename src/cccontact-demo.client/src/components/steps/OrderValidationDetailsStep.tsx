import type { WismoData } from "../../pages/Wismo";
import { useWizard } from "../Wizard";

/**
 * This component is incomplete. It should handle the steps for invalidation as well as progressing the flow
 * to the next step if details are valid.
 * Note that this is a "soft" validation - one time links via email will come later if
 * certain actions are requested by the customer
 **/
export function OrderValidationDetailsStep() {
    const { data, updateData } = useWizard<WismoData>();
    return (<>
        <div className="mb-3">
            <label htmlFor="orderNumberInput" className="form-label">Order number</label>
            <input type="text" className="form-control" id="orderNumberInput" placeholder="M123456"
                value={data.orderNumber} onChange={e => updateData({ ...data, orderNumber: e.target.value })} />
        </div>
        <div className="mb-3">
            <label htmlFor="phoneEmailOrPostCodeInput" className="form-label">The Phone, Email, or Post Code associated with the order</label>
            <input type="text" className="form-control" id="phoneEmailOrPostCodeInput" placeholder="Enter your phone, email, or post code"
                value={data.phoneEmailOrPostCode} onChange={e => updateData({ ...data, phoneEmailOrPostCode: e.target.value })} />
        </div>
    </>
    );
}