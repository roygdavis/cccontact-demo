import { ContactStep } from "../components/steps/ContactStep"
import { PlanStep } from "../components/steps/PlanStep"
import { ProfileStep } from "../components/steps/ProfileStep"
import { Wizard } from "../components/Wizard"

import type { MyData } from "../types";

export const AnythingElse = () => {
    return (
    <Wizard<MyData>
        initialData={{ name: '', email: '', plan: '' }}
        stepLabels={['Profile', 'Contact', 'Plan']}
        onComplete={(data) => console.log('Finished', data)}
        onStepChange={(step, data) => console.log('Moved to', step, data)}
    >
        <ProfileStep />
        <ContactStep />
        <PlanStep />
    </Wizard>
    );
}