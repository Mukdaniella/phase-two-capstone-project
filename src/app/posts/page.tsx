'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from "next/link";
import LikeButton from "../components/likebutton";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImageUrl?: string;
  _count: {
    Likes: number;
  };
  Likes: Array<{ userId: string }>;
}

export default function PostsPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
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

  if (loading) {
    return <div className="text-center mt-20">Loading posts...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8 bg-white rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Posts</h1>

      {posts.map((post) => (
        <div key={post.id} className="mb-6 border rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200">
          <Link href={`/posts/${post.slug}`}>
            {post.coverImageUrl && (
              <div className="w-full h-60 relative">
                <img
                  src={post.coverImageUrl}
                  className="w-full h-full object-cover"
                  alt={post.title}
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">{post.title}</h2>
              <div
                className="text-gray-600 prose mb-3"
                dangerouslySetInnerHTML={{
                  __html: post.content ? post.content.substring(0, 200) + "..." : "",
                }}
              />
            </div>
          </Link>
          <div className="px-4 pb-4">
            <LikeButton 
              postId={post.id} 
              initialLikes={post._count?.Likes || 0} 
              initialLiked={session ? post.Likes?.some(like => like.userId === session.user?.id) || false : false}
            />
          </div>
        </div>
      ))}
    </div>
  );
}