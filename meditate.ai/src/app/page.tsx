"use client";

import { useState, useEffect } from "react";
import Cartesia from "@cartesia/cartesia-js";

export default function Home() {
  const messages = [
    "Welcome to a new space",
    "Embrace the journey",
    "Find your inner peace",
    "Discover new horizons",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("animate-fade-in-down");
  const [reflection, setReflection] = useState("");

  const cartesia = new Cartesia({
    apiKey: "5309cc41-17f5-45fa-ab8c-fe5f2cd3b3df",
  });

  const websocket = cartesia.tts.websocket({
    container: "raw",
    encoding: "pcm_f32le",
    sampleRate: 44100
  });

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

    return () => clearInterval(interval);
  }, [messages.length]);

  const handleSubmit = async () => {
    try {
      console.log("Sending the shit");
      const response = await fetch("http://127.0.0.1:5000/generate_meditation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "reflection": reflection.toString() }),
      });
      console.log("It sent");

      if (response.ok) {
        const result = await response.json();
        console.log("Meditation generated:", result);

        const res_str = result.meditation_script;

        try {
          await websocket.connect();
        } catch (error) {
          console.error(`Failed to connect to Cartesia: ${error}`);
        }

        const c_response = await websocket.send({
          model_id: "sonic-english",
          voice: {
            mode: "id",
            id: "a0e99841-438c-4a64-b679-ae501e7d6091",
          },
          transcript: res_str
          // The WebSocket sets output_format on your behalf.
        });

        console.log("Re-sending the shit.");

        c_response.on("message", (message) => {
          // Raw message.
          console.log("Received message:", message);
        });

        console.log("Sent the shit again.");

      } else {
        const errorText = await response.text();
        console.error("Failed to generate meditation:", response.status, errorText);
      }
    } catch (error) {
      console.error("An error occurred while generating meditation:", error);
    }
  };

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

      <div className="w-3/4 mt-10">
        <textarea
          className="w-full h-64 p-4 text-xl text-[#3c1a42] rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#eae5eb]"
          placeholder="Enter your thoughts here..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        ></textarea>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center w-50 p-4 text-2xl font-bold text-white bg-[#632b6c] rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Begin
            <svg
              className="w-6 h-6 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.5 3.5L3 21l7.5-4.5L18 21l-7.5-17.5z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
