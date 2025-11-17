const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function fetcher(path: string, opts?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
