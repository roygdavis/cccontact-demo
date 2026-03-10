import { useState } from 'react';
import './App.css'
import mwLogo from './assets/mw-logo-light.svg';

type wizardState = "decisionCapture" | "orderNumberEntry" | "orderDecisionOptions" | "captureEmail" | "alternativeFlow"
  | "orderActions";
type categories = "Delivery and Store Collections" | "Product Support" | "Store Query" | "Returns and Refunds"
  | "Payment/Promos/Gift Cards" | "Technical" | "Order Support" | "Other" | null;

function App() {
  const [wizardState, setWizardState] = useState<wizardState>("decisionCapture");
  const [prevState, setPrevState] = useState<wizardState | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [decisionTreeSelection, setDecisionTreeSelection] = useState('');
  const [email, setEmail] = useState('');
   const [category, setCategory] = useState<categories>(null);

  const navigateTo = (next: wizardState) => {
    setPrevState(wizardState);
    setWizardState(next);
    setIsTransitioning(true);
  };

  const handleAnimationEnd = () => {
    setIsTransitioning(false);
    setPrevState(null);
  };

  const renderStep = (state: wizardState) => {
    switch (state) {
      case "decisionCapture":
        return <>
          <h2>Is your query related to an existing order?</h2>
          <div className="btn-group">
            <button className="btn btn-secondary" onClick={() => navigateTo("orderNumberEntry")}>Yes</button>
            <button className="btn btn-secondary" onClick={() => navigateTo("alternativeFlow")}>No</button>
          </div>
        </>;
      case "orderNumberEntry":
        return <>
          <h2>If you have one, enter your order number</h2>
          <div className="card">
            <input type="text" onChange={e => setOrderNumber(e.currentTarget.value)} value={orderNumber} className="form-control" placeholder="M123454" aria-label="Order number" aria-describedby="button-addon2" />
            <button className="btn btn-secondary" type="button" id="button-addon2" onClick={() => navigateTo("orderDecisionOptions")}>Submit</button>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => navigateTo("orderDecisionOptions")}>I can't find my order number</button>
        </>;
      case "orderDecisionOptions":
        return <>
          <h2>What can we help you with?</h2>
          <div className="mb-3">
            <select className="form-select" aria-label="Default select example" onChange={e => {
              setDecisionTreeSelection(e.currentTarget.value);
              navigateTo("orderActions");
            }
            } value={decisionTreeSelection}>
              <option>Select option</option>
              <option value="1">I've not received my order</option>
              <option value="2">One or more of my items has a fault</option>
              <option value="3">One or more of my items is missing</option>
              <option value="4">I want to cancel my order</option>
            </select>
            <button className="btn btn-secondary" type="button" onClick={() => navigateTo("captureEmail")}>Submit</button>
          </div>
          <div className="mb-3">
            <button className="btn btn-secondary" type="button" onClick={() => navigateTo("alternativeFlow")}>What I want to do isn't listed</button>
          </div>
        </>;
      case "orderActions":
        return <>
          <h2>Here are some actions we can take to resolve your issue...</h2>
        </>;
      case "captureEmail":
        return <>
          <h2>Almost there! Please enter your email address that you used when you placed your order.</h2>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.currentTarget.value)} className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
          </div>
        </>;
      case "alternativeFlow":
        return <>
          <h2>Please select from one of these options.</h2>
          <select className="form-select" aria-label="Default select example" onChange={e => setCategory(e.currentTarget.value as categories)} value={category || ''}>
            <option value="Delivery and Store Collections" >Delivery and Store Collections</option>
            <option value="Product Support" >Product Support</option>
            <option value="Store Query" >Store Query</option>
            <option value="Returns and Refunds">Returns and Refund</option>
            <option value="Payment/Promos/Gift Cards" >Payment/Promos/Gift Cards</option>
            <option value="Technical" >Technical</option>
            <option value="Order Support" >Order Support</option>
            <option value="Other">Other</option>
          </select>
        </>;
    }
  };

  return (
    <div className='d-flex flex-column align-items-center gap-5'>
      <div className='text-bg-secondary p-3'>
        <img src={mwLogo} className="logo" alt="MW logo" />
      </div>

      <div className="wizard-viewport">
        {isTransitioning && prevState && (
          <div className="wizard-step slide-exit">
            {renderStep(prevState)}
          </div>
        )}
        <div
          className={`wizard-step${isTransitioning ? ' slide-enter' : ''}`}
          onAnimationEnd={handleAnimationEnd}
        >
          {renderStep(wizardState)}
        </div>
      </div>
    </div>
  );
}

export default App;
