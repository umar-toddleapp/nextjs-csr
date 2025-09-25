"use client";

import { createContext, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMode } from "../redux/slices/modeSlice";

const PostMessageContext = createContext();

export const PostMessageProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleMessage = (event) => {
      // In production, you might want to validate the origin
      // if (event.origin !== 'https://your-parent-domain.com') return

      if (event.data && event.data.mode) {
        console.log("Received mode from parent:", event.data.mode);
        dispatch(setMode(event.data.mode));
      }
    };

    // Listen for postMessage from parent window
    window.addEventListener("message", handleMessage);

    // Send ready message to parent
    if (window.parent !== window) {
      window.parent.postMessage({ type: "iframe-ready" }, "*");
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [dispatch]);

  return (
    <PostMessageContext.Provider value={{}}>
      {children}
    </PostMessageContext.Provider>
  );
};

export const usePostMessage = () => {
  const context = useContext(PostMessageContext);
  if (context === undefined) {
    throw new Error("usePostMessage must be used within a PostMessageProvider");
  }
  return context;
};
