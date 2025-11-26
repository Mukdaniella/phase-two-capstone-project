'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from "next/link";
import LikeButton from "./components/likebutton";
import CommentForm from "./components/commentform";

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

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImageUrl?: string;
  author: {
    id: string;
    name: string;
    username: string;
  };
  _count: {
    Likes: number;
    comments: number;
  };
  Likes: Array<{ userId: string }>;
}

export default function HomePage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const [comments, setComments] = useState<{[key: string]: Comment[]}>({});
  const [loadingComments, setLoadingComments] = useState<{[key: string]: boolean}>({});

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

  const fetchComments = async (postId: string) => {
    if (comments[postId]) return;
    
    setLoadingComments(prev => ({...prev, [postId]: true}));
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(prev => ({...prev, [postId]: data}));
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments(prev => ({...prev, [postId]: false}));
    }
  };

  const toggleComments = (postId: string) => {
    const isShowing = showComments[postId];
    setShowComments(prev => ({...prev, [postId]: !isShowing}));
    
    if (!isShowing) {
      fetchComments(postId);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setPosts(prev => prev.filter(post => post.id !== postId));
        alert('Post deleted successfully!');
      } else {
        const error = await res.text();
        console.error('Delete failed:', error);
        alert('Failed to delete post: ' + error);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Error deleting post: ' + error);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-600 text-lg">Loading posts...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8 bg-white rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Posts</h1>

      {posts.map((post) => (
        <div key={post.id} className="mb-6 border rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200">
          <Link href={`/posts/${post.slug}`} className="block">
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
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <LikeButton 
                  postId={post.id} 
                  initialLikes={post._count?.Likes || 0} 
                  initialLiked={session ? post.Likes?.some(like => like.userId === session.user?.id) || false : false}
                />
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-purple-500 transition-colors duration-200"
                >
                  <span>💬</span>
                  <span className="text-sm">{post._count?.comments || 0} comments</span>
                </button>
              </div>
              
              {session?.user?.id === post.author?.id && (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/editor?edit=${post.id}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {showComments[post.id] && (
              <div className="mt-4 border-t pt-4">
                {loadingComments[post.id] ? (
                  <div className="text-center py-4 text-gray-600">Loading comments...</div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {comments[post.id]?.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-gray-900">{comment.author.name}</span>
                          <span className="text-gray-500 text-xs">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.content}</p>
                      </div>
                    )) || <p className="text-gray-500 text-center py-2">No comments yet</p>}
                  </div>
                )}
                <CommentForm 
                  postId={post.id} 
                  onCommentAdded={() => {
                    fetchComments(post.id);
                    fetchPosts();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
