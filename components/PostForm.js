"use client";
import { useState } from "react";
import ImageUpload from "./ImageUpload";

export default function PostForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onSubmit({ title, content, image_url: imageUrl });
      setTitle("");
      setContent("");
      setImageUrl("");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h3>Create New Post</h3>

      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Image:</label>
        <ImageUpload onImageUpload={setImageUrl} />
        {imageUrl && (
          <div>
            <img src={imageUrl} alt="Preview" width="100" />
          </div>
        )}
      </div>

      <button type="submit">Create Post</button>
    </form>
  );
}
