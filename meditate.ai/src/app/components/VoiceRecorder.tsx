// VoiceRecorder.tsx
"use client";

import { useState } from 'react';
import { ReactMic, RecordedData } from 'react-mic';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);

  const startRecording = () => {
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const onData = (recordedData: Blob) => {
    // Handle real-time data
  };

  const onStop = (recordedData: RecordedData) => {
    console.log('Recorded data: ', recordedData);
  };

  return (
    <div className="flex flex-col items-center">
      <ReactMic
        record={recording}
        className="w-full"
        onStop={onStop}
        onData={onData}
        strokeColor="#e7cceb"
        backgroundColor="#632b6c"
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={startRecording}
          className="px-6 py-3 text-[#632b6c] bg-[#eae5eb] rounded-lg hover:bg-[#d8d1d9] transition-colors duration-200 shadow-md"
        >
          Begin Talking
        </button>
        <button
          onClick={stopRecording}
          className="px-6 py-3 text-white bg-[#632b6c] rounded-lg hover:bg-[#532259] transition-colors duration-200 shadow-md"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;