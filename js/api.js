const API_BASE = "https://jsonplaceholder.typicode.com";

async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error(`Failed to fetch users (HTTP ${res.status})`);
  return res.json();
}