"use client";
import { useState, useEffect, useCallback } from "react";
import PostForm from "../components/PostForm";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  const createPost = useCallback(
    async (postData) => {
      try {
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        if (response.ok) {
          await fetchPosts(); // Wait for the fetch to complete
        } else {
          throw new Error("Failed to create post");
        }
      } catch (error) {
        console.error("Error creating post:", error);
        throw error;
      }
    },
    [fetchPosts]
  );

  const createUser = useCallback(async () => {
    try {
      const names = ["Alice", "Bob", "Charlie", "Diana"];
      const randomName = names[Math.floor(Math.random() * names.length)];

      const userData = {
        name: randomName,
        email: `${randomName.toLowerCase()}@example.com`,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomName}`,
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        await fetchUsers(); // Wait for the fetch to complete
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }, [fetchUsers]);

  // Proper useEffect with async handling
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchPosts(), fetchUsers()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchPosts, fetchUsers]);

  if (loading) {
    return (
      <div className="container">
        <h1>Cloudinary + Neon DB Demo</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Cloudinary + Neon DB Demo</h1>

      <div className="grid">
        <div className="section">
          <h2>Create Post</h2>
          <PostForm onSubmit={createPost} />
        </div>

        <div className="section">
          <h2>Posts ({posts.length})</h2>
          <div className="posts">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} width="200" />
                )}
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <small>{new Date(post.created_at).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>Users ({users.length})</h2>
          <button onClick={createUser}>Add Random User</button>
          <div className="users">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                {user.avatar_url && (
                  <img src={user.avatar_url} alt={user.name} width="50" />
                )}
                <div>
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
