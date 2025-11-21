'use client';

import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Welcome, {session?.user?.email}</p>
        <p>This is your dashboard - only visible when logged in.</p>
      </div>
    </div>
  );
}
