import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import { Wismo } from './pages/Wismo';
import { Marketing } from './pages/Marketing';
import { Missing } from './pages/Missing';
import { Faulty } from './pages/Faulty';
import { AnythingElse } from './pages/AnythingElse';
import './App.css';

/**
 * category_index values returned by the AI agent:
 *  1 → Where is my order        → /help/1 → Wismo
 *  2 → Marketing preferences    → /help/2 → Marketing
 *  3 → Returns or missing items  → /help/3 → Missing
 *  4 → Guarantees or faulty      → /help/4 → Faulty
 *  5 → Anything else             → /help/5 → AnythingElse
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/help/1" element={<Wismo />} />
      <Route path="/help/2" element={<Marketing />} />
      <Route path="/help/3" element={<Missing />} />
      <Route path="/help/4" element={<Faulty />} />
      <Route path="/help/5" element={<AnythingElse />} />
      {/* Fallback — unknown category index sends back to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}