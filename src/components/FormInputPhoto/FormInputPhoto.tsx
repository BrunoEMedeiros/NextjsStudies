"use client";

import { useState, ChangeEvent } from "react";

export default function PhotoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      console.log("Preparing to upload:", selectedFile.name);

      /* const response = await fetch('/api/upload', {
         method: 'POST',
         body: formData,
       });
       
       if (response.ok) {
         console.log('Upload successful!');
       }
      */

      alert(`Simulated upload for ${selectedFile.name}`);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload a Profile Photo</h2>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Choose an image
      </label>
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100 cursor-pointer"
      />

      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Preview:</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Upload preview"
            className="w-full h-auto object-cover rounded-md border border-gray-200"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile}
        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md 
                   disabled:bg-gray-300 disabled:cursor-not-allowed 
                   hover:bg-blue-700 transition-colors"
      >
        Upload Photo
      </button>
    </div>
  );
}
