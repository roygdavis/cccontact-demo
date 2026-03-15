import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { WizardStep } from './Flows';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface ApiOrderData {
  trackingUrl: string;
  items: OrderItem[];
}

export interface ConfirmConfig {
  message: string;
  onConfirm: () => void;
}

export interface WizardContextValue {
  // ── Captured data ──────────────────────────────────────────────────────────
  orderNumber: string;
  setOrderNumber: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  apiData: ApiOrderData | null;
  isLoading: boolean;
  error: string | null;
  description: string;
  setDescription: (v: string) => void;

  // ── Navigation ─────────────────────────────────────────────────────────────
  /** The WizardStep node currently being rendered */
  currentStep: WizardStep | null;
  navigateTo: (step: WizardStep) => void;
  goBack: () => void;

  // ── Actions ────────────────────────────────────────────────────────────────
  /** Validate order + email then advance to the next step provided */
  verifyOrder: (nextStep: WizardStep) => Promise<void>;
  /** Submit an enquiry label to the API then navigate to the given success step */
  submitEnquiry: (label: string, successStep: WizardStep) => Promise<void>;
  /** Show the confirmation dialog */
  confirm: ConfirmConfig | null;
  setConfirm: (config: ConfirmConfig | null) => void;
  /** Reset all state back to the initial split screen */
  reset: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used inside <WizardProvider>');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface WizardProviderProps {
  children: ReactNode;
  /** Called by App when navigation occurs so it can drive the slide animation.
   *  `exitingStep` is the step that was active before the change. */
  onNavigate: (direction: 'forward' | 'back', exitingStep: WizardStep | null) => void;
  onReset: () => void;
}

export function WizardProvider({ children, onNavigate, onReset }: WizardProviderProps) {
  // ── Captured data ────────────────────────────────────────────────────────
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [apiData, setApiData] = useState<ApiOrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmConfig | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  // ── Navigation stack (managed here; App mirrors it for animation) ─────────
  const [stack, setStack] = useState<WizardStep[]>([]);

  const currentStep = stack.length > 0 ? stack[stack.length - 1] : null;

  const navigateTo = useCallback((step: WizardStep) => {
    // Read the current top *before* updating state, then fire both updates
    // separately so neither setState call happens inside the other's updater.
    const exitingStep = stack.length > 0 ? stack[stack.length - 1] : null;
    onNavigate('forward', exitingStep);
    setStack(s => [...s, step]);
  }, [stack, onNavigate]);

  const goBack = useCallback(() => {
    if (stack.length === 0) return;
    // The exiting step is the current top.
    onNavigate('back', stack[stack.length - 1]);
    setStack(s => s.slice(0, -1));
  }, [stack, onNavigate]);

  const reset = useCallback(() => {
    setStack([]);
    setOrderNumber('');
    setEmail('');
    setApiData(null);
    setError(null);
    setConfirm(null);
    setIsLoading(false);
    onReset();
    setDescription(null);
  }, [onReset]);

  // ── API actions ───────────────────────────────────────────────────────────

  const verifyOrder = useCallback(async (nextStep: WizardStep) => {
    setIsLoading(true);
    setError(null);
    try {
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

      navigateTo(nextStep);
    } finally {
      setIsLoading(false);
    }
  }, [orderNumber, email, navigateTo]);

  const submitEnquiry = useCallback(async (label: string, successStep: WizardStep) => {
    setConfirm(null);
    setIsLoading(true);
    try {
      await fetch('https://example.com/api/enquiry', {
        method: 'POST',
        body: JSON.stringify({ option: label, email, orderNumber }),
      }).catch(() => { /* ignore network/CORS errors */ });

      navigateTo(successStep);
    } finally {
      setIsLoading(false);
    }
  }, [email, orderNumber, navigateTo]);

  // ── Value ─────────────────────────────────────────────────────────────────

  const value: WizardContextValue = {
    orderNumber, setOrderNumber,
    email, setEmail,
    apiData,
    isLoading,
    error,
    currentStep,
    navigateTo,
    goBack,
    verifyOrder,
    submitEnquiry,
    confirm, setConfirm,
    reset,
    description,
    setDescription
  };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}

