import { useState } from 'react';
import './App.css';
import { Flows } from './Flows';
import type { FlowOption } from './Flows';

// ─── Types ───────────────────────────────────────────────────────────────────

type Step =
  | 'initial'
  | 'orderVerification'
  | 'orderOptions'
  | 'orderItems'
  | 'orderTracking'
  | 'enquiryOptions'
  | 'success';

interface ApiOrderData {
  trackingUrl: string;
  items: { id: string; name: string; quantity: number }[];
}

interface ConfirmConfig {
  message: string;
  onConfirm: () => void;
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  config,
  isLoading,
  onCancel,
}: {
  config: ConfirmConfig;
  isLoading: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
        <p className="confirm-message">{config.message}</p>
        <div className="btn-row">
          <button
            className="btn btn-primary"
            onClick={config.onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting…' : 'Yes, submit'}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [step, setStep] = useState<Step>('initial');
  const [history, setHistory] = useState<Step[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevStep, setPrevStep] = useState<Step | null>(null);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [apiData, setApiData] = useState<ApiOrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmConfig | null>(null);

  // ── Navigation ──────────────────────────────────────────────────────────────

  const navigateTo = (next: Step) => {
    setDirection('forward');
    setPrevStep(step);
    setHistory(h => [...h, step]);
    setStep(next);
    setIsTransitioning(true);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setDirection('back');
    setPrevStep(step);
    setHistory(h => h.slice(0, -1));
    setStep(prev);
    setIsTransitioning(true);
  };

  const handleAnimationEnd = () => {
    setIsTransitioning(false);
    setPrevStep(null);
  };

  // ── API calls ───────────────────────────────────────────────────────────────

  /** Validate order number + email against the API, then proceed to order options. */
  const handleOrderVerify = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Placeholder API call — CORS failures are swallowed so mock data is always used
      await fetch('https://example.com/api/validate-order', {
        method: 'POST',
        body: JSON.stringify({ orderNumber, email }),
      }).catch(() => { /* ignore network/CORS errors */ });

      // TODO: replace mock data with real API response
      setApiData({
        trackingUrl: `https://track.example.com/track?order=${encodeURIComponent(orderNumber)}`,
        items: [
          { id: '1', name: 'Hiking Boots', quantity: 1 },
          { id: '2', name: 'Waterproof Jacket', quantity: 1 },
          { id: '3', name: 'Thermal Socks', quantity: 2 },
        ],
      });

      navigateTo('orderOptions');
    } finally {
      setIsLoading(false);
    }
  };

  /** Submit the enquiry to the API and navigate to the success screen. */
  const submitEnquiry = async (label: string) => {
    setConfirm(null);
    setIsLoading(true);
    try {
      await fetch('https://example.com/api/enquiry', {
        method: 'POST',
        body: JSON.stringify({ option: label, email, orderNumber }),
      }).catch(() => { /* ignore network/CORS errors */ });

      navigateTo('success');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Option selection handlers ───────────────────────────────────────────────

  const handleOrderOptionSelect = (option: FlowOption) => {
    if (option.showItems) {
      navigateTo('orderItems');
    } else if (option.showTracking) {
      navigateTo('orderTracking');
    } else {
      setConfirm({
        message: `Submit a query about "${option.label}"?`,
        onConfirm: () => submitEnquiry(option.label),
      });
    }
  };

  const handleEnquiryOptionSelect = (option: FlowOption) => {
    if (option.link) {
      window.open(option.link, '_blank', 'noopener,noreferrer');
    } else {
      setConfirm({
        message: `Submit a query about "${option.label}"?`,
        onConfirm: () => submitEnquiry(option.label),
      });
    }
  };

  // ── Render steps ────────────────────────────────────────────────────────────

  const renderStep = (s: Step) => {
    switch (s) {

      // ── Step 1: initial yes / no ─────────────────────────────────────────
      case 'initial':
        return (
          <div className="step-content">
            <h2>Is your query related to an order you have already placed?</h2>
            <div className="btn-row mt-4">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigateTo('orderVerification')}
              >
                Yes
              </button>
              <button
                className="btn btn-outline-secondary btn-lg"
                onClick={() => navigateTo('enquiryOptions')}
              >
                No
              </button>
            </div>
          </div>
        );

      // ── Step 2a: order — enter order number + email ──────────────────────
      case 'orderVerification':
        return (
          <div className="step-content">
            <h2>Let's look up your order</h2>
            <p className="text-muted">
              Please enter your order number and the email address used when placing the order.
            </p>
            <div className="mb-3">
              <label htmlFor="orderNumber" className="form-label">Order number</label>
              <input
                id="orderNumber"
                type="text"
                className="form-control"
                placeholder="e.g. M123456"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button
              className="btn btn-primary w-100"
              onClick={handleOrderVerify}
              disabled={isLoading || !orderNumber.trim() || !email.trim()}
            >
              {isLoading ? 'Verifying…' : 'Continue →'}
            </button>
          </div>
        );

      // ── Step 2b: order options ───────────────────────────────────────────
      case 'orderOptions':
        return (
          <div className="step-content">
            <h2>What can we help you with?</h2>
            <p className="text-muted">
              Select the option that best describes your query about order{' '}
              <strong>{orderNumber}</strong>.
            </p>
            <div className="options-list">
              {Flows.orders.map((option, i) => (
                <button
                  key={i}
                  className="option-btn"
                  onClick={() => handleOrderOptionSelect(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );

      // ── Step 2c: show order items from API (faulty / missing) ────────────
      case 'orderItems':
        return (
          <div className="step-content">
            <h2>Which item does this relate to?</h2>
            <p className="text-muted">
              Please select the item from your order that this query is about.
            </p>
            <div className="items-list">
              {apiData?.items.map(item => (
                <div key={item.id} className="item-card">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">Qty: {item.quantity}</span>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      setConfirm({
                        message: `Submit a query about ${item.name}?`,
                        onConfirm: () => submitEnquiry(item.name),
                      })
                    }
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      // ── Step 2d: tracking link ───────────────────────────────────────────
      case 'orderTracking':
        return (
          <div className="step-content">
            <h2>Track your order</h2>
            <p className="text-muted">
              Use the link below to see the current status and delivery details for your order.
            </p>
            <a
              href={apiData?.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg tracking-btn"
            >
              Track my order →
            </a>
            <p className="small text-muted mt-3">Opens tracking page in a new tab</p>
          </div>
        );

      // ── Step 3: enquiry options (not about an order) ─────────────────────
      case 'enquiryOptions':
        return (
          <div className="step-content">
            <h2>How can we help you today?</h2>
            <p className="text-muted">
              Select the option that best describes your query. Options marked with{' '}
              <span className="link-arrow">↗</span> will open a dedicated page.
            </p>
            <div className="options-list">
              {Flows.enquiries.map((option, i) => (
                <button
                  key={i}
                  className={`option-btn${option.link ? ' option-btn--link' : ''}`}
                  onClick={() => handleEnquiryOptionSelect(option)}
                >
                  <span>{option.label}</span>
                  {option.link && <span className="link-arrow">↗</span>}
                </button>
              ))}
            </div>
          </div>
        );

      // ── Success ──────────────────────────────────────────────────────────
      case 'success':
        return (
          <div className="step-content success-step">
            <div className="success-icon">✓</div>
            <h2>Query submitted!</h2>
            <p className="text-muted">
              Thank you for getting in touch. A member of our team will be in contact with you
              shortly.
            </p>
            <button
              className="btn btn-outline-secondary mt-4"
              onClick={() => {
                setStep('initial');
                setHistory([]);
                setOrderNumber('');
                setEmail('');
                setApiData(null);
                setError(null);
                setConfirm(null);
                setIsTransitioning(false);
              }}
            >
              Start over
            </button>
          </div>
        );
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="app-container">
      {/* Back button — hidden on first step and success screen */}
      {history.length > 0 && step !== 'success' && (
        <button
          className="btn btn-outline-secondary btn-sm back-btn"
          onClick={goBack}
          disabled={isTransitioning || isLoading}
        >
          ← Back
        </button>
      )}

      {/* Sliding wizard viewport */}
      <div className="wizard-viewport">
        {isTransitioning && prevStep && (
          <div
            className={`wizard-step ${
              direction === 'forward' ? 'slide-exit' : 'slide-exit-back'
            }`}
          >
            {renderStep(prevStep)}
          </div>
        )}
        <div
          className={`wizard-step${
            isTransitioning
              ? direction === 'forward'
                ? ' slide-enter'
                : ' slide-enter-back'
              : ''
          }`}
          onAnimationEnd={handleAnimationEnd}
        >
          {renderStep(step)}
        </div>
      </div>

      {/* Confirmation dialog overlay */}
      {confirm && (
        <ConfirmDialog
          config={confirm}
          isLoading={isLoading}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

export default App;

