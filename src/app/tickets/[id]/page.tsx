"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TicketDashboard, type TicketData } from "@/components/TicketDashboard";

// Mock data generator based on ID
const getMockTicketData = (id: string): TicketData => {
    return {
        id: id,
        contact: "Anjali Sharma",
        source: "phone",
        duration: "4m 32s",
        topic: "Translation memory sync failure",
        sentiment: "negative",
        priority: "high",
        summary: "User reported that the translation memory is not syncing with the central server. This is causing delays in the current project. User is frustrated as this has happened twice this week.",
        keyIssues: [
            "Translation memory sync failure",
            "Repeated occurrence",
            "Project delay risk"
        ],
        actionPoints: [
            { id: "ap-1", text: "Check server logs for sync errors", completed: false, isNextAction: false },
            { id: "ap-2", text: "Verify user's network connection", completed: true, isNextAction: false },
            { id: "ap-3", text: "Reset local translation memory cache", completed: false, isNextAction: true }
        ],
        potentialCauses: [
            "Network timeout",
            "Server overload",
            "Corrupted local cache"
        ],
        assignee: "Raju",
        status: "open",
        category: "translation",
        timeSpent: "15m",
        activityLog: [
            {
                id: "1",
                type: "note",
                content: "Initial investigation started. Checking server logs.",
                timestamp: "10m ago",
                author: "Raju"
            },
            {
                id: "2",
                type: "status_change",
                content: "Status changed to In Progress",
                timestamp: "15m ago",
                author: "System"
            }
        ]
    };
};

export default function TicketDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [ticketData, setTicketData] = useState<TicketData>(() => getMockTicketData(id));

    return (
        <div className="min-h-screen bg-slate-50/50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Link
                    href="/tickets"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to All Tickets
                </Link>

                <TicketDashboard 
                    data={ticketData}
                    onUpdateData={setTicketData}
                />
            </div>
        </div>
    );
}
