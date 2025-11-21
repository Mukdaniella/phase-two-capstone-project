"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function EditorPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editor = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      setEditingId(editId);
      fetchPost(editId);
    } else {
      const draft = localStorage.getItem("editor-draft");
      if (draft) {
        const { title: t, content: c, coverImageUrl: img } = JSON.parse(draft);
        setTitle(t || "");
        setContent(c || "");
        setCoverImageUrl(img || "");
      }
    }
  }, [searchParams]);

  const fetchPost = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`);
      if (res.ok) {
        const post = await res.json();
        setTitle(post.title);
        setContent(post.content);
        setCoverImageUrl(post.coverImageUrl || "");
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    }
  };

  const config = {
    readonly: false,
    height: 400,
    uploader: {
      insertImageAsBase64URI: true,
      url: "/api/upload",
      format: "json",
    },
    buttons: [
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "link",
      "image",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "fullsize",
    ],
  };

  const saveDraft = async () => {
    setSaving(true);
    setMessage("Saving draft...");

    try {
      const url = editingId ? `/api/posts/${editingId}` : "/api/posts";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          slug: title.toLowerCase().replace(/\s+/g, "-"),
          coverImageUrl,
          isPublished: false,
        }),
      });

      if (res.ok) {
        setMessage("Draft saved!");
        localStorage.removeItem("editor-draft");
      } else {
        setMessage("Failed to save draft");
      }
    } catch {
      setMessage("Error saving draft");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const publish = async () => {
    setSaving(true);
    setMessage("Publishing...");

    try {
      const url = editingId ? `/api/posts/${editingId}` : "/api/posts";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          slug: title.toLowerCase().replace(/\s+/g, "-"),
          coverImageUrl,
          isPublished: true,
        }),
      });

      if (res.ok) {
        setMessage("Published!");
        localStorage.removeItem("editor-draft");
        setTimeout(() => router.push("/posts"), 1500);
      } else {
        setMessage("Failed to publish");
      }
    } catch {
      setMessage("Error publishing");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const saveLocally = () => {
    localStorage.setItem(
      "editor-draft",
      JSON.stringify({ title, content, coverImageUrl })
    );
    setMessage("Saved locally!");
    setTimeout(() => setMessage(""), 2000);
  };

  if (!session) {
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">
        Please log in to access the editor.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 p-10 bg-white rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        {editingId ? "Edit Post" : "Create a New Post"}
      </h1>

      {/* TITLE */}
      <input
        type="text"
        placeholder="Enter your title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-4 mb-6 text-xl border rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      {/* COVER IMAGE */}
      <div className="mb-6">
        <input
          type="url"
          placeholder="Cover image URL (optional)..."
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className="w-full p-3 border rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        {coverImageUrl && (
          <div className="mt-4">
            <img
              src={coverImageUrl}
              alt="Cover preview"
              className="w-full h-52 object-cover rounded-xl border"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
      </div>

      {/* EDITOR */}
      <div className="rounded-xl border overflow-hidden mb-6">
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={(newContent) => setContent(newContent)}
        />
      </div>

      {/* BUTTONS */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={saveLocally}
          className="py-2 px-4 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-all duration-200"
        >
          Save Locally
        </button>

        <button
          onClick={saveDraft}
          disabled={saving || !title || !content}
          className="py-2 px-4 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-all duration-200"
        >
          Save Draft
        </button>

        <button
          onClick={() => setIsPreviewOpen(true)}
          disabled={!title || !content}
          className="py-2 px-4 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-all duration-200"
        >
          Preview
        </button>

        <button
          onClick={publish}
          disabled={saving || !title || !content}
          className="ml-auto py-2 px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300"
        >
          Publish
        </button>

        {message && (
          <span className="text-gray-600 text-sm ml-3">{message}</span>
        )}
      </div>

      {/* PREVIEW MODAL */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="bg-white max-w-4xl w-full p-6 rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <div className="text-right mt-6">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="py-2 px-4 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
