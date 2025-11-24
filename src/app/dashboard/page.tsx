'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  _count: {
    Likes: number;
    comments: number;
  };
}

interface PostsData {
  published: Post[];
  drafts: Post[];
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostsData>({ published: [], drafts: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');

  useEffect(() => {
    if (session) {
      fetchPosts();
    }
  }, [session]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts/user');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">
        Please log in to view your dashboard.
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-20 text-gray-600 text-lg">Loading...</div>;
  }

  const PostCard = ({ post }: { post: Post }) => (
    <div className="p-6 bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
      {post.excerpt && (
        <p className="text-gray-700 mb-4 line-clamp-2">{post.excerpt}</p>
      )}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-blue-600 mb-1">{post._count.Likes}</div>
          <div className="text-gray-600 text-sm">Likes</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-purple-600 mb-1">{post._count.comments}</div>
          <div className="text-gray-600 text-sm">Comments</div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mb-4">
        {activeTab === 'published' 
          ? new Date(post.publishedAt!).toLocaleDateString()
          : new Date(post.updatedAt).toLocaleDateString()}
      </div>
      {activeTab === 'published' && (
        <div className="text-center">
          <Link 
            href={`/posts/${post.slug}`}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            View Post
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-16 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your posts and content</p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('published')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'published'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Published ({posts.published.length})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'drafts'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Drafts ({posts.drafts.length})
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeTab === 'published' && posts.published.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-lg mb-4">No published posts yet</p>
            <Link 
              href="/editor"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Create your first post
            </Link>
          </div>
        )}
        
        {activeTab === 'drafts' && posts.drafts.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-lg mb-4">No drafts saved</p>
            <Link 
              href="/editor"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Start writing
            </Link>
          </div>
        )}

        {activeTab === 'published' && posts.published.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        
        {activeTab === 'drafts' && posts.drafts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
