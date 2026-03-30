import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNextClicked = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data: { category_index: number; category_text: string } = await res.json();
      navigate(`/help/${data.category_index}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleNextClicked();
  };

  return (
    <>
      <h1>Hello</h1>
      <p>How can we help you today?</p>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type something..."
        disabled={loading}
      />
      <button onClick={handleNextClicked} disabled={loading || !query.trim()}>
        {loading ? 'Thinking…' : 'Next'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
}
