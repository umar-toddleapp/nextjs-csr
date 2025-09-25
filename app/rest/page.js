"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import {
  setPosts,
  setUsers,
  setLoading,
  setError,
} from "../../redux/slices/dataSlice";
import styles from "../../styles/RestPage.module.css";

export default function RestPage() {
  const dispatch = useDispatch();
  const { currentMode } = useSelector((state) => state.mode);
  const { posts, users, loading, error } = useSelector((state) => state.data);
  const [localPosts, setLocalPosts] = useState([]);
  const [localUsers, setLocalUsers] = useState([]);

  // Only use REST API if mode is not preview or draft
  const shouldUseRest =
    !currentMode || (currentMode !== "preview" && currentMode !== "draft");

  useEffect(() => {
    if (shouldUseRest) {
      fetchRestData();
    }
  }, [shouldUseRest]);

  const fetchRestData = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Fetch posts and users in parallel
      const [postsResponse, usersResponse] = await Promise.all([
        fetch("https://jsonplaceholder.typicode.com/posts"),
        fetch("https://jsonplaceholder.typicode.com/users"),
      ]);

      if (!postsResponse.ok || !usersResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const postsData = await postsResponse.json();
      const usersData = await usersResponse.json();

      // Store in Redux
      dispatch(setPosts(postsData.slice(0, 20))); // Limit to first 20 posts
      dispatch(setUsers(usersData));

      // Store locally for this component
      setLocalPosts(postsData.slice(0, 20));
      setLocalUsers(usersData);
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!shouldUseRest) {
    return (
      <div className={styles.container}>
        <div className={styles.modeMessage}>
          <h2>GraphQL Mode Active</h2>
          <p>
            Switch to default mode to view REST API data, or visit the GraphQL
            section.
          </p>
          <Link href="/graphql" className="btn btn-primary">
            Go to GraphQL Section
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="loading-spinner">⟳</div>
          <p>Loading REST API data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={fetchRestData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>REST API Data</h2>
        <p>Exploring JSONPlaceholder API with nested routing</p>
      </div>

      <div className={styles.section}>
        <h3>Users ({localUsers.length})</h3>
        <div className={styles.grid}>
          {localUsers.map((user) => (
            <div key={user.id} className={styles.card}>
              <h4>{user.name}</h4>
              <p className={styles.cardSubtitle}>@{user.username}</p>
              <p className={styles.cardText}>{user.email}</p>
              <p className={styles.cardText}>{user.company.name}</p>
              <div className={styles.cardActions}>
                <Link
                  href={`/rest/users/${user.id}`}
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Recent Posts ({localPosts.length})</h3>
        <div className={styles.grid}>
          {localPosts.map((post) => {
            const author = localUsers.find((u) => u.id === post.userId);
            return (
              <div key={post.id} className={styles.card}>
                <h4>{post.title}</h4>
                <p className={styles.cardSubtitle}>
                  By {author?.name || "Unknown"}
                </p>
                <p className={styles.cardText}>
                  {post.body.substring(0, 100)}...
                </p>
                <div className={styles.cardActions}>
                  <Link
                    href={`/rest/users/${post.userId}/posts/${post.id}`}
                    className="btn btn-primary"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
