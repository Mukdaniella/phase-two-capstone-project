'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import LikeButton from '../../components/likebutton';
import CommentForm from '../../components/commentform';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
  };
}

function CommentsDisplay({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{comment.author.name}</span>
              <span className="text-gray-500 text-sm">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>
      <CommentForm 
        postId={postId} 
        onCommentAdded={fetchComments}
      />
    </div>
  );
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImageUrl?: string;
  publishedAt?: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
  };
  _count: {
    Likes: number;
  };
  Likes: Array<{ userId: string }>;
}

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string);
    }
  }, [params.slug]);

  const fetchPost = async (slug: string) => {
    try {
      const res = await fetch(`/api/posts/slug/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading post...</div>;
  }

  if (error || !post) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 mb-4">{error || 'Post not found'}</p>
        <Link href="/posts" className="text-blue-500 hover:underline">
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link href="/posts" className="text-blue-500 hover:underline mb-6 inline-block">
        ← Back to Posts
      </Link>

      {post.coverImageUrl && (
        <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-gray-500 text-sm">
            <span>By {post.author.name}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
          </div>
          
          <LikeButton 
            postId={post.id} 
            initialLikes={post._count.Likes} 
            initialLiked={false}
          />
        </div>
      </header>

      <div 
        className="prose prose-lg max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        <CommentsDisplay postId={post.id} />
      </div>
    </div>
  );
}