"use client";

import {
    CheckCircle2,
    Clock,
    User,
    Phone,
    Tag,
    ThumbsUp,
    ThumbsDown,
    Mail,
    MessageCircle,
    Users,
    Monitor,
    AppWindow,
    Wifi,
    Key,
    Globe,
    GraduationCap,
    Truck,
    Lightbulb,
    MonitorPlay,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TicketActivity, ActivityItem } from "./TicketActivity";

export interface TicketData {
    id: string;
    contact: string;
    source: "phone" | "email" | "whatsapp" | "in-person" | "screen-share" | "other";
    duration: string;
    topic: string;
    sentiment: "positive" | "neutral" | "negative";
    priority: "low" | "medium" | "high";
    summary: string;
    keyIssues: string[];
    actionPoints: { id: string; text: string; completed: boolean; isNextAction?: boolean }[];
    potentialCauses: string[];
    // New attributes
    assignee: string;
    status: "open" | "in-progress" | "resolved" | "closed";
    category: "hardware" | "software" | "network" | "access" | "translation" | "training" | "logistics" | "other";
    timeSpent: string;
    activityLog: ActivityItem[];
}

export function TicketDashboard({ data, onUpdateData }: { data: TicketData, onUpdateData: (data: TicketData) => void }) {
    // Local state for UI interactions, not for mirroring props
    const [newActionText, setNewActionText] = useState("");
    const [newActionNote, setNewActionNote] = useState("");
    const [showAddNote, setShowAddNote] = useState(false);

    // Helper to log activities
    const logActivity = (type: ActivityItem["type"], content: string, note?: string) => {
        const newActivity: ActivityItem = {
            id: `act-${new Date().getTime()}`,
            type,
            author: "You", // In real app, current user
            timestamp: "Just now",
            content: note ? `${content}\n\nNote: ${note}` : content
        };
        onUpdateData({ ...data, activityLog: [newActivity, ...data.activityLog] });
    };

    // Mock handler for adding activity from the Activity Log component
    const handleAddActivity = (type: string, content: string) => {
        logActivity(type as ActivityItem["type"], content);
    };

    // Action Point Handlers
    const toggleAction = (id: string) => {
        const updatedActions = data.actionPoints.map(a => {
            if (a.id === id) {
                const newCompleted = !a.completed;
                logActivity("status_change", `Marked action point '${a.text}' as ${newCompleted ? "completed" : "incomplete"}`);
                return { ...a, completed: newCompleted };
            }
            return a;
        });
        onUpdateData({ ...data, actionPoints: updatedActions });
    };

    const setAsNextAction = (id: string) => {
        const action = data.actionPoints.find(a => a.id === id);
        if (!action) return;

        const isCurrentlyNext = action.isNextAction;

        const updatedActions = data.actionPoints.map(a => ({
            ...a,
            isNextAction: a.id === id ? !isCurrentlyNext : false
        }));
        onUpdateData({ ...data, actionPoints: updatedActions });

        if (!isCurrentlyNext) {
            logActivity("log", `Marked '${action.text}' as the Next Action.`);
        } else {
            logActivity("log", `Unmarked '${action.text}' as the Next Action.`);
        }
    };

    const addAction = () => {
        if (!newActionText.trim()) return;

        const newAction = {
            id: `action-${new Date().getTime()}`,
            text: newActionText,
            completed: false,
            isNextAction: false
        };

        onUpdateData({ ...data, actionPoints: [...data.actionPoints, newAction] });
        logActivity("log", `Added action point: ${newActionText}`, newActionNote);

        // Reset
        setNewActionText("");
        setNewActionNote("");
        setShowAddNote(false);
    };

    // Remove unused functions: confirmDelete, saveEdit, nextAction, FileTextIcon

    // Determine Next Action for display

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto space-y-6"
        >
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-slate-900">Ticket #{data.id}</h2>
                        <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                            data.status === "open" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                data.status === "in-progress" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                    data.status === "resolved" ? "bg-green-50 text-green-700 border-green-200" :
                                        "bg-slate-50 text-slate-700 border-slate-200"
                        )}>
                            {data.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                            data.priority === "high" ? "bg-red-50 text-red-700 border-red-200" :
                                data.priority === "medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                    "bg-green-50 text-green-700 border-green-200"
                        )}>
                            {data.priority.toUpperCase()} Priority
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            {data.contact}
                        </div>
                        <div className="flex items-center gap-1.5 capitalize">
                            {data.source === 'phone' ? <Phone className="h-4 w-4" /> :
                                data.source === 'email' ? <Mail className="h-4 w-4" /> :
                                    data.source === 'whatsapp' ? <MessageCircle className="h-4 w-4" /> :
                                        data.source === 'screen-share' ? <MonitorPlay className="h-4 w-4" /> :
                                            <Users className="h-4 w-4" />}
                            {data.source === 'screen-share' ? 'Screen Share' : data.source}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            Call: {data.duration}
                        </div>
                        <div className="flex items-center gap-1.5 capitalize">
                            {data.category === 'hardware' ? <Monitor className="h-4 w-4" /> :
                                data.category === 'software' ? <AppWindow className="h-4 w-4" /> :
                                    data.category === 'network' ? <Wifi className="h-4 w-4" /> :
                                        data.category === 'access' ? <Key className="h-4 w-4" /> :
                                            data.category === 'translation' ? <Globe className="h-4 w-4" /> :
                                                data.category === 'training' ? <GraduationCap className="h-4 w-4" /> :
                                                    data.category === 'logistics' ? <Truck className="h-4 w-4" /> :
                                                        <Tag className="h-4 w-4" />}
                            {data.category}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border",
                        data.sentiment === "positive" ? "bg-green-50 border-green-100 text-green-700" :
                            data.sentiment === "negative" ? "bg-red-50 border-red-100 text-red-700" :
                                "bg-slate-50 border-slate-100 text-slate-700"
                    )}>
                        {data.sentiment === "positive" ? <ThumbsUp className="h-4 w-4" /> :
                            data.sentiment === "negative" ? <ThumbsDown className="h-4 w-4" /> :
                                <div className="h-4 w-4 rounded-full border-2 border-current" />}
                        <span className="font-medium capitalize">{data.sentiment} Sentiment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-medium">Assignee:</span>
                        <div className="flex items-center gap-1.5">
                            <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                {data.assignee.charAt(0)}
                            </div>
                            {data.assignee}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-medium">Time Spent:</span>
                        <span>{data.timeSpent}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Action Points */}
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Action Points ({data.actionPoints.filter(a => !a.completed).length} pending)</h3>
                    <div className="space-y-3">
                        {data.actionPoints.map(action => (
                            <motion.div
                                key={action.id}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className={cn(
                                    "p-3 rounded-lg border transition-all",
                                    action.completed ? "bg-slate-50 border-slate-200" : "bg-white",
                                    action.isNextAction && !action.completed ? "border-purple-400 ring-2 ring-purple-200" : "border-slate-200"
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <button onClick={() => toggleAction(action.id)} className="mt-1 shrink-0">
                                        <div className={cn(
                                            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                                            action.completed ? "bg-green-500 border-green-500" : "border-slate-300 hover:border-slate-400"
                                        )}>
                                            {action.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                                        </div>
                                    </button>
                                    <div className="flex-1">
                                        <p className={cn("text-sm", action.completed && "line-through text-slate-500")}>
                                            {action.text}
                                        </p>
                                        {action.isNextAction && !action.completed && (
                                            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                Next Action
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <button
                                            onClick={() => setAsNextAction(action.id)}
                                            className="p-1 text-slate-400 hover:text-purple-600 rounded-md hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={action.isNextAction ? "Unmark as Next Action" : "Mark as Next Action"}
                                            disabled={action.completed}
                                        >
                                            <Lightbulb className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {/* Add new action form */}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newActionText}
                                onChange={(e) => setNewActionText(e.target.value)}
                                placeholder="Add a new action point..."
                                className="grow px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                onKeyPress={(e) => e.key === 'Enter' && addAction()}
                            />
                            <button
                                onClick={addAction}
                                className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                                disabled={!newActionText.trim()}
                            >
                                Add
                            </button>
                        </div>
                        {showAddNote ? (
                            <textarea
                                value={newActionNote}
                                onChange={(e) => setNewActionNote(e.target.value)}
                                placeholder="Add an optional note..."
                                className="mt-2 w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows={2}
                            />
                        ) : (
                            <button onClick={() => setShowAddNote(true)} className="text-xs text-slate-500 hover:text-slate-700 mt-1">
                                + Add note
                            </button>
                        )}
                    </div>
                </section>
                {/* Activity Log */}
                <TicketActivity
                    activities={data.activityLog}
                    onAddActivity={handleAddActivity}
                />
            </div>
        </motion.div>
    );
}
