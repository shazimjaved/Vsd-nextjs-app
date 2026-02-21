
"use client";

export function BackgroundVideo() {
  return (
    <div className="fixed inset-0 -z-10">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="https://videos.pexels.com/video-files/4431790/4431790-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
