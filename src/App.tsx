import { useState } from 'react';
import './App.css'
import mwLogo from './assets/mw-logo-light.svg';

type wizardState = "decisionCapture" | "orderNumberEntry" | "decisionTree" | "captureEmail" | "alternativeFlow" ;
type categories = "Delivery and Store Collections" | "Product Support" | "Store Query" | "Returns and Refunds"
  | "Payment/Promos/Gift Cards" | "Technical" | "Order Support" | "Other" | null;

function App() {
  const [wizardState, setWizardState] = useState<wizardState>("decisionCapture");
  const [orderNumber, setOrderNumber] = useState('');
  const [decisionTreeSelection, setDecisionTreeSelection] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<categories>(null);

  return (
    <div className='d-flex flex-column align-items-center gap-5'>
      <div className='text-bg-secondary p-3'>
        <img src={mwLogo} className="logo" alt="MW logo" />
      </div>
      
      {wizardState === "decisionCapture" && <><h2>Is your query related to an order?</h2>
        <div className="d-flex w-25 justify-content-between">
          <button className="btn btn-secondary" onClick={() => setWizardState("orderNumberEntry")}>Yes</button>
          <button className="btn btn-secondary" onClick={() => setWizardState("alternativeFlow")}>No</button>
        </div>        
      </>}      
      
      {wizardState === "orderNumberEntry" && <><h2>If you have one, enter your order number</h2>
        <div className="card">
          <input type="text" onChange={e => setOrderNumber(e.currentTarget.value)} value={orderNumber} className="form-control" placeholder="M123454" aria-label="Order number" aria-describedby="button-addon2" />
          <button className="btn btn-secondary" type="button" id="button-addon2" onClick={() => setWizardState("decisionTree")}>Submit</button>
        </div>
      <button className="btn btn-secondary" type="button" id="button-addon2" onClick={() => setWizardState("decisionTree")}>I can't find my order number</button>
      </>}
      {wizardState === "decisionTree" && <><h2>What can we help you with?</h2>
        <div className="mb-3">
          <select className="form-select" aria-label="Default select example" onChange={e => setDecisionTreeSelection(e.currentTarget.value)} value={decisionTreeSelection}>
            <option selected>Select option</option>
            <option value="1">I've not received my order</option>
            <option value="2">One or more of my items has a fault</option>
            <option value="3">One or more of my items is missing</option>
          </select>
          <button className="btn btn-secondary" type="button" id="button-addon2" onClick={() => setWizardState("captureEmail")}>Submit</button>
        </div>
        <div className="mb-3">
          <button className="btn btn-secondary" type="button" id="button-addon2" onClick={() => setWizardState("alternativeFlow")}>I want to do isn't listed</button>
        </div>
      </>}
      {wizardState === "captureEmail" && <><h2>Almost there! Please enter your email address that you used when you placed your order.</h2>
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.currentTarget.value)} className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
        </div>
      </>}
      {wizardState === "captureEmail" && <><h2>Almost there! Please enter your email address that you used when you placed your order.</h2>
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.currentTarget.value)} className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
        </div>
      </>}
    </div>
  )
}

export default App
