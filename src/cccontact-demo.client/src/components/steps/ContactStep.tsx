import type { MyData } from "../../types";
import { useWizard, WizardStep } from "../Wizard";

export function ContactStep() {
  const { data, updateData } = useWizard<MyData>();
  return (
    <WizardStep
      title="Your Contact"
      validate={() => data.email.trim().length > 0 || 'Email is required'}
    >
      <input value={data.email} onChange={e => updateData({ email: e.target.value })} />
    </WizardStep>
  );
}