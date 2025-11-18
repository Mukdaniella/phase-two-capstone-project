'use client';

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");   // ✅ NEW
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post('/api/auth/signup', {
        name,
        username,     // ✅ SEND USERNAME
        email,
        password,
      });

      if (res.data) {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-3xl shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register</h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSignup} className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* ✅ NEW USERNAME FIELD */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

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
          className="mt-4 py-3 px-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition duration-200"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-center text-gray-500 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-purple-500 font-medium hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
