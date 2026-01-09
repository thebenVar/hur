"use client";

import { useState } from "react";
import { TicketData } from "./TicketDashboard";
import {
    Save,
    Monitor,
    AppWindow,
    Wifi,
    Key,
    Globe,
    GraduationCap,
    Truck,
    Tag,
    Clock,
    User,
    MessageCircle,
    Phone,
    Mail,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ManualTicketFormProps {
    onSubmit: (data: TicketData) => void;
    onCancel: () => void;
    initialData?: {
        contact?: string;
        summary?: string;
        source?: "phone" | "email" | "whatsapp" | "in-person" | "screen-share" | "other";
    };
}

export function ManualTicketForm({ onSubmit, onCancel, initialData }: ManualTicketFormProps) {
    const [formData, setFormData] = useState<Partial<TicketData>>(() => ({
        id: `INC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        contact: initialData?.contact || "",
        source: initialData?.source || "phone",
        duration: "0m 0s",
        topic: "",
        sentiment: "neutral",
        priority: "medium",
        summary: initialData?.summary || "",
        keyIssues: [],
        potentialCauses: [],
        actionPoints: [],
        assignee: "Unassigned",
        status: "open",
        category: "other",
        timeSpent: "0m",
        activityLog: []
    }));

    const [tempIssues, setTempIssues] = useState("");
    const [tempCauses, setTempCauses] = useState("");
    const [tempActions, setTempActions] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Process textareas into arrays
        const processList = (text: string) => text.split('\n').filter(line => line.trim() !== '');

        const finalData: TicketData = {
            id: formData.id || "INC-UNKNOWN",
            contact: formData.contact || "Unknown Contact",
            source: (formData.source || "other") as TicketData['source'],
            duration: formData.duration || "0m 0s",
            topic: formData.topic || "General Inquiry",
            sentiment: formData.sentiment as "positive" | "neutral" | "negative",
            priority: formData.priority as "low" | "medium" | "high",
            summary: formData.summary || "No summary provided.",
            keyIssues: processList(tempIssues),
            potentialCauses: processList(tempCauses),
            actionPoints: processList(tempActions).map((action, i) => ({
                id: `action-${Date.now()}-${i}`,
                text: action,
                completed: false,
                isNextAction: false
            })),
            assignee: formData.assignee || "Unassigned",
            status: formData.status || "open",
            category: formData.category || "other",
            timeSpent: formData.timeSpent || "0m",
            activityLog: []
        };

        onSubmit(finalData);
    };

    const categories = [
        { id: "translation", label: "Translation", icon: Globe, color: "text-blue-600 bg-blue-50 border-blue-200" },
        { id: "training", label: "Training", icon: GraduationCap, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
        { id: "logistics", label: "Logistics", icon: Truck, color: "text-amber-600 bg-amber-50 border-amber-200" },
        { id: "software", label: "Software", icon: AppWindow, color: "text-purple-600 bg-purple-50 border-purple-200" },
        { id: "hardware", label: "Hardware", icon: Monitor, color: "text-slate-600 bg-slate-50 border-slate-200" },
        { id: "network", label: "Network", icon: Wifi, color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
        { id: "access", label: "Access", icon: Key, color: "text-rose-600 bg-rose-50 border-rose-200" },
        { id: "other", label: "Other", icon: Tag, color: "text-gray-600 bg-gray-50 border-gray-200" },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[85vh]">
            {/* Sidebar - Meta Data */}
            <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-8 overflow-y-auto">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">New Ticket</h2>

                    <div className="space-y-6">
                        {/* Status */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                            <div className="flex flex-wrap gap-2">
                                {["open", "in-progress", "resolved", "closed"].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: s as TicketData['status'] })}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all",
                                            formData.status === s
                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                                        )}
                                    >
                                        {s.replace("-", " ")}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</label>
                            <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200">
                                {["low", "medium", "high"].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p as TicketData['priority'] })}
                                        className={cn(
                                            "flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
                                            formData.priority === p
                                                ? p === "high" ? "bg-red-100 text-red-700 shadow-sm" :
                                                    p === "medium" ? "bg-amber-100 text-amber-700 shadow-sm" :
                                                        "bg-green-100 text-green-700 shadow-sm"
                                                : "text-slate-500 hover:bg-slate-50"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sentiment */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Sentiment</label>
                            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                                {["negative", "neutral", "positive"].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, sentiment: s as TicketData['sentiment'] })}
                                        className={cn(
                                            "p-2 rounded-full transition-all hover:scale-110",
                                            formData.sentiment === s
                                                ? s === "positive" ? "bg-green-100 text-green-600 ring-2 ring-green-500 ring-offset-2" :
                                                    s === "negative" ? "bg-red-100 text-red-600 ring-2 ring-red-500 ring-offset-2" :
                                                        "bg-slate-100 text-slate-600 ring-2 ring-slate-500 ring-offset-2"
                                                : "text-slate-300 hover:bg-slate-50"
                                        )}
                                    >
                                        {s === "positive" ? "😊" : s === "negative" ? "😠" : "😐"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Assignee */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignee</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white text-sm"
                                    placeholder="Assign to..."
                                    value={formData.assignee}
                                    onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Time Spent */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time Spent</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white text-sm"
                                    placeholder="e.g. 15m"
                                    value={formData.timeSpent}
                                    onChange={e => setFormData({ ...formData, timeSpent: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-200 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-white hover:shadow-sm rounded-xl border border-transparent hover:border-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
                    >
                        <Save className="h-4 w-4" />
                        Create
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto bg-white">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Contact & Source */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Contact Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white text-lg font-medium"
                                placeholder="Who is calling?"
                                value={formData.contact}
                                onChange={e => setFormData({ ...formData, contact: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Source</label>
                            <div className="flex gap-2">
                                {["phone", "email", "whatsapp", "other"].map((src) => (
                                    <button
                                        key={src}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, source: src as TicketData['source'] })}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl border transition-all flex items-center justify-center",
                                            formData.source === src
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                                                : "bg-white border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-500"
                                        )}
                                        title={src}
                                    >
                                        {src === "phone" ? <Phone className="h-5 w-5" /> :
                                            src === "email" ? <Mail className="h-5 w-5" /> :
                                                src === "whatsapp" ? <MessageCircle className="h-5 w-5" /> :
                                                    <Users className="h-5 w-5" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Category Grid */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700">Category</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.id as TicketData['category'] })}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-[1.02]",
                                        formData.category === cat.id
                                            ? cn("ring-2 ring-offset-2 ring-indigo-500", cat.color)
                                            : "bg-white border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-slate-50"
                                    )}
                                >
                                    <cat.icon className="h-6 w-6" />
                                    <span className="text-xs font-medium">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Topic & Summary */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Topic</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
                                placeholder="What is this about?"
                                value={formData.topic}
                                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Summary</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none bg-slate-50 focus:bg-white"
                                placeholder="Describe the issue in detail..."
                                value={formData.summary}
                                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Key Issues</label>
                            <textarea
                                rows={4}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-sm"
                                placeholder="- Issue 1..."
                                value={tempIssues}
                                onChange={e => setTempIssues(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Potential Causes</label>
                            <textarea
                                rows={4}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-sm"
                                placeholder="- Cause 1..."
                                value={tempCauses}
                                onChange={e => setTempCauses(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Action Points</label>
                            <textarea
                                rows={4}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-sm"
                                placeholder="- Action 1..."
                                value={tempActions}
                                onChange={e => setTempActions(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
