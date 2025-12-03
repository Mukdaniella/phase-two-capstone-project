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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const coverImageRef = useRef<HTMLInputElement>(null);

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

  const uploadCoverImage = async (file: File) => {
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setCoverImageUrl(url);
        setMessage("Cover image uploaded!");
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage("Failed to upload cover image");
      }
    } catch (error) {
      setMessage("Error uploading cover image");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage("File size must be less than 5MB");
        return;
      }
      uploadCoverImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      if (imageFile.size > 5 * 1024 * 1024) {
        setMessage("File size must be less than 5MB");
        return;
      }
      uploadCoverImage(imageFile);
    }
  };

  const config = {
    readonly: false,
    height: 400,
    uploader: {
      insertImageAsBase64URI: false,
      url: "/api/upload",
      format: "json",
      prepareData: (formData: FormData) => {
        return formData;
      },
      isSuccess: (resp: any) => {
        return resp.success === 1;
      },
      getMessage: (resp: any) => {
        return resp.file?.url || resp.url;
      },
      process: (resp: any) => {
        return {
          files: [resp.file?.url || resp.url]
        };
      }
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Image
        </label>
        
        <div className="flex gap-3 mb-3">
          <input
            type="url"
            placeholder="Cover image URL (optional)..."
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            className="flex-1 p-3 border rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          
          <button
            type="button"
            onClick={() => coverImageRef.current?.click()}
            disabled={uploadingCover}
            className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                       transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {uploadingCover ? "Uploading..." : "Upload Image"}
          </button>
          
          <input
            ref={coverImageRef}
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="hidden"
          />
        </div>
        
        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm">
              Drag and drop an image here, or{" "}
              <button
                type="button"
                onClick={() => coverImageRef.current?.click()}
                className="text-blue-500 hover:text-blue-600 underline"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
        
        {coverImageUrl && (
          <div className="mt-4 relative">
            <img
              src={coverImageUrl}
              alt="Cover preview"
              className="w-full h-52 object-cover rounded-xl border"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <button
              onClick={() => setCoverImageUrl("")}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 
                         flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              ×
            </button>
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
