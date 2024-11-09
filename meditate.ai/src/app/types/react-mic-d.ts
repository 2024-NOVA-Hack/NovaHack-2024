// types/react-mic.d.ts
declare module 'react-mic' {
  import * as React from 'react';

  export interface ReactMicProps {
    record?: boolean;
    pause?: boolean;
    className?: string;
    onStop?: (recordedData: RecordedData) => void;
    onData?: (recordedData: Blob) => void;
    visualSetting?: 'sinewave' | 'frequencyBars';
    echoCancellation?: boolean;
    autoGainControl?: boolean;
    noiseSuppression?: boolean;
    channelCount?: number;
    audioBitsPerSecond?: number;
    mimeType?: string;
    timeSlice?: number;
    strokeColor?: string;
    backgroundColor?: string;
    width?: number;
    height?: number;
  }

  export interface RecordedData {
    blob: Blob;
    startTime: number;
    stopTime: number;
    option: object;
    blobURL: string;
  }

  export class ReactMic extends React.Component<ReactMicProps> { }
}