"use client";
import { useState, ChangeEvent, useEffect } from "react";

interface FormInputPhotoProps {
  label: string;
  onFileSelect: (file: File) => void;
  error?: string;
  initialPreviewUrl?: string;
}

export default function FormInputPhoto({
  label,
  onFileSelect,
  error,
  initialPreviewUrl,
}: FormInputPhotoProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPreviewUrl ?? null
  );

  useEffect(() => {
    setPreviewUrl(initialPreviewUrl ?? null);
  }, [initialPreviewUrl]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    onFileSelect(file);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-midnight-black border border-gray-700 rounded-lg shadow-md">
      <h2 className="text-xl font-light mb-4">{label}</h2>
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:font-light file:text-sm
                   file:bg-blue-50 file:text-rich-black
                   hover:file:bg-blue-100 cursor-pointer"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto object-cover rounded-md border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}
