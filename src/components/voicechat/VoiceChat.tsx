'use client';

import { useState, useEffect, useRef } from 'react';

interface VoiceChatProps {
  agentId: string;
}

function AnimatedIcon({ type, active }: { type: 'mic' | 'speaker'; active: boolean }) {
  const baseStyle = "w-8 h-8 rounded-full flex items-center justify-center";
  const animation = active ? "animate-pulse bg-green-500" : "bg-gray-500";
  const icon = type === 'mic' ? '🎤' : '🔊';
  return <div className={`${baseStyle} ${animation}`}>{icon}</div>;
}

function CallTimer({ startTime }: { startTime: number | null }) {
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);
  const format = (secs: number) => {
    const mins = Math.floor(secs / 60).toString().padStart(2, '0');
    const seconds = (secs % 60).toString().padStart(2, '0');
    return `${mins}:${seconds}`;
  };
  return <span className="text-gray-600">Call Duration: {format(duration)}</span>;
}

function ChatBox({ messages }: { messages: { role: 'user' | 'agent'; text: string }[] }) {
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);
  return (
    <div ref={chatRef} className="h-48 overflow-y-auto border p-2 rounded bg-gray-100">
      {messages.map((msg, idx) => (
        <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
          <span className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-blue-200' : 'bg-green-200'}`}>
            {msg.role.toUpperCase()}: {msg.text}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function VoiceChat({ agentId }: VoiceChatProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string }[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playbackQueueRef = useRef<Uint8Array[]>([]);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const startCallOLD = async () => {
    setError(null);
    setIsCalling(true);
    setStartTime(Date.now());

    // Connect WebSocket on start
    const wsUrl = `ws://localhost:5001/chat/v1/${agentId}`;
    const ws = new window.WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => console.log('WebSocket connected');
    ws.onmessage = async (event) => {
      const response = JSON.parse(event.data);
      if (response.type === 'clear') {
        playbackQueueRef.current = [];
        stopPlayback();
        return;
      }
      if (response.type === 'text' && response.data) {
        setMessages((prev) => [...prev, { role: 'agent', text: response.data }]);
      }
      if (response.type === 'audio' && response.data) {
        const audioBuffer = Uint8Array.from(atob(response.data), c => c.charCodeAt(0));
        playbackQueueRef.current.push(audioBuffer);
        setIsSpeaking(true);
        playNextChunk();
      }
    };
    ws.onclose = () => {
      console.log('WebSocket closed');
      socketRef.current = null;
      stopPlayback();
      setIsCalling(false);
      setStartTime(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };


    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      const input = audioContext.createMediaStreamSource(stream);
      input.connect(processor);
      processor.connect(audioContext.destination);
      processor.onaudioprocess = (e) => {
        const inputBuffer = e.inputBuffer.getChannelData(0);
        const pcmInt16 = new Int16Array(inputBuffer.length);
        for (let i = 0; i < inputBuffer.length; i++) {
          let s = Math.max(-1, Math.min(1, inputBuffer[i]));
          pcmInt16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        const audioBlob = new Uint8Array(pcmInt16.buffer);
        if (ws.readyState === WebSocket.OPEN) {
          const base64Audio = btoa(String.fromCharCode(...audioBlob));
          ws.send(JSON.stringify({ type: 'audio', data: base64Audio }));
          // For user messages, you could add ASR on frontend or assume server transcribes
          // For now, add placeholder user message if needed
        }
      };
    } catch (err) {
      setError('Microphone access denied');
      setIsCalling(false);
      setStartTime(null);
    }
  };


  const startCall = async () => {
    setError(null);
    setIsCalling(true);
    setStartTime(Date.now());

    // Connect WebSocket on start
    const wsUrl = `ws://localhost:5001/chat/v1/${agentId}`;
    const ws = new window.WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => console.log('WebSocket connected');
    ws.onmessage = async (event) => {
      console.log('Received WebSocket message:', event.data); // Debug log
      const response = JSON.parse(event.data);
      if (response.type === 'clear') {
        playbackQueueRef.current = [];
        stopPlayback();
        return;
      }
      if (response.type === 'text' && response.data) {
        setMessages((prev) => [...prev, { role: 'agent', text: response.data }]);
      }
      if (response.type === 'audio' && response.data) {
        const audioBuffer = Uint8Array.from(atob(response.data), c => c.charCodeAt(0));
        playbackQueueRef.current.push(audioBuffer);
        setIsSpeaking(true);
        playNextChunk();
      }
    };
    ws.onclose = (event) => {
      console.log('WebSocket closed with code:', event.code, 'reason:', event.reason);
      socketRef.current = null;
      stopPlayback();
      setIsCalling(false);
      setStartTime(null);
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Function to create WAV header
    const createWavHeader = (dataLength, sampleRate = 16000, numChannels = 1, bitsPerSample = 16) => {
      const buffer = new ArrayBuffer(44);
      const view = new DataView(buffer);
      const writeString = (str, offset) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };
      writeString('RIFF', 0);
      view.setUint32(4, 36 + dataLength, true); // Chunk size
      writeString('WAVE', 8);
      writeString('fmt ', 12);
      view.setUint32(16, 16, true); // Subchunk1 size
      view.setUint16(20, 1, true); // Audio format (PCM = 1)
      view.setUint16(22, numChannels, true); // Num channels
      view.setUint32(24, sampleRate, true); // Sample rate
      view.setUint32(28, sampleRate * numChannels * bitsPerSample / 8, true); // Byte rate
      view.setUint16(32, numChannels * bitsPerSample / 8, true); // Block align
      view.setUint16(34, bitsPerSample, true); // Bits per sample
      writeString('data', 36);
      view.setUint32(40, dataLength, true); // Data size
      return new Uint8Array(buffer);
    };

    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      const input = audioContext.createMediaStreamSource(stream);
      input.connect(processor);
      processor.connect(audioContext.destination);
      processor.onaudioprocess = (e) => {
        const inputBuffer = e.inputBuffer.getChannelData(0);
        const pcmInt16 = new Int16Array(inputBuffer.length);
        for (let i = 0; i < inputBuffer.length; i++) {
          let s = Math.max(-1, Math.min(1, inputBuffer[i]));
          pcmInt16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        const pcmData = new Uint8Array(pcmInt16.buffer);
        const wavHeader = createWavHeader(pcmData.length);
        const wavData = new Uint8Array(wavHeader.length + pcmData.length);
        wavData.set(wavHeader, 0);
        wavData.set(pcmData, wavHeader.length);
        if (ws.readyState === WebSocket.OPEN) {
          const base64Audio = btoa(String.fromCharCode(...wavData));
          ws.send(JSON.stringify({ type: 'audio', data: base64Audio }));
          console.log('Sent audio chunk'); // Debug log
        }
      };
    } catch (err) {
      setError('Microphone access denied');
      console.error('Microphone error:', err);
      setIsCalling(false);
      setStartTime(null);
    }
  };


  const endCall = () => {
    setIsCalling(false);
    setStartTime(null);
    if (socketRef.current) socketRef.current.close();
    if (processorRef.current) processorRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    stopPlayback();
  };

  const playNextChunk = async () => {
    if (!audioContextRef.current || playbackQueueRef.current.length === 0) {
      setIsSpeaking(false);
      return;
    }
    const chunk = playbackQueueRef.current.shift();
    if (!chunk) return;
    try {
      const audioBuffer = await audioContextRef.current.decodeAudioData(chunk.buffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
      sourceNodeRef.current = source;
      source.onended = () => {
        playNextChunk();
      };
    } catch (e) {
      console.error('Playback error:', e);
      setIsSpeaking(false);
    }
  };

  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    playbackQueueRef.current = [];
    setIsSpeaking(false);
  };

  return (
    <div className="border p-4 rounded bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <AnimatedIcon type="mic" active={isCalling} />
          <AnimatedIcon type="speaker" active={isSpeaking} />
        </div>
        <CallTimer startTime={startTime} />
      </div>
      <ChatBox messages={messages} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="flex gap-4 mt-4">
        <button
          onClick={isCalling ? endCall : startCall}
          className={`flex-1 p-2 rounded ${isCalling ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {isCalling ? 'End Call' : 'Start Call'}
        </button>
      </div>
    </div>
  );
}