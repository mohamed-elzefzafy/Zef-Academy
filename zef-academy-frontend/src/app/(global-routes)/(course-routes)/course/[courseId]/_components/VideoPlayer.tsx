"use client";
import { useEffect, useRef } from "react";

function VideoPlayer({
  url,
  width = "100%",
  height = "100%",
}: {
  url: string;
  width?: string;
  height?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const storageKey = `video-progress-${url}`; // unique key per video URL

  // Save playback time every few seconds
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      localStorage.setItem(storageKey, video.currentTime.toString());
    };

    const handleLoadedMetadata = () => {
      const savedTime = localStorage.getItem(storageKey);
      if (savedTime) {
        video.currentTime = parseFloat(savedTime);
      }

      const duration = video.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      console.log("Video duration:", formatted);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [storageKey]);

  return (
    <video
      ref={videoRef}
      controls
      width={width}
      height={height}
    >
      <source src={url} type="video/mp4" />
    </video>
  );
}

export default VideoPlayer;
