"use client";

import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditorPage() {
  const editor = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  // load post if editing
  useEffect(() => {
    if (editId) {
      fetch(`/api/posts/${editId}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title);
          setContent(data.content);
          setSlug(data.slug);
        });
    }
  }, [editId]);

  const handleSave = async (status: "draft" | "published") => {
    const payload = { title, content, slug, status };

    if (editId) {
      await fetch(`/api/posts/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    router.push("/posts");
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        {editId ? "Edit Post" : "Create Post"}
      </h1>

      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      <input
        type="text"
        placeholder="Slug (unique URL)"
        value={slug}
        onChange={e => setSlug(e.target.value)}
        className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      <div className="bg-white shadow-2xl rounded-3xl p-6 mb-6">
        <JoditEditor
          ref={editor}
          value={content}
          tabIndex={1}
          onBlur={newContent => setContent(newContent)}
          config={{ readonly: false, uploader: { insertImageAsBase64URI: true } }}
        />
      </div>

      <div className="flex gap-4 justify-center flex-wrap">
        <button
          onClick={() => handleSave("draft")}
          className="px-6 py-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white rounded-3xl shadow-lg hover:opacity-90 transition"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSave("published")}
          className="px-6 py-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white rounded-3xl shadow-lg hover:opacity-90 transition"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
