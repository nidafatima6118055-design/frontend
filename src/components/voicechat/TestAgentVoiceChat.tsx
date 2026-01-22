import React, { useRef, useState, useEffect } from "react";


import { FullAgentConfig } from "@/lib/types/agentConfig";


import { getPhoneNumbers, assignNumberToAgent, unassignNumberFromAgent } from "@/lib/api/api";


/**
 * TestAgentVoiceChat.tsx (Final Fixed)
 * - Keeps full UI (Start / Stop)
 * - Sends 16kHz linear16 PCM (Int16) to backend
 * - Adds RMS debug logging + gain boost for Deepgram sensitivity
 * - Includes silence detection and EOF signaling
 */

function VoiceWave({ active }: { active: boolean }) {
  return (
    <div style={{ height: 40, display: "flex", alignItems: "center" }}>
      {active ? (
        <div className="animate-wave flex gap-1">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-indigo-400 rounded"
              style={{
                width: 4,
                height: `${16 + Math.random() * 24}px`,
                transition: "height 0.2s",
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-200 rounded w-32 h-4" />
      )}
    </div>
  );
}



type TestAgentVoiceChatProps = {
  agentId?: string;
  inlineConfig?: FullAgentConfig;
  // ...other props
};


export default function TestAgentVoiceChat({ agentId, inlineConfig }: TestAgentVoiceChatProps) {


  const [chatActive, setChatActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sequenceRef = useRef<number>(0);
  const lastSentEofAtRef = useRef<number>(0);
  const silenceFramesRef = useRef<number>(0);

  const [availablePhones, setAvailablePhones] = useState<string[]>([]);

  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<string>("");
  const [assignedNumber, setAssignedNumber] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  let nextPlayTime = 0

  // 🧠 Fetch available Twilio numbers
  useEffect(() => {
    async function fetchNumbers() {
      try {
        const data = await getPhoneNumbers();
        setAvailableNumbers(data || []);
      } catch (err) {
        console.error("❌ Failed to fetch numbers:", err);
      }
    }
    fetchNumbers();
  }, []);



  useEffect(() => {
    console.log('selectedNumber ==== > ', selectedNumber);
  }, [selectedNumber]);


  // 📞 Assign number to agent
  async function handleAssign() {
    if (!selectedNumber) {
      alert("Please select a phone number first");
      return;
    }
    if (!agentId) {
      alert("Agent ID is required");
      return;
    }
    setIsAssigning(true);
    try {
      const res = await assignNumberToAgent(agentId, selectedNumber);
      if (res?.message) {
        alert(res.message);
        setAssignedNumber(selectedNumber);
      } else {
        alert("✅ Number assigned!");
        setAssignedNumber(selectedNumber);
      }
    } catch (err: any) {
      console.error(err);
      alert("❌ Failed to assign number");
    } finally {
      setIsAssigning(false);
    }
  }

  // 🔁 Unassign number
  async function handleUnassign() {
    if (!assignedNumber) return;
    if (!agentId) {
      alert("Agent ID is required");
      return;
    }
    setIsAssigning(true);
    try {
      await unassignNumberFromAgent(agentId, assignedNumber);
      alert("📴 Number unassigned");
      setAssignedNumber(null);
    } catch (err) {
      console.error("❌ Failed to unassign number:", err);
      alert("Failed to unassign number");
    } finally {
      setIsAssigning(false);
    }
  }





  // --- Downsample Float32 to 16k ---
  const downsampleBuffer = (buffer: Float32Array, inputSampleRate: number, outRate = 16000) => {
    if (inputSampleRate === outRate) return buffer;
    const ratio = inputSampleRate / outRate;
    const outLength = Math.floor(buffer.length / ratio);
    const out = new Float32Array(outLength);
    for (let i = 0; i < outLength; i++) {
      out[i] = buffer[Math.floor(i * ratio)];
    }
    return out;
  };

  // --- Convert Float32 -> Int16 PCM ---
  const floatTo16BitPCM = (input: Float32Array) => {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Uint8Array(buffer);
  };

  // --- ArrayBuffer → base64 ---
  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  };

  // --- Play received audio chunks ---
  // Replace existing playAudioChunk with the following:
  const playAudioChunk = async (base64Data: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 16000
        });
      }
      const audioCtx = audioContextRef.current;

      if (audioCtx.state === "suspended") {
        try {
          await audioCtx.resume();
        } catch (err) {
          console.warn("Could not resume AudioContext:", err);
        }
      }

      // Decode base64 -> Uint8Array
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      let byteArray = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }

      // Trim if odd length
      if (byteArray.length % 2 !== 0) {
        byteArray = byteArray.slice(0, byteArray.length - 1);
      }

      // Interpret as Int16
      const int16 = new Int16Array(byteArray.buffer);

      // Convert Int16 -> Float32
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        const v = int16[i];
        float32[i] = v < 0 ? v / 0x8000 : v / 0x7fff;
      }

      // Create and play audio
      const audioBuffer = audioCtx.createBuffer(1, float32.length, 16000);
      audioBuffer.getChannelData(0).set(float32);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();

      source.onended = () => {
        try {
          source.disconnect();
        } catch (e) { }
      };

      console.log(`🔊 Played audio: ${float32.length} samples @ 16000Hz`);
    } catch (err) {
      console.error("❌ playAudioChunk error:", err);
    }
  };

  // --- Start Voice Chat ---
  const startVoiceChat = async () => {
    setConnecting(true);
    setError(null);
    console.log("Starting voice chat for agent ID:", agentId);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      console.log("Microphone access granted, stream tracks:", stream.getAudioTracks());

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      audioContextRef.current = audioCtx;
      console.log("AudioContext sampleRate:", audioCtx.sampleRate);

      micSourceRef.current = audioCtx.createMediaStreamSource(stream);
      processorRef.current = audioCtx.createScriptProcessor(2048, 1, 1);

      micSourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioCtx.destination);

      const wsUrl = `ws://localhost:5001/chat/v1/${agentId}`;
      console.log("Connecting to WebSocket:", wsUrl);
      const ws = new WebSocket(wsUrl);
      (window as any).ws = ws; // 👈 makes it globally accessible
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      // ws.onopen = () => {
      //   console.log("WebSocket connected");
      //   setChatActive(true);
      //   setConnecting(false);
      //   sequenceRef.current = 0;
      // };


      ws.onopen = () => {
        console.log("WebSocket connected");
        setChatActive(true);
        setConnecting(false);
        sequenceRef.current = 0;

        const initEvent = {
          type: "init",
          meta_data: {
            context_data: {
              user_name: "WAQAS Ahmad",
              session_id: new Date().toISOString(),
              timestamp: Date.now()
            }
          }
        };
        ws.send(JSON.stringify(initEvent));
        console.log("Init event sent with context data");

        const keepAlive = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "ping" }));
            console.log("Sent keep-alive ping");
          }
        }, 10000);

        ws.onclose = (event) => {
          clearInterval(keepAlive);
          console.log(`WebSocket closed with code ${event.code}: ${event.reason || "Unknown reason"}`);
          setChatActive(false);
          setConnecting(false);
        };
      };


      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("WebSocket error; check console for details");
        setConnecting(false);
      };

      ws.onclose = (event) => {
        console.log(`WebSocket closed with code ${event.code}: ${event.reason || "Unknown reason"}`);
        setChatActive(false);
        setConnecting(false);
      };

      // ws.onmessage = (event) => {
      //   try {
      //     const msg = JSON.parse(event.data);
      //     if (msg.type === "audio") {
      //       console.log(`Received audio message, base64 length: ${msg.data.length}`);
      //       playAudioChunk(msg.data);
      //     } else {
      //       console.log("WS message:", msg);
      //     }
      //   } catch (err) {
      //     console.log("Raw message (non-JSON):", event.data, "length:", event.data.length);
      //     console.error("Error parsing WebSocket message:", err);
      //   }
      // };






      ws.onmessage = async (event) => {
        try {
          // if text string
          if (typeof event.data === "string") {
            const msg = JSON.parse(event.data);
            if (msg.type === "audio") {
              console.log(`Received audio message (text), base64 length: ${msg.data.length}`);
              await playAudioChunk(msg.data);
            } else {
              console.log("WS message:", msg);
            }
            return;
          }

          // if binary ArrayBuffer (server might send binary)
          if (event.data instanceof ArrayBuffer) {
            const arr = new Uint8Array(event.data);
            // convert binary to base64
            let binary = "";
            const chunkSize = 0x8000;
            for (let i = 0; i < arr.length; i += chunkSize) {
              binary += String.fromCharCode(...arr.subarray(i, i + chunkSize));
            }
            const b64 = btoa(binary);
            console.log("Received audio message (binary), bytes:", arr.length);
            await playAudioChunk(b64);
            return;
          }

          // other types
          console.log("Raw message (non-JSON):", event.data);
        } catch (err) {
          console.error("Error handling WebSocket message:", err);
        }
      };





      // Silence detection thresholds
      const SILENCE_THRESHOLD = 0.001;
      const SILENCE_FRAMES_TO_EOF = 8;

      processorRef.current.onaudioprocess = (e) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        const input = e.inputBuffer.getChannelData(0);
        const inputRate = audioCtx.sampleRate || 48000;

        // --- RMS debug ---
        let rms = 0;
        for (let i = 0; i < input.length; i++) rms += input[i] * input[i];
        rms = Math.sqrt(rms / input.length);
        if (sequenceRef.current % 20 === 0)
          console.log("Chunk RMS:", rms.toFixed(4), "gain applied");

        // --- Apply gain ---
        const gain = 10.0; // boost mic volume
        for (let i = 0; i < input.length; i++) {
          input[i] = Math.max(-1, Math.min(1, input[i] * gain));
        }

        // --- Downsample & encode ---
        const downsampled = downsampleBuffer(input, inputRate, 16000);
        const pcmBytes = floatTo16BitPCM(downsampled);
        const base64 = arrayBufferToBase64(pcmBytes.buffer);

        const msg = { type: "audio", data: base64, sequence: sequenceRef.current++ };
        ws.send(JSON.stringify(msg));
        console.log(`Sent audio chunk seq:${msg.sequence} len:${base64.length}`);

        // --- Silence detection ---
        if (rms < SILENCE_THRESHOLD) {
          silenceFramesRef.current++;
        } else {
          silenceFramesRef.current = 0;
        }

        if (silenceFramesRef.current >= SILENCE_FRAMES_TO_EOF) {
          const now = Date.now();
          if (now - lastSentEofAtRef.current > 500) {
            ws.send(JSON.stringify({ type: "audio_eof", sequence: sequenceRef.current++ }));
            lastSentEofAtRef.current = now;
            console.log("Sent audio_eof to mark utterance end");
            silenceFramesRef.current = 0;
          }
        }
      };
    } catch (err) {
      console.error("Error starting voice chat:", err);
      setError("Failed to access microphone");
      setConnecting(false);
    }
  };

  // --- Stop Voice Chat ---
  const stopVoiceChat = () => {
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "audio_eof", sequence: sequenceRef.current++ }));
        console.log("Sent final audio_eof before closing");
      }

      wsRef.current?.close();
      processorRef.current?.disconnect();
      micSourceRef.current?.disconnect();
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
      console.log("Voice chat stopped");
    } catch (err) {
      console.warn("Error stopping voice chat:", err);
    } finally {
      setChatActive(false);
      setConnecting(false);
    }
  };


  return (
    <div className="p-2 max-w-sm mx-auto bg-white rounded shadow space-y-6">
      <h3 className="text-lg font-semibold">🎧 Test Agent Voice Chat</h3>
      <VoiceWave active={chatActive || connecting} />

      <div className="text-sm text-gray-500">Agent ID: {agentId}</div>

      <div className="flex gap-3 items-center">
        {!chatActive && (
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded"
            onClick={startVoiceChat}
            disabled={connecting}
          >
            {connecting ? "Connecting..." : "Start Voice Chat"}
          </button>
        )}
        {chatActive && (
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={stopVoiceChat}>
            Stop
          </button>
        )}
      </div>

      <section className="bg-gray-50 border rounded-md p-4 space-y-3">
        <h4 className="font-medium text-gray-700">Assign Twilio Number</h4>
        <p className="text-sm text-gray-500">
          Select a phone number to assign to this agent. The webhook will automatically update with your ngrok URL.
        </p>

        <div className="flex items-center gap-3">
          <select
            className="border rounded-md px-3 py-2 flex-1"
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(e.target.value)}
          >
            <option value="">Select number...</option>
            {availableNumbers.map((n) => (
              <option key={n.sid} value={n.sid}>
                {n.number} — {n.friendly_name || "No name"}
              </option>
            ))}
          </select>
        </div>

        {!assignedNumber ? (
          <button
            onClick={handleAssign}
            disabled={isAssigning}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isAssigning ? "Assigning..." : "Assign"}
          </button>
        ) : (
          <button
            onClick={handleUnassign}
            disabled={isAssigning}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isAssigning ? "Unassigning..." : "Unassign"}
          </button>
        )}



        {assignedNumber && (
          <div className="text-sm text-green-700 mt-2">
            ✅ Assigned number: <strong>{assignedNumber}</strong>
          </div>
        )}
      </section>

      {/* <section className="bg-white border rounded-md p-4 text-center">
        <p className="text-gray-600 text-sm mb-4">
          Once assigned, you can call the Twilio number above to connect to your AI agent.
        </p>
        {inlineConfig ? (
          <pre className="text-xs bg-gray-900 text-green-300 p-3 rounded-md overflow-auto max-h-64 text-left">
            {JSON.stringify(inlineConfig, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-400 text-sm">No inline config loaded yet.</p>
        )}
      </section> */}

      {error && <div className="text-red-600">{error}</div>}

    </div>
  );
}
