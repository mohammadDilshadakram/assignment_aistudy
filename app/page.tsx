"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CHAPTER_CONTENT, VIDEO_DATA } from "@/lib/data";
import { FileText, Play, MessageCircle, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatInterface } from "@/components/ChatInterface";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>("pdf");
  const [sourceType, setSourceType] = useState<"pdf" | "video">("pdf");

  // Placeholder for Chat/Audio State
  const [mode, setMode] = useState<"chat" | "source">("source");

  const handleSelectSource = (type: "pdf" | "video", id?: string) => {
    setSourceType(type);
    setSelectedSourceId(id || "pdf");
    setMode("source"); // Switch to view source when a source is clicked
    setSummaryStatus("idle"); // Reset summary status on new selection
  };

  const [summaryStatus, setSummaryStatus] = useState<"idle" | "generating" | "done">("idle");

  const handleGenerateSummary = () => {
    setSummaryStatus("generating");
    // Simulate AI generation delay
    setTimeout(() => {
      setSummaryStatus("done");
    }, 2000);
  };

  const currentVideo = VIDEO_DATA.find((v) => v.id === selectedSourceId);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSelect={handleSelectSource} selectedId={selectedSourceId} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header / Mode Switcher */}
        <header className="h-16 border-b flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm z-10 shrink-0">
          <h2 className="font-semibold text-lg truncate">
            {sourceType === "pdf" ? "Chapter 1: Introduction to Economics" : currentVideo?.title}
          </h2>

          <div className="flex items-center gap-2 bg-muted p-1 rounded-full">
            <button
              onClick={() => setMode("source")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                mode === "source"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Source
            </button>
            <button
              onClick={() => setMode("chat")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                mode === "chat"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              Chat & Audio
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 relative">
          {mode === "source" ? (
            <div className="max-w-4xl mx-auto h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              {sourceType === "pdf" ? (
                <div className="prose prose-slate dark:prose-invert max-w-none bg-card p-10 rounded-xl shadow-sm border">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b">
                    <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold m-0">Introduction to Economics</h1>
                      <p className="text-muted-foreground mt-1">PDF Source • 14 Pages</p>
                    </div>
                  </div>
                  <div className="leading-relaxed">
                    <ReactMarkdown>{CHAPTER_CONTENT}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6 h-full">
                  {currentVideo && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border bg-black">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${currentVideo.id}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {currentVideo && (
                    <div className="bg-card rounded-xl p-6 border shadow-sm flex flex-col h-full min-h-[300px]">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Play className="h-5 w-5 text-primary fill-current" />
                        Video Summary
                      </h3>

                      {summaryStatus === "idle" && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl bg-muted/30">
                          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="h-8 w-8 text-primary" />
                          </div>
                          <h4 className="font-semibold text-lg mb-2">Detailed Summary Available</h4>
                          <p className="text-muted-foreground text-sm max-w-xs mb-6">
                            Generate a comprehensive AI summary of this video's key concepts and takeaways.
                          </p>
                          <button
                            onClick={handleGenerateSummary}
                            className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                          >
                            <Sparkles className="h-4 w-4" /> Generate Summary
                          </button>
                        </div>
                      )}

                      {summaryStatus === "generating" && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                          <p className="text-muted-foreground font-medium animate-pulse">Analyzing video content...</p>
                        </div>
                      )}

                      {summaryStatus === "done" && (
                        <ul className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                          {currentVideo.summary.map((point, index) => (
                            <li key={index} className="flex gap-3 text-muted-foreground">
                              <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-sm leading-relaxed">
                                <ReactMarkdown>{point}</ReactMarkdown>
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full animate-in fade-in zoom-in-95 duration-300">
              <ChatInterface />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
