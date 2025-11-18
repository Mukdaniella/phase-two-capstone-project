import Link from 'next/link';
import Container from './container';
import React from 'react';

export default function Header() {
  return (
    // Full-width header background
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-white/80 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1 duration-300">
        <Container>
          <div className="flex justify-between items-center py-4 md:py-6">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl md:text-3xl font-extrabold text-gray-900 hover:text-blue-600 transition-colors"
            >
              MediumClone
            </Link>

            {/* Navigation */}
            <nav>
              <ul className="flex gap-6 text-gray-700 font-medium">
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
                    New Post
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-blue-600 transition-colors">
                    Register
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </Container>
      </div>
    </header>
  );
}
