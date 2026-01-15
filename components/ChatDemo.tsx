
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, Mic, MicOff, MessageSquare, Volume2, Square, AlertCircle } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { chatWithAgent } from '../services/geminiService.ts';
import { Message } from '../types.ts';

// Audio Helpers as per Gemini Live API requirements
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const ChatDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');
  
  // Text Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there! I'm an example of an AI agent we can build for your business. How can I help you stop losing leads today?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Voice Chat State
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('Ready to talk');
  const sessionRef = useRef<any>(null);
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, activeTab]);

  const handleSendText = async (text: string = input) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    const responseText = await chatWithAgent(text);
    
    const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const stopVoiceSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    
    if (audioContextsRef.current) {
      audioContextsRef.current.input.close();
      audioContextsRef.current.output.close();
      audioContextsRef.current = null;
    }
    
    setIsVoiceActive(false);
    setIsAgentSpeaking(false);
    setVoiceStatus('Ready to talk');
  }, []);

  const startVoiceSession = async () => {
    try {
      if (!process.env.API_KEY) {
        setVoiceStatus('API Key Error');
        console.error("Gemini Live: API_KEY is missing from environment.");
        return;
      }

      setVoiceStatus('Connecting...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextsRef.current = { input: inputCtx, output: outputCtx };
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.debug('Live session connection established');
            setVoiceStatus('Listening...');
            setIsVoiceActive(true);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // Ensure sendRealtimeInput is only called after session resolves
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsAgentSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) {
                  setIsAgentSpeaking(false);
                }
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsAgentSpeaking(false);
            }
          },
          onerror: (e) => {
            console.error('Gemini Live API Error:', e);
            setVoiceStatus('Session Error');
            stopVoiceSession();
          },
          onclose: (e) => {
            console.debug('Gemini Live session closed', e);
            stopVoiceSession();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: 'Zephyr' } 
            } 
          },
          systemInstruction: 'You are Aiolos AI. Be concise, persuasive, and friendly. Speak naturally and help business owners understand how AI agents stop lead leaks.',
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Mic/Connection Error:', err);
      setVoiceStatus('Check Microphone');
    }
  };

  const presetButtons = ["How much does it cost?", "Can you book me?", "What businesses do you help?"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="w-full max-w-md mx-auto h-[550px] glass rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
    >
      {/* Tabs */}
      <div className="flex p-1 bg-white/5 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-2xl ${activeTab === 'text' ? 'bg-white/10 text-[#39FF14]' : 'text-white/40 hover:text-white/60'}`}
        >
          <MessageSquare size={14} /> Text Agent
        </button>
        <button 
          onClick={() => setActiveTab('voice')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-2xl ${activeTab === 'voice' ? 'bg-white/10 text-[#BF00FF]' : 'text-white/40 hover:text-white/60'}`}
        >
          <Volume2 size={14} /> Voice Agent
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'text' ? (
          <motion.div 
            key="text-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isTyping ? 'bg-[#39FF14]' : 'bg-green-500'}`} />
                <span className="font-semibold text-xs opacity-70">Aiolos Media Text Demo</span>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#BF00FF]/20 text-[#BF00FF]' : 'bg-[#39FF14]/20 text-[#39FF14]'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#BF00FF]/10 text-white rounded-tr-none' : 'glass text-white/90 rounded-tl-none'}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 items-center glass px-4 py-2 rounded-2xl">
                    <Loader2 className="animate-spin text-[#39FF14]" size={16} />
                    <span className="text-xs text-white/50">Consulting AI...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                {presetButtons.map((btn) => (
                  <button key={btn} onClick={() => handleSendText(btn)} className="whitespace-nowrap px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] text-white/70 transition-colors">{btn}</button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                  placeholder="Ask the Text Agent..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#39FF14]/50 transition-colors pr-12"
                />
                <button 
                  disabled={isTyping || !input.trim()}
                  onClick={() => handleSendText()} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#39FF14] hover:bg-[#39FF14]/10 rounded-lg transition-colors disabled:opacity-30"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="voice-tab"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="relative mb-12">
              <AnimatePresence>
                {isVoiceActive && (
                  <>
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-[#BF00FF] rounded-full blur-3xl -z-10"
                    />
                    <motion.div 
                      animate={{ scale: isAgentSpeaking ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className={`w-32 h-32 rounded-full flex items-center justify-center border-2 shadow-[0_0_50px_rgba(191,0,255,0.3)] transition-colors duration-500 ${isAgentSpeaking ? 'border-[#39FF14] bg-[#39FF14]/5' : 'border-[#BF00FF] bg-[#BF00FF]/5'}`}
                    >
                      {isAgentSpeaking ? <Volume2 className="text-[#39FF14]" size={48} /> : <Bot className="text-[#BF00FF]" size={48} />}
                    </motion.div>
                  </>
                )}
                {!isVoiceActive && (
                  <div className="w-32 h-32 rounded-full flex items-center justify-center border-2 border-white/10 bg-white/5 opacity-50 grayscale">
                    <MicOff className="text-white/40" size={48} />
                  </div>
                )}
              </AnimatePresence>
            </div>

            <h3 className="text-2xl font-bold mb-2">{isVoiceActive ? (isAgentSpeaking ? 'Agent is speaking...' : 'Listening to you...') : 'Voice Discovery'}</h3>
            <p className="text-white/40 text-sm mb-8 max-w-[240px]">
              {isVoiceActive ? 'Talk naturally to our AI as if it was a real human receptionist.' : 'Experience the low-latency future of B2B client communication.'}
            </p>

            <div className="space-y-4 w-full">
              {!isVoiceActive ? (
                <button 
                  onClick={startVoiceSession}
                  className="w-full bg-[#BF00FF] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(191,0,255,0.4)]"
                >
                  <Mic size={20} /> Start Voice Session
                </button>
              ) : (
                <button 
                  onClick={stopVoiceSession}
                  className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-500/20 transition-colors"
                >
                  <Square size={20} fill="currentColor" /> End Conversation
                </button>
              )}
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-30 flex items-center justify-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isVoiceActive ? 'bg-[#39FF14]' : 'bg-red-500'}`} />
                {voiceStatus}
              </div>
            </div>

            {voiceStatus === 'API Key Error' && (
              <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-xl text-xs">
                <AlertCircle size={14} />
                Ensure API_KEY is set in Vercel.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatDemo;
