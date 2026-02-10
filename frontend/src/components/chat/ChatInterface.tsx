'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, getConversations, getConversationMessages, deleteConversation, Conversation } from '@/lib/chat-api';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Send, Bot, User, Loader2, Trash2, ChevronRight, MessageSquare, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatInterface({ token }: { token?: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | undefined>();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [messageCount, setMessageCount] = useState(0);
    const [isQuotaAlertOpen, setIsQuotaAlertOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const QUOTA_LIMIT = 7;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const data = await getConversations(token);
            setConversations(data);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
            toast.error('Failed to load history');
        } finally {
            setIsInitialLoading(false);
        }
    };

    const loadConversation = async (id: string) => {
        if (id === conversationId || isLoading) return;

        setIsLoading(true);
        setConversationId(id);
        setMessages([]);

        try {
            const history = await getConversationMessages(id, token);
            setMessages(history.map(m => ({ role: m.role, content: m.content })));
            // Optionally count existing user messages if you want the quota to be persistent
            const userMsgCount = history.filter(m => m.role === 'user').length;
            setMessageCount(userMsgCount);
        } catch (error) {
            console.error('Failed to load messages:', error);
            toast.error('Failed to load conversation');
        } finally {
            setIsLoading(false);
        }
    };

    const startNewChat = () => {
        setConversationId(undefined);
        setMessages([]);
        setInput('');
        setMessageCount(0);
    };

    const confirmDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setConversationToDelete(id);
        setIsDeleteAlertOpen(true);
    };

    const handleDeleteConversation = async () => {
        if (!conversationToDelete) return;

        try {
            await deleteConversation(conversationToDelete, token);
            setConversations(prev => prev.filter(c => c.id !== conversationToDelete));
            if (conversationToDelete === conversationId) {
                startNewChat();
            }
            toast.success('Conversation deleted');
        } catch (error) {
            console.error('Failed to delete conversation:', error);
            toast.error('Failed to delete conversation');
        } finally {
            setIsDeleteAlertOpen(false);
            setConversationToDelete(null);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim() || isLoading) return;

        if (messageCount >= QUOTA_LIMIT) {
            setIsQuotaAlertOpen(true);
            return;
        }

        const userMessage = input.trim();
        setInput('');

        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);
        setMessageCount(prev => prev + 1);

        try {
            const response = await sendChatMessage(userMessage, conversationId, token);

            if (!conversationId) {
                setConversationId(response.conversation_id);
                fetchConversations(); // Refresh list to show new conversation
            }

            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: response.response },
            ]);

            if (messageCount + 1 >= QUOTA_LIMIT) {
                setIsQuotaAlertOpen(true);
            }
        } catch (error) {
            console.error('Chat error:', error);
            toast.error('Connection lost. Please try again.');
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: '❌ Sorry, I encountered an error. Please try again.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full gap-0 sm:gap-4 animate-fade-up">
            {/* Main Chat Area */}
            <div className="flex flex-1 flex-col border-r sm:border border-border/40 bg-card/30 backdrop-blur-xl sm:rounded-2xl shadow-none sm:shadow-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-border/40 bg-card/40 px-6 py-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shadow-lg shadow-accent/20">
                            <Sparkles className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">AI Assistant</h2>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Online & Ready</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={startNewChat}
                            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/10"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">New Chat</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                            className={cn(
                                "h-9 w-9 text-muted-foreground transition-transform",
                                isHistoryOpen && "rotate-180"
                            )}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide">
                    {messages.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent/10 border border-accent/20">
                                <Bot className="h-10 w-10 text-accent" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">How can I help you today?</h3>
                            <p className="max-w-[300px] text-muted-foreground text-sm leading-relaxed">
                                I can help you manage your tasks, set reminders, or organize your day.
                            </p>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-end gap-3 animate-in slide-in-from-bottom-2 duration-300",
                                message.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                                message.role === 'user'
                                    ? "bg-background border-border text-muted-foreground"
                                    : "bg-accent border-accent text-accent-foreground"
                            )}>
                                {message.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                            </div>
                            <div
                                className={cn(
                                    "relative max-w-[85%] rounded-2xl px-5 py-3 shadow-sm",
                                    message.role === 'user'
                                        ? "bg-secondary/40 border border-border/50 text-foreground rounded-br-none"
                                        : "bg-accent/10 border border-accent/20 text-foreground rounded-bl-none"
                                )}
                            >
                                {message.role === 'assistant' ? (
                                    <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-background/50 prose-pre:border prose-pre:border-border/50">
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-end gap-3 animate-in fade-in duration-300">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent border border-accent text-accent-foreground">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <div className="rounded-2xl bg-accent/10 border border-accent/20 px-5 py-3 rounded-bl-none">
                                <div className="flex gap-1.5 py-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} className="h-2" />
                </div>

                {/* Input Form */}
                <div className="border-t border-border/40 bg-card/40 px-6 py-6 backdrop-blur-md">
                    <form onSubmit={handleSend} className="relative flex items-center gap-3">
                        <div className="relative flex-1 group">
                            <Input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={messageCount >= QUOTA_LIMIT ? "Quota reached for this session" : "Ask me something..."}
                                className={cn(
                                    "h-14 border-border/80 bg-background/40 pl-5 pr-12 text-base transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/10 hover:border-accent/40 rounded-xl",
                                    messageCount >= QUOTA_LIMIT && "opacity-50 cursor-not-allowed bg-muted"
                                )}
                                disabled={isLoading || messageCount >= QUOTA_LIMIT}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                {isLoading && <Loader2 className="h-5 w-5 animate-spin text-accent" />}
                                {messageCount >= QUOTA_LIMIT && <AlertCircle className="h-5 w-5 text-destructive" />}
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim() || messageCount >= QUOTA_LIMIT}
                            className="h-14 w-14 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                    <div className="mt-3 flex justify-between items-center px-1">
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
                            Powered by Google Gemini 2.5 Flash
                        </p>
                        <p className={cn(
                            "text-[10px] uppercase tracking-widest font-bold",
                            messageCount >= QUOTA_LIMIT ? "text-destructive" : "text-muted-foreground/60"
                        )}>
                            Quota: {messageCount}/{QUOTA_LIMIT}
                        </p>
                    </div>
                </div>
            </div>

            {/* History Sidebar */}
            {isHistoryOpen && (
                <div className="w-72 border-l sm:border border-border/40 bg-card/30 backdrop-blur-xl sm:rounded-2xl shadow-none sm:shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                    <div className="p-6 border-b border-border/40">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            History
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
                        {isInitialLoading ? (
                            <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground/60">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="text-xs font-medium uppercase tracking-widest">Loading history...</span>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 px-4 text-center text-muted-foreground/60">
                                <MessageSquare className="h-8 w-8 mb-3 opacity-20" />
                                <p className="text-xs font-medium leading-relaxed">No conversations yet.<br />Start a new one to see it here.</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => loadConversation(conv.id)}
                                    className={cn(
                                        "group relative flex items-center gap-3 rounded-xl p-3 text-sm transition-all cursor-pointer border border-transparent",
                                        conv.id === conversationId
                                            ? "bg-accent/10 border-accent/20 text-foreground"
                                            : "hover:bg-accent/5 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "h-2 w-2 rounded-full ring-4 ring-background/0 transition-all",
                                        conv.id === conversationId ? "bg-accent ring-accent/20" : "bg-muted-foreground/30"
                                    )} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate leading-none mb-1">
                                            {conv.title || "New Chat"}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/70 font-medium">
                                            {format(new Date(conv.updated_at), 'MMM d, h:mm a')}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => confirmDelete(e, conv.id)}
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive rounded-lg"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 border-t border-border/40">
                        <Button
                            variant="outline"
                            className="w-full gap-2 rounded-xl border-border/50 bg-background/40 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 shadow-sm"
                            onClick={startNewChat}
                        >
                            <Plus className="h-4 w-4" />
                            New Conversation
                        </Button>
                    </div>
                </div>
            )}

            {/* AlertDialogs */}
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent className="bg-card/90 backdrop-blur-xl border-border/40 rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your conversation history and all associated messages.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-border/50">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConversation}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                        >
                            Delete Permanently
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isQuotaAlertOpen} onOpenChange={setIsQuotaAlertOpen}>
                <AlertDialogContent className="bg-card/90 backdrop-blur-xl border-border/40 rounded-2xl">
                    <AlertDialogHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                            <AlertCircle className="h-6 w-6 text-accent" />
                        </div>
                        <AlertDialogTitle className="text-center">Usage Limit Reached</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            You've reached your quota of {QUOTA_LIMIT} commands for this session. Please start a new conversation or come back later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogAction
                            onClick={() => setIsQuotaAlertOpen(false)}
                            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl px-8"
                        >
                            Got it
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
