import './globals.css';
import Header from './components/header';
import Footer from './components/footer';
import React from 'react';
import ClientProvider from './components/clientprovider'; // we'll create this

export const metadata = {
  title: 'Medium Clone — Frontend Capstone',
  description: 'A modern publishing platform built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative bg-gray-50 text-gray-900 font-sans">
        {/* Background Gradient Animation */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                        animate-gradient-slow opacity-30"></div>

        <ClientProvider>
          <Header />
          <main className="container mx-auto px-4 py-12 md:py-16">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12">
              {children}
            </div>
          </main>
          <Footer />
        </ClientProvider>

      </body>
    </html>
  );
}
