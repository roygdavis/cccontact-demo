export function ShippingStatusInTransitStep(props: {
    status: string,
    expectedDelivery: string,
    delivered:boolean,
    deliveryDate: string,
    orderNumber: string
}) {
    
    return (
        <div className="d-flex flex-row mb-3 justify-content-center">
            <div className="card" style={{ width: '18rem' }}>
                <div className="card-body">
                    <h5 className="card-title bg-warning">Shipping Status for Order {props.orderNumber}</h5>
                    <div className="bg-warning">
                        <p className="card-text">{props.status}</p>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column justify-content-start align-self-start mb-3">
                <p className="text-start">Your order was shipped on Friday 20th March</p>
                <p className="text-start">Your order is in transit</p>
                <p className="text-start">Your order should not arrive no later than Tuesday 24th March</p>
            </div>
        </div>
    );
}