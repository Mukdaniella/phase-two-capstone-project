'use client';

import Link from 'next/link';
import Container from './container';
import { useSession, signOut } from 'next-auth/react';
import React, { useState } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:block">
              {session ? (
                <div className="flex items-center gap-6">
                  <ul className="flex gap-6 text-gray-700 font-medium items-center">
                    <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
                    <li><Link href="/posts" className="hover:text-blue-600 transition-colors">Posts</Link></li>
                    <li><Link href="/editor" className="hover:text-blue-600 transition-colors">New Post</Link></li>
                    <li><Link href="/profile" className="hover:text-blue-600 transition-colors">Profile</Link></li>
                    <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link></li>
                  </ul>
                  <div className="flex items-center gap-3 border-l pl-6">
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-gray-600">Welcome, {session.user?.email}</span>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Logout</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>Not logged in</span>
                  </div>
                  <ul className="flex gap-6 text-gray-700 font-medium">
                    <li><Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link></li>
                    <li><Link href="/signup" className="hover:text-blue-600 transition-colors">Register</Link></li>
                  </ul>
                </div>
              )}
            </nav>
          </div>
        </Container>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <Container>
              <div className="py-4">
                {session ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm pb-4 border-b">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-600">{session.user?.email}</span>
                    </div>
                    <Link href="/" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link href="/posts" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Posts</Link>
                    <Link href="/editor" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>✏️ New Post</Link>
                    <Link href="/profile" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                    <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    <button onClick={handleLogout} className="w-full mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Logout</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm pb-4 border-b">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-gray-500">Not logged in</span>
                    </div>
                    <Link href="/login" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    <Link href="/signup" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Register</Link>
                  </div>
                )}
              </div>
            </Container>
          </div>
        )}
      </div>
    </header>
  );
}
