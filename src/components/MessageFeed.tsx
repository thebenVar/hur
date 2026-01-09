"use client";

import { useState } from "react";
import { MessageCircle, Mail, ArrowRight, X, Send, Paperclip, Search, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IncomingMessage, Ticket } from "@/lib/types";

interface MessageFeedProps {
    messages: IncomingMessage[];
    tickets: Ticket[];
    onDismiss: (id: string) => void;
    onAttachToTicket: (messageId: string, ticketId: string) => void;
}

export function MessageFeed({ messages, tickets, onDismiss, onAttachToTicket }: MessageFeedProps) {
    const [attachingMessageId, setAttachingMessageId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    const getSuggestedTickets = (message: IncomingMessage) => {
        // Simple heuristic: match sender or check if ticket ID is in text
        return tickets.filter(ticket => {
            const matchesSender = ticket.customer.toLowerCase() === message.sender.toLowerCase();
            const matchesId = message.text.includes(ticket.id);
            // Basic keyword matching could go here
            return matchesSender || matchesId;
        }).slice(0, 3);
    };

    const filteredTickets = tickets.filter(ticket =>
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAttachClick = (message: IncomingMessage) => {
        setAttachingMessageId(message.id);
        setSearchQuery("");
        setSelectedTicketId(null);
    };

    const handleConfirmAttach = () => {
        if (attachingMessageId && selectedTicketId) {
            onAttachToTicket(attachingMessageId, selectedTicketId);
            setAttachingMessageId(null);
            setSelectedTicketId(null);
        }
    };

    if (messages.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                    <MessageCircle className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="font-medium text-slate-900">All caught up!</h3>
                <p className="text-sm text-slate-500">No new messages in the inbox.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">Live Inbox</h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                        {messages.length}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-slate-500 font-medium">Monitoring</span>
                </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
                {messages.map((msg) => (
                    <div key={msg.id} className="p-4 hover:bg-slate-50 transition-colors group relative">
                        <div className="flex gap-4">
                            <div className={cn("h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm relative", msg.avatarColor)}>
                                <span className="font-semibold text-sm">{msg.sender.charAt(0)}</span>
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm z-10">
                                    {msg.platform === 'whatsapp' ? (
                                        <div className="bg-green-500 rounded-full p-1">
                                            <MessageCircle className="h-2.5 w-2.5 text-white" />
                                        </div>
                                    ) : msg.platform === 'email' ? (
                                        <div className="bg-blue-500 rounded-full p-1">
                                            <Mail className="h-2.5 w-2.5 text-white" />
                                        </div>
                                    ) : (
                                        <div className="bg-slate-500 rounded-full p-1">
                                            <Send className="h-2.5 w-2.5 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-semibold text-slate-900 truncate pr-8">{msg.sender}</h4>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">{msg.timestamp}</span>
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                                    {msg.type === 'voice' && <span className="italic text-slate-500">🎤 Voice Note: </span>}
                                    {msg.type === 'image' && <span className="italic text-slate-500">🖼️ Image: </span>}
                                    {msg.type === 'video' && <span className="italic text-slate-500">🎥 Video: </span>}
                                    {msg.text}
                                </p>

                                {attachingMessageId === msg.id ? (
                                    <div className="mt-3 bg-slate-50 rounded-lg p-3 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-slate-700">Attach to Ticket</span>
                                            <button onClick={() => setAttachingMessageId(null)} className="text-slate-400 hover:text-slate-600">
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        <div className="relative mb-2">
                                            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search tickets..."
                                                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-1 max-h-32 overflow-y-auto mb-2">
                                            {searchQuery === "" && getSuggestedTickets(msg).length > 0 && (
                                                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Suggested</div>
                                            )}

                                            {(searchQuery === "" ? getSuggestedTickets(msg) : filteredTickets).map(ticket => (
                                                <button
                                                    key={ticket.id}
                                                    onClick={() => setSelectedTicketId(ticket.id)}
                                                    className={cn(
                                                        "w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between group/ticket",
                                                        selectedTicketId === ticket.id ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "hover:bg-white hover:shadow-sm text-slate-600"
                                                    )}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium truncate">{ticket.id} - {ticket.title}</div>
                                                        <div className="text-[10px] opacity-70 truncate">{ticket.customer} • {ticket.status}</div>
                                                    </div>
                                                    {selectedTicketId === ticket.id && <Check className="h-3 w-3 flex-shrink-0 ml-2" />}
                                                </button>
                                            ))}

                                            {filteredTickets.length === 0 && searchQuery !== "" && (
                                                <div className="text-xs text-slate-500 text-center py-2">No tickets found</div>
                                            )}
                                        </div>

                                        <div className="flex justify-end pt-2 border-t border-slate-200">
                                            <button
                                                onClick={handleConfirmAttach}
                                                disabled={!selectedTicketId}
                                                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Attach Message
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={{
                                                pathname: '/tickets/create',
                                                query: {
                                                    source: msg.platform === 'internal' ? 'in-person' : msg.platform,
                                                    contact: msg.sender === 'You' ? '' : msg.sender,
                                                    description: msg.text,
                                                    view: 'manual-entry'
                                                }
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                                        >
                                            Convert to Ticket
                                            <ArrowRight className="h-3 w-3" />
                                        </Link>
                                        <button
                                            onClick={() => handleAttachClick(msg)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 bg-white border border-slate-200 text-xs font-medium hover:bg-slate-50 transition-colors"
                                        >
                                            <Paperclip className="h-3 w-3" />
                                            Attach
                                        </button>
                                        <button
                                            onClick={() => onDismiss(msg.id)}
                                            className="px-3 py-1.5 rounded-lg text-slate-600 bg-white border border-slate-200 text-xs font-medium hover:bg-slate-50 transition-colors"
                                        >
                                            Mark as Read
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => onDismiss(msg.id)}
                            className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

