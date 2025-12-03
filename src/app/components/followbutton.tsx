'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface FollowButtonProps {
  authorId: string;
  initialFollowing: boolean;
}

export default function FollowButton({ authorId, initialFollowing }: FollowButtonProps) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/follows', {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: authorId })
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session || session.user?.id === authorId) return null;

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-3 py-1 rounded text-sm transition-colors ${
        isFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {loading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}