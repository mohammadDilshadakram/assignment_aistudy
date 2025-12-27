"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Play, Pause, User, Bot, Headphones, Mic, MicOff, Volume2, Square } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock dialogue script for "Audio Mode"
const DIALOGUE_SCRIPT = [
    { role: "student", text: "So, Professor, we're talking about Economics today. Can you start by explaining what scarcity is? It sounds like we just don't have enough stuff." },
    { role: "teacher", text: "That's a great starting point! You're partially right. Scarcity isn't just about 'not having enough'. It's about the fundamental tension between our unlimited wants and the limited resources available to satisfy them. Think of it like time—you want to do a million things, but there are only 24 hours in a day." },
    { role: "student", text: "Oh, I see. So because resources are limited, we have to make choices?" },
    { role: "teacher", text: "Exactly! And that brings us to the next big concept: Opportunity Cost. Since we have to choose, every choice has a cost—specifically, the value of the next best alternative you gave up." },
];

type Message = {
    id: string;
    role: "user" | "teacher" | "student";
    text: string;
};


export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "teacher", text: "Hello! I'm your Economics study companion. You can ask me questions about Chapter 1, or listen to a simulated discussion between a student and a teacher." }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isAudioMode, setIsAudioMode] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [scriptIndex, setScriptIndex] = useState(0);

    const [isListening, setIsListening] = useState(false);
    const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    // Handle Text-to-Speech
    const handleSpeak = (msg: Message) => {
        if (!('speechSynthesis' in window)) return;

        if (speakingMessageId === msg.id) {
            window.speechSynthesis.cancel();
            setSpeakingMessageId(null);
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(msg.text);
        utterance.onend = () => setSpeakingMessageId(null);
        setSpeakingMessageId(msg.id);
        window.speechSynthesis.speak(utterance);
    };

    // Speech Recognition Setup (Browser Native)
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
            setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => recognition.stop();
    }, [isListening]);


    // Simulated Audio Playback Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isAudioMode && isPlaying && scriptIndex < DIALOGUE_SCRIPT.length) {
            interval = setTimeout(() => {
                const line = DIALOGUE_SCRIPT[scriptIndex];
                const newMessage: Message = {
                    id: Date.now().toString(),
                    role: line.role as "student" | "teacher",
                    text: line.text,
                };

                setMessages((prev) => [...prev, newMessage]);
                setScriptIndex((prev) => prev + 1);

                // Simple TTS trigger
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(line.text);
                    utterance.pitch = line.role === "student" ? 1.2 : 0.9;
                    utterance.rate = 1.1;
                    window.speechSynthesis.speak(utterance);
                }

            }, 4000);
        }

        return () => clearTimeout(interval);
    }, [isAudioMode, isPlaying, scriptIndex]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
        const currentMessages = [...messages, userMsg];

        setMessages(currentMessages);
        setInputValue("");
        setIsAudioMode(false);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: currentMessages }),
            });

            if (!response.ok) throw new Error("API call failed");

            const data = await response.json();
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "teacher",
                text: data.text,
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error("Error fetching response:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "teacher",
                text: "Sorry, I'm having trouble connecting to the server. Please try again.",
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background relative">
            {/* Audio Control Header */}
            <div className="shrink-0 p-4 border-b bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Headphones className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Deep Dive Conversation</h3>
                        <p className="text-xs text-muted-foreground">Student & Teacher Discussion</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setIsAudioMode(true);
                        setIsPlaying(!isPlaying);
                    }}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                        isPlaying && isAudioMode
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                >
                    {isPlaying && isAudioMode ? (
                        <>
                            <Pause className="h-4 w-4 fill-current" /> Pause
                        </>
                    ) : (
                        <>
                            <Play className="h-4 w-4 fill-current" /> {scriptIndex > 0 ? "Resume" : "Start Listening"}
                        </>
                    )}
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-4 max-w-3xl mx-auto",
                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
                            msg.role === "teacher" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40" :
                                msg.role === "student" ? "bg-green-100 text-green-600 dark:bg-green-900/40" :
                                    "bg-slate-100 text-slate-600 dark:bg-slate-800"
                        )}>
                            {msg.role === "teacher" ? <Bot className="h-4 w-4" /> :
                                msg.role === "student" ? <User className="h-4 w-4" /> :
                                    <User className="h-4 w-4" />}
                        </div>

                        <div className={cn(
                            "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                            msg.role === "teacher" ? "bg-card border rounded-tl-none" :
                                msg.role === "student" ? "bg-card border rounded-tl-none border-green-200 dark:border-green-900/50" :
                                    "bg-primary text-primary-foreground rounded-tr-none"
                        )}>
                            <div className="font-semibold text-xs mb-1 opacity-70 uppercase tracking-wider">
                                {msg.role === "teacher" ? "AI Teacher" :
                                    msg.role === "student" ? "AI Student" : "You"}
                            </div>
                            {msg.text}

                            <button
                                onClick={() => handleSpeak(msg)}
                                className="mt-2 text-xs flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
                                title="Read Aloud"
                            >
                                {speakingMessageId === msg.id ? (
                                    <>
                                        <Square className="h-3 w-3 fill-current" /> Stop Reading
                                    </>
                                ) : (
                                    <>
                                        <Volume2 className="h-3 w-3" /> Read
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 p-6 border-t bg-background/50 backdrop-blur-sm z-10">
                <div className="max-w-3xl mx-auto relative flex items-center gap-2">
                    <button
                        onClick={() => setIsListening(!isListening)}
                        className={cn(
                            "p-3 rounded-full transition-all shrink-0",
                            isListening
                                ? "bg-red-500 text-white animate-pulse"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                        title="Voice Input"
                    >
                        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>

                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder={isListening ? "Listening..." : "Ask a question about the chapter..."}
                            className="w-full bg-muted/50 border hover:bg-muted/80 focus:bg-background transition-all rounded-full pl-6 pr-14 py-4 outline-none focus:ring-2 ring-primary/20"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-3">
                    AI may produce inaccurate information. Verify with source text.
                </p>
            </div>
        </div>
    );
}
