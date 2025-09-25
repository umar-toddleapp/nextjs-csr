"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import styles from "../../../../../../styles/PostDetailPage.module.css";

export default function PostDetailPage() {
  const params = useParams();
  const { currentMode } = useSelector((state) => state.mode);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shouldUseRest =
    !currentMode || (currentMode !== "preview" && currentMode !== "draft");

  useEffect(() => {
    if (shouldUseRest && params.postId && params.userId) {
      fetchPostData();
    }
  }, [params.postId, params.userId, shouldUseRest]);

  const fetchPostData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [postResponse, userResponse, commentsResponse] = await Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/posts/${params.postId}`),
        fetch(`https://jsonplaceholder.typicode.com/users/${params.userId}`),
        fetch(
          `https://jsonplaceholder.typicode.com/posts/${params.postId}/comments`
        ),
      ]);

      if (!postResponse.ok || !userResponse.ok || !commentsResponse.ok) {
        throw new Error("Failed to fetch post data");
      }

      const postData = await postResponse.json();
      const userData = await userResponse.json();
      const commentsData = await commentsResponse.json();

      setPost(postData);
      setUser(userData);
      setComments(commentsData);
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
          <p>Loading post details...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Post</h2>
          <p>{error || "Post not found"}</p>
          <Link href="/rest" className="btn btn-primary">
            Back to REST Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.postCard}>
        <div className={styles.postHeader}>
          <h1>{post.title}</h1>
          {user && (
            <div className={styles.authorInfo}>
              <p>
                By <strong>{user.name}</strong> (@{user.username})
              </p>
              <p>{user.email}</p>
            </div>
          )}
        </div>

        <div className={styles.postContent}>
          <p>{post.body}</p>
        </div>

        <div className={styles.postMeta}>
          <span>Post ID: {post.id}</span>
          <span>User ID: {post.userId}</span>
        </div>
      </div>

      <div className={styles.commentsSection}>
        <h3>Comments ({comments.length})</h3>
        <div className={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.commentCard}>
              <div className={styles.commentHeader}>
                <h4>{comment.name}</h4>
                <p className={styles.commentEmail}>{comment.email}</p>
              </div>
              <p className={styles.commentBody}>{comment.body}</p>
              <div className={styles.commentActions}>
                <Link
                  href={`/rest/users/${params.userId}/posts/${params.postId}/comments/${comment.id}`}
                  className="btn btn-secondary"
                >
                  View Comment Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
