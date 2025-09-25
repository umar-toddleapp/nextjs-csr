"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import styles from "../../../../styles/UserDetailPage.module.css";

export default function UserDetailPage() {
  const params = useParams();
  const { currentMode } = useSelector((state) => state.mode);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shouldUseRest =
    !currentMode || (currentMode !== "preview" && currentMode !== "draft");

  useEffect(() => {
    if (shouldUseRest && params.userId) {
      fetchUserData();
    }
  }, [params.userId, shouldUseRest]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [userResponse, postsResponse] = await Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/users/${params.userId}`),
        fetch(
          `https://jsonplaceholder.typicode.com/users/${params.userId}/posts`
        ),
      ]);

      if (!userResponse.ok || !postsResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();
      const postsData = await postsResponse.json();

      setUser(userData);
      setPosts(postsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!shouldUseRest) {
    return (
      <div className={styles.container}>
        <div className={styles.modeMessage}>
          <h2>GraphQL Mode Active</h2>
          <p>Switch to default mode to view REST API data.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="loading-spinner">⟳</div>
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading User</h2>
          <p>{error || "User not found"}</p>
          <Link href="/rest" className="btn btn-primary">
            Back to REST Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.userCard}>
        <div className={styles.userHeader}>
          <h2>{user.name}</h2>
          <p className={styles.username}>@{user.username}</p>
        </div>

        <div className={styles.userDetails}>
          <div className={styles.detailItem}>
            <strong>Email:</strong> {user.email}
          </div>
          <div className={styles.detailItem}>
            <strong>Phone:</strong> {user.phone}
          </div>
          <div className={styles.detailItem}>
            <strong>Website:</strong> {user.website}
          </div>
          <div className={styles.detailItem}>
            <strong>Company:</strong> {user.company.name}
          </div>
          <div className={styles.detailItem}>
            <strong>Address:</strong> {user.address.street}, {user.address.city}
          </div>
        </div>
      </div>

      <div className={styles.postsSection}>
        <h3>
          Posts by {user.name} ({posts.length})
        </h3>
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <h4>{post.title}</h4>
              <p className={styles.postBody}>
                {post.body.substring(0, 120)}...
              </p>
              <div className={styles.postActions}>
                <Link
                  href={`/rest/users/${params.userId}/posts/${post.id}`}
                  className="btn btn-primary"
                >
                  View Post
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
