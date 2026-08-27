'use client';
import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/auth'; // আপনার পাথ অনুযায়ী

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      
        // window.location.href = '/login';
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p>Welcome back, {user?.name}!</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}