import { createContext } from 'react';

/** Direction of the most recent step transition. */
export type WizardDirection = 'forward' | 'backward' | 'none';

/**
 * The full context value exposed to every child of a Wizard.
 * T is the accumulated data type; it is inferred from the `initialData` prop.
 */
export interface WizardContextValue<T extends object = Record<string, unknown>> {
  /** Accumulated data shared across all steps. */
  data: T;
  /** Merge a partial update into the wizard data. */
  updateData: (partial: Partial<T>) => void;
  /** Zero-based index of the currently active step. */
  currentStep: number;
  /** Total number of steps. */
  totalSteps: number;
  /** Advance to the next step (or fire `onComplete` on the last step). */
  nextStep: () => void;
  /** Go back one step. No-op on the first step or when `allowBackNavigation` is false. */
  prevStep: () => void;
  /** Jump directly to any step index. Respects `allowBackNavigation`. */
  goToStep: (index: number) => void;
  /** True when the wizard is on step 0. */
  isFirstStep: boolean;
  /** True when the wizard is on the final step. */
  isLastStep: boolean;
  /** Optional labels for each step, displayed beneath the progress bullets. */
  stepLabels: string[];
  /** Set of step indices that have already been submitted/completed. */
  completedSteps: Set<number>;
  /** Direction of the transition that is currently playing (or just played). */
  direction: WizardDirection;
  /** True while a slide animation is in progress. */
  isTransitioning: boolean;
  /** Whether back-navigation is permitted by the Wizard configuration. */
  allowBackNavigation: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WizardContext = createContext<WizardContextValue<any> | null>(null);
