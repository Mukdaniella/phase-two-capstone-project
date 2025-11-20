'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const data = await res.json();

if (res.ok) {
   localStorage.setItem("token", data.token);
  // store token manually (cookies / localStorage)
  router.push("/dashboard");
} else {
  setError(data.error);
}
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-3xl shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          type="submit"
          className="mt-4 py-3 px-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                     text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition duration-200"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-center text-gray-500 text-sm">
        Don't have an account? <a href="/signup" className="text-purple-500 font-medium hover:underline">Sign Up</a>
      </p>
    </div>
  );
}
