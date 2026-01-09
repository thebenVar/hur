"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MessageFeed } from "@/components/MessageFeed";
import { QuickActions } from "@/components/QuickActions";
import { IncomingMessage, Ticket } from "@/lib/types";

const MOCK_MESSAGES: IncomingMessage[] = [
	{
		id: "msg-1",
		sender: "John Doe",
		text: "Hey, regarding ticket INC-2024-8491, the printer on the 2nd floor is still jammed. Can someone check it again? I've tried restarting it multiple times but it just keeps making this weird grinding noise and then getting stuck. It's really urgent because we have a big presentation coming up.",
		platform: "whatsapp",
		timestamp: "2m ago",
		avatarColor: "bg-green-100 text-green-700",
		type: "text",
	},
	{
		id: "msg-2",
		sender: "Priya Singh",
		text: "I'm locked out of my account. Error code 503.",
		platform: "whatsapp",
		timestamp: "15m ago",
		avatarColor: "bg-blue-100 text-blue-700",
		type: "text",
	},
	{
		id: "msg-3",
		sender: "marketing-team@company.com",
		text: "Urgent: Website is down for external traffic.",
		platform: "email",
		timestamp: "1h ago",
		avatarColor: "bg-purple-100 text-purple-700",
		type: "text",
	},
];

const MOCK_TICKETS: Ticket[] = [
	{
		id: "INC-2024-8491",
		title: "Printer Jammed on 2nd Floor",
		status: "In Progress",
		priority: "Medium",
		customer: "John Doe",
		lastUpdated: "1h ago",
	},
	{
		id: "INC-2024-8492",
		title: "Login Failure",
		status: "Open",
		priority: "High",
		customer: "Priya Singh",
		lastUpdated: "2h ago",
	},
	{
		id: "INC-2024-8493",
		title: "Website Downtime",
		status: "Open",
		priority: "Critical",
		customer: "Marketing Team",
		lastUpdated: "30m ago",
	},
];

export default function Dashboard() {
	const [messages, setMessages] = useState<IncomingMessage[]>(MOCK_MESSAGES);
	const [tickets] = useState<Ticket[]>(MOCK_TICKETS);

	const handleAddMessage = (text: string, type: "text" | "voice" | "image" | "video") => {
		const newMessage: IncomingMessage = {
			id: `msg-${Date.now()}`,
			sender: "You",
			text: type === "text" ? text : `Sent a ${type} note`,
			platform: "internal",
			timestamp: "Just now",
			avatarColor: "bg-slate-100 text-slate-700",
			type: type,
		};
		setMessages([newMessage, ...messages]);
	};

	const handleDismiss = (id: string) => {
		setMessages(messages.filter((m) => m.id !== id));
	};

	const handleAttachToTicket = (messageId: string, ticketId: string) => {
		const message = messages.find((m) => m.id === messageId);
		const ticket = tickets.find((t) => t.id === ticketId);

		if (message && ticket) {
			// In a real app, this would make an API call
			alert(`Attached message from ${message.sender} to ticket ${ticket.id}`);
			handleDismiss(messageId);
		}
	};

	return (
		<div className="flex flex-col gap-8 pb-8">
			{/* Welcome Section - Removed to save space */}

			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
					<div className="text-sm text-slate-500 mb-1">Total Tickets</div>
					<div className="text-2xl font-bold text-slate-900">24</div>
					<div className="text-xs text-green-600 mt-1 flex items-center gap-1">
						<span>+12%</span>
						<span className="text-slate-400">vs yesterday</span>
					</div>
				</div>
				<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
					<div className="text-sm text-slate-500 mb-1">Avg. Resolution</div>
					<div className="text-2xl font-bold text-slate-900">1h 42m</div>
					<div className="text-xs text-green-600 mt-1 flex items-center gap-1">
						<span>-8%</span>
						<span className="text-slate-400">vs last week</span>
					</div>
				</div>
				<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
					<div className="text-sm text-slate-500 mb-1">Customer Satisfaction</div>
					<div className="text-2xl font-bold text-slate-900">4.8/5.0</div>
					<div className="text-xs text-green-600 mt-1 flex items-center gap-1">
						<span>+0.2</span>
						<span className="text-slate-400">vs last month</span>
					</div>
				</div>
				<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
					<div className="text-sm text-slate-500 mb-1">Pending Actions</div>
					<div className="text-2xl font-bold text-slate-900">7</div>
					<div className="text-xs text-amber-600 mt-1 flex items-center gap-1">
						<span>Needs attention</span>
					</div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:h-[800px]">
				{/* Left Column: Live Inbox & Recent Activity */}
				<div className="lg:col-span-2 lg:h-full flex flex-col gap-6">
					<div className="h-[350px] min-h-0 shrink-0">
						<MessageFeed
							messages={messages}
							tickets={tickets}
							onDismiss={handleDismiss}
							onAttachToTicket={handleAttachToTicket}
						/>
					</div>

					<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
						<div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
							<h3 className="font-semibold text-slate-900">Recent Activity</h3>
							<Link
								href="/tickets"
								className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
							>
								View All <ArrowRight className="h-4 w-4" />
							</Link>
						</div>
						<div className="divide-y divide-slate-100 overflow-y-auto flex-1">
							{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
								<Link
									href={`/tickets/INC-2024-849${i}`}
									key={i}
									className="block px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
								>
									<div className="flex justify-between items-start mb-1">
										<span className="text-xs font-medium text-slate-500">
											INC-2024-849{i}
										</span>
										<span
											className={`text-xs px-2 py-0.5 rounded-full border ${
												i % 3 === 0
													? "bg-red-50 text-red-700 border-red-100"
													: i % 2 === 0
													? "bg-amber-50 text-amber-700 border-amber-100"
													: "bg-blue-50 text-blue-700 border-blue-100"
											}`}
										>
											{i % 3 === 0
												? "High"
												: i % 2 === 0
												? "Medium"
												: "Low"}
										</span>
									</div>
									<h4 className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
										{i % 3 === 0
											? "System outage in region US-East"
											: i % 2 === 0
											? "Login failure for user account"
											: "Printer configuration issue"}
									</h4>
									<div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
										<span>Anjali Sharma</span>
										<span>•</span>
										<span>2h ago</span>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>

				{/* Right Column: Quick Actions & Insights */}
				<div className="lg:col-span-1 flex flex-col gap-6 lg:h-full lg:overflow-y-auto order-first lg:order-0">
					<QuickActions onAddMessage={handleAddMessage} />

					<div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
						<h3 className="font-semibold text-lg mb-2">hurAI</h3>
						<p className="text-indigo-200 text-sm mb-6">
							3 emerging trends identified today.
						</p>
						<button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg py-2 text-sm font-medium transition-colors">
							View Insights
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
