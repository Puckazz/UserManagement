const API_BASE = "https://jsonplaceholder.typicode.com";

async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error(`Failed to fetch users (HTTP ${res.status})`);
  return res.json();
}

async function createUser(userData) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error(`Failed to create user (HTTP ${res.status})`);
  return res.json();
}

async function updateUser(id, userData) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error(`Failed to create user (HTTP ${res.status})`);
  return res.json();
}

async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete user (HTTP ${res.status})`);
  return true;
}