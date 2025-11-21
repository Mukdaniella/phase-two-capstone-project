'use client';

import Link from 'next/link';
import Container from './container';
import { useSession, signOut } from 'next-auth/react';
import React from 'react';

export default function Header() {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-white/80 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1 duration-300">
        <Container>
          <div className="flex justify-between items-center py-4 md:py-6">
            <Link
              href="/"
              className="text-2xl md:text-3xl font-extrabold text-gray-900 hover:text-blue-600 transition-colors"
            >
              MediumClone
            </Link>

            <nav>
              {session ? (
                <div className="flex items-center gap-6">
                  <ul className="flex gap-6 text-gray-700 font-medium items-center">
                    <li>
                      <Link href="/" className="hover:text-blue-600 transition-colors">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="hover:text-blue-600 transition-colors">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link href="/editor" className="hover:text-blue-600 transition-colors">
                        ✏️ New Post
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile" className="hover:text-blue-600 transition-colors">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                        Dashboard
                      </Link>
                    </li>
                  </ul>
                  
                  <div className="flex items-center gap-3 border-l pl-6">
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-gray-600">Welcome, {session.user?.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>Not logged in</span>
                  </div>
                <ul className="flex gap-6 text-gray-700 font-medium">
                  <li>
                    <Link href="/login" className="hover:text-blue-600 transition-colors">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="hover:text-blue-600 transition-colors">
                      Register
                    </Link>
                  </li>
                </ul>
                </div>
              )}
            </nav>
          </div>
        </Container>
      </div>
    </header>
  );
}
