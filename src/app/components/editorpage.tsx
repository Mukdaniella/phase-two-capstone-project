"use client";

import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";

export default function EditorPage() {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const handleSaveDraft = () => {
    localStorage.setItem("draft", content);
    alert("Draft saved!");
  };

  const handleLoadDraft = () => {
    const draft = localStorage.getItem("draft");
    if (draft) setContent(draft);
    else alert("No draft found!");
  };

  const handlePublish = () => {
    console.log("Published content:", content);
    alert("Content published! Check console.");
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Rich Text Editor
      </h1>

      <div className="bg-white shadow-2xl rounded-3xl p-6">
        <JoditEditor
          ref={editor}
          value={content}
          tabIndex={1}
          onBlur={newContent => setContent(newContent)}
          config={{
            readonly: false,
            uploader: { insertImageAsBase64URI: true },
          }}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleSaveDraft}
          className="px-6 py-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                     text-white font-semibold rounded-3xl shadow-lg hover:opacity-90 transition duration-200"
        >
          Save Draft
        </button>

        <button
          onClick={handleLoadDraft}
          className="px-6 py-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                     text-white font-semibold rounded-3xl shadow-lg hover:opacity-90 transition duration-200"
        >
          Load Draft
        </button>

        <button
          onClick={handlePublish}
          className="px-6 py-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                     text-white font-semibold rounded-3xl shadow-lg hover:opacity-90 transition duration-200"
        >
          Publish
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 text-center">Preview</h3>
        <div
          className="border border-gray-300 rounded-2xl p-4 bg-white shadow-inner"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </div>
  );
}
