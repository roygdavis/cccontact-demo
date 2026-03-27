// Re-export shim — kept so that any existing imports of 'components/Wizard'
// continue to work. New code may also import directly from 'components/wizard'.
// eslint-disable-next-line react-refresh/only-export-components
export { Wizard, WizardStep, useWizard } from './wizard/index';
export type { WizardProps, WizardStepProps, WizardContextValue, WizardDirection } from './wizard/index';
