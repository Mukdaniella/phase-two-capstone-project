import Container from './container';
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 w-full">
      <div className="bg-white/90 backdrop-blur-md w-full shadow-lg transition-transform hover:-translate-y-1 duration-300">
        <Container>
          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-700 text-sm md:text-base">
              © {new Date().getFullYear()} MediumClone. All rights reserved.
            </p>

            {/* Social links */}
            <div className="flex gap-4 mt-3 md:mt-0">
              <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                Twitter
              </Link>
              <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                LinkedIn
              </Link>
              <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                GitHub
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
