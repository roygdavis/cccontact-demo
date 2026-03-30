export const OrderValidationModal = (props:{setShowModal: (show: boolean) => void, showModal: boolean}) => {
    const { setShowModal, showModal } = props;
    return <div
        className={`modal fade${showModal ? ' show d-block' : ''}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="orderNotFoundModalLabel"
        style={showModal ? { backgroundColor: 'rgba(0,0,0,0.5)' } : undefined}
    >
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="orderNotFoundModalLabel">Order Not Found</h5>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setShowModal(false)}
                    />
                </div>
                <div className="modal-body">
                    <p>
                        We were unable to find an order matching the details you provided.
                        Please double-check your order number and the phone number, email address,
                        or postcode associated with the order, then try again.
                    </p>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowModal(false)}
                    >
                        Check my details
                    </button>
                </div>
            </div>
        </div>
    </div>;
}