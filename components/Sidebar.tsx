import { FileText, Youtube, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { VIDEO_DATA } from "@/lib/data";

interface SidebarProps {
    onSelect: (type: "pdf" | "video", id?: string) => void;
    selectedId: string | null;
}

export function Sidebar({ onSelect, selectedId }: SidebarProps) {
    return (
        <div className="w-80 border-r bg-muted/30 flex flex-col h-full bg-slate-50 dark:bg-slate-950/50">
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    StudyTool AI
                </h1>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto flex-1">
                <div>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                        Sources
                    </h2>
                    <div className="space-y-1">
                        <button
                            onClick={() => onSelect("pdf")}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                                selectedId === "pdf"
                                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="truncate">Chapter 1: Intro to Eco...</span>
                        </button>
                    </div>
                </div>

                <div>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                        Videos
                    </h2>
                    <div className="space-y-1">
                        {VIDEO_DATA.map((video) => (
                            <button
                                key={video.id}
                                onClick={() => onSelect("video", video.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                                    selectedId === video.id
                                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                    <Youtube className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="truncate">{video.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}