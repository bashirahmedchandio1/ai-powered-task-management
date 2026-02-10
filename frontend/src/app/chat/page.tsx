import ChatInterface from '@/components/chat/ChatInterface';
import { cookies } from 'next/headers';

export default async function ChatPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    return (
        <main className="relative z-10 w-full h-screen flex flex-col p-0">
            {/* Background decoration */}
            <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl opacity-50" />

            <div className="flex-1 min-h-0">
                <ChatInterface token={token} />
            </div>
        </main>
    );
}
