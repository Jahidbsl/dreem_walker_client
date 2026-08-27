const API_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_URL = 'http://127.0.0.1:8000/api';


export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include', // কুকি হ্যান্ডেল করার জন্য
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
}


export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}


export async function getProfile() {
  const res = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Unauthorized');
  }

  return await res.json();
}