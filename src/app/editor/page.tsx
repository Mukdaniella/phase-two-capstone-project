'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function EditorPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const editor = useRef(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const draft = localStorage.getItem('editor-draft');
    if (draft) {
      const { title: draftTitle, content: draftContent, coverImageUrl: draftCover } = JSON.parse(draft);
      setTitle(draftTitle || '');
      setContent(draftContent || '');
      setCoverImageUrl(draftCover || '');
    }
  }, []);

  const config = {
    readonly: false,
    height: 400,
    uploader: {
      insertImageAsBase64URI: true,
      url: '/api/upload',
      format: 'json'
    },
    buttons: [
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'link', 'image', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'fullsize'
    ]
  };

  const saveDraft = async () => {
    setSaving(true);
    setMessage('Saving draft...');
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          slug: title.toLowerCase().replace(/\s+/g, '-'),
          coverImageUrl,
          isPublished: false
        })
      });

      if (res.ok) {
        setMessage('Draft saved!');
        localStorage.removeItem('editor-draft');
      } else {
        setMessage('Failed to save draft');
      }
    } catch (error) {
      setMessage('Error saving draft');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const publish = async () => {
    setSaving(true);
    setMessage('Publishing...');
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          slug: title.toLowerCase().replace(/\s+/g, '-'),
          coverImageUrl,
          isPublished: true
        })
      });

      if (res.ok) {
        setMessage('Published successfully!');
        localStorage.removeItem('editor-draft');
        setTimeout(() => router.push('/posts'), 2000);
      } else {
        setMessage('Failed to publish');
      }
    } catch (error) {
      setMessage('Error publishing');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const saveLocally = () => {
    localStorage.setItem('editor-draft', JSON.stringify({ title, content, coverImageUrl }));
    setMessage('Saved locally!');
    setTimeout(() => setMessage(''), 2000);
  };

  if (!session) {
    return <div className="text-center mt-20">Please log in to access the editor.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      
      <input
        type="text"
        placeholder="Enter your title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-4 mb-4 text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mb-6">
        <input
          type="url"
          placeholder="Cover image URL (optional)..."
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {coverImageUrl && (
          <div className="mt-3">
            <img 
              src={coverImageUrl} 
              alt="Cover preview" 
              className="w-full h-48 object-cover rounded-lg border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div className="mb-6">
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={(newContent) => setContent(newContent)}
        />
      </div>

      <div className="flex gap-4 items-center mb-4">
        <button
          onClick={saveLocally}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Save Locally
        </button>
        
        <button
          onClick={saveDraft}
          disabled={saving || !title || !content}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          Save Draft
        </button>
        
        <button
          onClick={() => setIsPreviewOpen(true)}
          disabled={!title || !content}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Preview
        </button>
        
        <button
          onClick={publish}
          disabled={saving || !title || !content}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Publish
        </button>

        {message && <span className="text-sm text-gray-600">{message}</span>}
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Preview</h2>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      )}
    </div>
  );
}