import { useContext } from 'react';
import { WizardContext, WizardContextValue } from './WizardContext';

/**
 * Access the wizard context from within a WizardStep.
 *
 * Provide the same generic type T you passed as `initialData` to `<Wizard>` so
 * you get fully-typed access to `data` and `updateData`.
 *
 * @example
 * ```tsx
 * const { data, updateData, nextStep } = useWizard<MyWizardData>();
 * ```
 */
export function useWizard<T extends object = Record<string, unknown>>(): WizardContextValue<T> {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error(
      '[useWizard] must be called inside a <Wizard> component. ' +
        'Make sure your step component is a direct or nested child of <Wizard>.',
    );
  }
  return context as WizardContextValue<T>;
}
