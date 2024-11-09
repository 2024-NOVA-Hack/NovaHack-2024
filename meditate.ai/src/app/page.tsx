"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const messages = [
    "Welcome to a new space",
    "Embrace the journey",
    "Find your inner peace",
    "Discover new horizons",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('animate-fade-in-down');

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationClass('animate-fade-out-down');
      setTimeout(() => {
        setCurrentMessageIndex((prevIndex) =>
          prevIndex === messages.length - 1 ? 0 : prevIndex + 1
        );
        setAnimationClass('animate-fade-in-down');
      }, 500); // Duration of the fade-out animation
    }, 3000); // Time between messages

    return () => clearInterval(interval);
  }, [messages.length]);

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
      <main className="flex flex-col items-center justify-center flex-grow w-full px-8">
        <div className="flex flex-col items-center w-full gap-4">
          {/* Text input temporarily commented out
          <textarea
            placeholder="Enter your thoughts..."
            className="w-[75%] p-6 text-xl text-[#502358]
            bg-[#eae5eb] rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#c76b98]
            min-h-[300px] align-top resize-none"
          /> */}

          <div className="flex flex-col items-center gap-2">
            <button
              className="flex items-center justify-center gap-4 w-55 h-16 px-6 rounded-2xl bg-[#eae5eb] 
              shadow-lg hover:bg-[#d8d1d9] transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#632b6c"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                />
              </svg>
              <span className="text-[#632b6c] font-bold">Begin Talking</span>
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 mt-4 text-white bg-[#632b6c] 
              rounded-lg hover:bg-[#532259] transition-colors duration-200 shadow-md"
            >
              <span className="font-bold">Stop</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}