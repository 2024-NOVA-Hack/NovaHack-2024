// VoiceRecorder.tsx
"use client";

import { useState, useEffect } from 'react';
import { ReactMic, RecordedData } from 'react-mic';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will run only on the client side
    setIsClient(true);
  }, []);

  const startRecording = () => {
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const onData = (recordedData: Blob) => {
    // Handle real-time data
  };

  const onStop = async (recordedData: RecordedData) => {
    if (!isClient) return;

    console.log('Recorded data: ', recordedData);

    // Send the recording to the Flask backend
    const formData = new FormData();
    formData.append('audio', recordedData.blob, 'recording.wav');

    try {
      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Transcription result:', result);
      } else {
        const errorText = await response.text();
        console.error('Failed to transcribe audio file:', response.status, errorText);
      }
    } catch (error) {
      console.error('An error occurred while transcribing the audio file:', error);
    }
  };

  if (!isClient) {
    // Render nothing on the server side
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <ReactMic
        record={recording}
        className="rounded-lg"
        onStop={onStop}
        onData={onData}
        strokeColor="#e7cceb"
        backgroundColor="#632b6c"
        width={350}
        height={100}
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={startRecording}
          className="flex items-center justify-center gap-2 w-55 h-16 px-6 rounded-2xl bg-[#eae5eb]
            shadow-lg hover:bg-[#d8d1d9] transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#632b6c"
            className="w-8 h-8">
            <path strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z">
            </path>
          </svg>
          <span className="text-[#632b6c] font-bold">Begin Talking</span>
        </button>
        <button
          onClick={stopRecording}
          className="flex items-center justify-center gap-2 w-55 h-16 px-6 rounded-2xl bg-[#632b6c] text-white
            shadow-lg hover:bg-[#532259] transition-colors duration-200"
        >
          <span className="font-bold">Stop</span>
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;