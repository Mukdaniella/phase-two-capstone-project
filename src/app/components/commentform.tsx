'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const { data: session } = useSession();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !comment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: comment.trim()
        })
      });

      if (res.ok) {
        setComment('');
        onCommentAdded();
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-4 text-gray-500">
        Please log in to comment
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
      />
      <button
        type="submit"
        disabled={!comment.trim() || submitting}
        className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-700 via-purple-500 to-pink-500 
                     text-white font-semibold rounded "
      >
        {submitting ? 'Posting...' : 'Comment'}
      </button>
    </form>
  );
}