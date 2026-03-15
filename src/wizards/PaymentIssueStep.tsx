import { useState } from "react";

export const PaymentIssueStep = () => {
  const [helpInput, setHelpInput] = useState('');

  return (
    <div className="step-content">
      <h2>Payment Issues</h2>
      <p className="text-muted">
        Pleasd provide us with more information
      </p>
      <div className="mb-3">
        <label htmlFor="helpInput" className="form-label">Type your query here</label>
        <input
          id="helpInput"
          className="form-control"
          value={helpInput}
          onChange={e => setHelpInput(e.target.value)}
        />
      </div>
      <button className="btn btn-primary w-100" >
        Submit
      </button>
    </div>
  );
};