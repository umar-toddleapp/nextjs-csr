"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import styles from "../../../../../../../../styles/CommentDetailPage.module.css";

export default function CommentDetailPage() {
  const params = useParams();
  const { currentMode } = useSelector((state) => state.mode);
  const [comment, setComment] = useState(null);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shouldUseRest =
    !currentMode || (currentMode !== "preview" && currentMode !== "draft");

  useEffect(() => {
    if (shouldUseRest && params.commentId && params.postId && params.userId) {
      fetchCommentData();
    }
  }, [params.commentId, params.postId, params.userId, shouldUseRest]);

  const fetchCommentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [commentResponse, postResponse, userResponse] = await Promise.all([
        fetch(
          `https://jsonplaceholder.typicode.com/comments/${params.commentId}`
        ),
        fetch(`https://jsonplaceholder.typicode.com/posts/${params.postId}`),
        fetch(`https://jsonplaceholder.typicode.com/users/${params.userId}`),
      ]);

      if (!commentResponse.ok || !postResponse.ok || !userResponse.ok) {
        throw new Error("Failed to fetch comment data");
      }

      const commentData = await commentResponse.json();
      const postData = await postResponse.json();
      const userData = await userResponse.json();

      setComment(commentData);
      setPost(postData);
      setUser(userData);
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
          <p>Loading comment details...</p>
        </div>
      </div>
    );
  }

  if (error || !comment) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Comment</h2>
          <p>{error || "Comment not found"}</p>
          <Link href="/rest" className="btn btn-primary">
            Back to REST Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Context Cards */}
      <div className={styles.contextSection}>
        {user && (
          <div className={styles.contextCard}>
            <h3>Post Author</h3>
            <div className={styles.userInfo}>
              <h4>{user.name}</h4>
              <p>@{user.username}</p>
              <p>{user.email}</p>
              <p>{user.company.name}</p>
            </div>
          </div>
        )}

        {post && (
          <div className={styles.contextCard}>
            <h3>Original Post</h3>
            <div className={styles.postInfo}>
              <h4>{post.title}</h4>
              <p>{post.body.substring(0, 150)}...</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Comment */}
      <div className={styles.commentCard}>
        <div className={styles.commentHeader}>
          <h2>Comment Details</h2>
          <div className={styles.commentMeta}>
            <span>Comment ID: {comment.id}</span>
            <span>Post ID: {comment.postId}</span>
          </div>
        </div>

        <div className={styles.commentAuthor}>
          <h3>{comment.name}</h3>
          <p className={styles.authorEmail}>{comment.email}</p>
        </div>

        <div className={styles.commentContent}>
          <p>{comment.body}</p>
        </div>

        <div className={styles.navigationLinks}>
          <Link
            href={`/rest/users/${params.userId}/posts/${params.postId}`}
            className="btn btn-secondary"
          >
            ← Back to Post
          </Link>
          <Link
            href={`/rest/users/${params.userId}`}
            className="btn btn-secondary"
          >
            View Author Profile
          </Link>
          <Link href="/rest" className="btn btn-primary">
            REST Home
          </Link>
        </div>
      </div>

      {/* Breadcrumb Trail Summary */}
      <div className={styles.trailSummary}>
        <h3>Navigation Trail</h3>
        <div className={styles.trailItems}>
          <div className={styles.trailItem}>
            <strong>Level 1:</strong> REST API Home
          </div>
          <div className={styles.trailItem}>
            <strong>Level 2:</strong> User {params.userId} ({user?.name})
          </div>
          <div className={styles.trailItem}>
            <strong>Level 3:</strong> Post {params.postId} (
            {post?.title?.substring(0, 30)}...)
          </div>
          <div className={styles.trailItem}>
            <strong>Level 4:</strong> Comment {params.commentId} by{" "}
            {comment.name}
          </div>
        </div>
      </div>
    </div>
  );
}
