const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("VITE_API_URL is missing. Check client/.env or Vercel settings.");
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}/api/products${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export const getProducts = () => request("");

export const createProduct = (data) =>
  request("", { method: "POST", body: JSON.stringify(data) });

export const updateProduct = (id, data) =>
  request(`/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteProduct = (id) => request(`/${id}`, { method: "DELETE" });
