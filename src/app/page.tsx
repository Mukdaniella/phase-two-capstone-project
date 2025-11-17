// app/page.tsx
import Container from "./components/container";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-r from-blue-200 via-purple-400 to-pink-200 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <Container>
          <div className="text-center py-16">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
              Welcome to the Publishing Platform
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Build, share, and read stories in a modern Medium-style experience with Next.js and React.
            </p>
            <Link
              href="/about"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Learn more →
            </Link>
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <Container>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* Main Articles/Section */}
          <section className="md:col-span-2 space-y-8">
            <article className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Getting Started with Your First Post
              </h2>
              <p className="text-gray-700 mb-4">
                Learn how to create and publish your first story, customize it with rich text, and share it with readers.
              </p>
              <Link
                href="/posts/hello-world"
                className="text-blue-600 font-semibold hover:underline"
              >
                Read More →
              </Link>
            </article>

            <article className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Explore the Platform Features
              </h2>
              <p className="text-gray-700 mb-4">
                From drafts to publishing workflow, social interactions, and author profiles — see everything you can do.
              </p>
              <Link
                href="/about"
                className="text-blue-600 font-semibold hover:underline"
              >
                Learn More →
              </Link>
            </article>
          </section>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
              <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-blue-600 hover:underline">
                    Project Guide
                  </Link>
                </li>
                <li>
                  <Link href="/posts/hello-world" className="text-blue-600 hover:underline">
                    Example Post
                  </Link>
                </li>
                <li>
                  <Link href="/editor" className="text-blue-600 hover:underline">
                    Create New Post
                  </Link>
                </li>
              </ul>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
              <h3 className="font-semibold text-lg mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700">React</span>
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700">Next.js</span>
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700">Tailwind</span>
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700">Frontend</span>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
