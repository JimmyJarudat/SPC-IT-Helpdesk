"use client";
import React, { useState } from "react";

const ProfileImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const response = await fetch("/api/profile/uploadImage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus("Image uploaded successfully!");
        console.log("Uploaded file path:", data.filePath);
      } else {
        const errorData = await response.json();
        setUploadStatus(`Failed to upload image: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadStatus("Error uploading image.");
    }
  };

  return (
    <div>
      <h1>Upload Profile Image</h1>
      {previewImage && <img src={previewImage} alt="Preview" width="100" />}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ProfileImageUpload;
