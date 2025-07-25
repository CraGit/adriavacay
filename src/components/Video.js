"use client";

import { useState } from "react";
import { isFilled } from "@prismicio/client";

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube video URL or embed URL
 * @returns {string|null} - Video ID or null if invalid
 */
function getYouTubeId(url) {
  if (!url) return null;
  
  // Handle different YouTube URL formats including embed URLs
  const patterns = [
    /(?:youtube\.com\/embed\/|youtu\.be\/)([^?&"'>]+)/,
    /youtube\.com\/watch\?v=([^&"'>]+)/,
    /youtube\.com\/v\/([^?&"'>]+)/,
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      // For the last pattern, use match[7], for others use match[1]
      const videoId = match[7] || match[1];
      if (videoId && videoId.length === 11) {
        return videoId;
      }
    }
  }
  return null;
}

/**
 * Video component with thumbnail and lazy loading
 * @param {Object} props
 * @param {string} props.videoEmbed - YouTube video URL or embed URL
 * @param {string} props.className - Additional CSS classes
 */
const Video = ({ videoEmbed, className = "" }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  
  if (!isFilled.keyText(videoEmbed)) {
    return (
      <div className={`rounded-lg bg-gray-100 p-4 text-center ${className}`}>
        <p className="text-gray-600">No video URL provided</p>
      </div>
    );
  }
  
  const videoId = getYouTubeId(videoEmbed);
  
  if (!videoId) {
    return (
      <div className={`rounded-lg bg-gray-100 p-4 text-center ${className}`}>
        <p className="text-gray-600">Invalid YouTube URL</p>
      </div>
    );
  }

  // Try hqdefault first for better compatibility
  const thumbnailUrl = thumbnailError
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  const handlePlayVideo = () => {
    setShowVideo(true);
  };

  const handleThumbnailError = () => {
    console.log("Thumbnail error for:", thumbnailUrl);
    if (!thumbnailError) {
      setThumbnailError(true);
    }
  };

  const handleThumbnailLoad = () => {
    console.log("Thumbnail loaded successfully:", thumbnailUrl);
  };

  console.log("Video debug:", {
    videoEmbed,
    videoId,
    thumbnailUrl,
    thumbnailError,
    showVideo
  });
  
  if (showVideo) {
    return (
      <div className={`relative aspect-video overflow-hidden rounded-lg ${className}`}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  
  return (
    <div className={`relative aspect-video overflow-hidden rounded-lg bg-gray-200 ${className}`}>
      {/* Thumbnail Image */}
      <img
        src={thumbnailUrl}
        alt="Video thumbnail"
        className="absolute inset-0 w-full h-full object-cover z-0"
        onError={handleThumbnailError}
        onLoad={handleThumbnailLoad}
        style={{ display: 'block' }}
      />
      
      {/* Play button overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
        onClick={handlePlayVideo}
      >
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg">
          <svg
            className="w-8 h-8 text-white ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Video;
