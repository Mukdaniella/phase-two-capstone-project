const BASE_URL = process.env.SUPABASE_URL;
const API_KEY = process.env.SUPABASE_ANON_KEY;

export async function getPosts() {
  const res = await fetch(`${BASE_URL}/rest/v1/posts?status=eq.published&select=*`, {
    headers: {
      apikey: API_KEY!,
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return res.json();
}

export async function getPostBySlug(slug: string) {
  const res = await fetch(`${BASE_URL}/rest/v1/posts?slug=eq.${slug}&select=*`, {
    headers: {
      apikey: API_KEY!,
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  const data = await res.json();
  return data[0];
}

export async function createPost(post: any) {
  const res = await fetch(`${BASE_URL}/rest/v1/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: API_KEY!,
      Authorization: `Bearer ${API_KEY}`,
      Prefer: 'return=representation', // optional: returns created row
    },
    body: JSON.stringify(post),
  });
  return res.json();
}

export async function updatePost(id: string, updates: any) {
  const res = await fetch(`${BASE_URL}/rest/v1/posts?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      apikey: API_KEY!,
      Authorization: `Bearer ${API_KEY}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deletePost(id: string) {
  const res = await fetch(`${BASE_URL}/rest/v1/posts?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      apikey: API_KEY!,
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return res.json();
}
