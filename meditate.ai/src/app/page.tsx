"use client";

import { useState, useEffect, useRef } from "react";
import VoiceRecorder from "./components/VoiceRecorder";
import AudioTest from "audio_play.tsx";

export default function Home() {
  const messages = [
    "Welcome to a new space",
    "Embrace the journey",
    "Find your inner peace",
    "Discover new horizons",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("animate-fade-in-down");
  const audioRef = useRef(null); // Ref for controlling audio

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationClass("animate-fade-out-down");
      setTimeout(() => {
        setCurrentMessageIndex((prevIndex) =>
          prevIndex === messages.length - 1 ? 0 : prevIndex + 1
        );
        setAnimationClass("animate-fade-in-down");
      }, 500); // Duration of the fade-out animation
    }, 3000); // Time between messages

    // Auto-play music on page load
    // if (audioRef.current) {
    //   audioRef.current.play().catch((error) => {
    //     console.log("Auto-play failed:", error);
    //   });
    // }

    return () => clearInterval(interval);
  }, [messages.length]);

  // // Toggle play/pause for music
  // const toggleMusic = () => {
  //   if (audioRef.current.paused) {
  //     audioRef.current.play();
  //   } else {
  //     audioRef.current.pause();
  //   }
  // };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#632b6c] to-[#c76b98]">
      <div className="text-9xl font-bold text-[#e7cceb] mt-16 mb-5">
        Personal Zen
      </div>

      <span
        className={`${animationClass} text-4xl font-bold text-[#e7cceb] mt-10 mb-10`}
      >
        {messages[currentMessageIndex]}
      </span>

      {/* Meditation Start and Stop buttons */}
      <VoiceRecorder />

      {/* Hidden audio player
      <audio ref={audioRef} loop>
        <source src="/music.m4a" type="audio/m4a" />
        Your browser does not support the audio element.
      </audio> */}
    </div>
  );
};
