import './App.css';
import { ContactStep } from './components/steps/ContactStep';
import { PlanStep } from './components/steps/PlanStep';
import { ProfileStep } from './components/steps/ProfileStep';
import { Wizard } from './components/Wizard';

export type MyData = { name: string; email: string; plan: string };

function App() {

return <Wizard<MyData>
  initialData={{ name: '', email: '', plan: '' }}
  stepLabels={['Profile', 'Contact', 'Plan']}
  onComplete={(data) => console.log('Finished', data)}
  onStepChange={(step, data) => console.log('Moved to', step, data)}
>
  <ProfileStep />
  <ContactStep />
  <PlanStep />
</Wizard>
}

export default App;