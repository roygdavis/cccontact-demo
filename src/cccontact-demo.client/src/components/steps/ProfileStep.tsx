import type { MyData } from "../../App";
import { useWizard, WizardStep } from "../Wizard";

export function ProfileStep() {
  const { data, updateData } = useWizard<MyData>();
  return (
    <WizardStep
      title="Your Profile"
      validate={() => data.name.trim().length > 0 || 'Name is required'}
    >
      <input value={data.name} onChange={e => updateData({ name: e.target.value })} />
    </WizardStep>
  );
}