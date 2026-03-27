import type { MyData } from "../../App";
import { useWizard, WizardStep } from "../Wizard";

export function PlanStep() {
  const { data, updateData } = useWizard<MyData>();
  return (
    <WizardStep
      title="Your Plan"
      validate={() => data.plan.trim().length > 0 || 'Plan is required'}
    >
      <input value={data.plan} onChange={e => updateData({ plan: e.target.value })} />
    </WizardStep>
  );
}