'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  className?: string;
  buttonText?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export default function ImageUpload({
  onImageUploaded,
  currentImage,
  className = "",
  buttonText = "Upload Image",
  accept = "image/*",
  maxSize = 5
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Only image files are allowed");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onImageUploaded(data.url);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : buttonText}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {currentImage && (
          <span className="text-sm text-gray-500">
            Image uploaded
          </span>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      {currentImage && (
        <div className="mt-3">
          <img
            src={currentImage}
            alt="Uploaded preview"
            className="max-w-xs h-32 object-cover rounded-lg border"
          />
        </div>
      )}
    </div>
  );
}