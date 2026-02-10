/**
 * API client for chat endpoints
 */

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatRequest {
    message: string;
    conversation_id?: string;
}

export interface ChatResponse {
    response: string;
    conversation_id: string;
}

export interface Conversation {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

/**
 * Send a chat message to the backend
 */
export async function sendChatMessage(
    message: string,
    conversationId?: string,
    token?: string
): Promise<ChatResponse> {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
            message,
            conversation_id: conversationId,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send message');
    }

    return response.json();
}

/**
 * Get all conversations for the current user
 */
export async function getConversations(token?: string): Promise<Conversation[]> {
    const response = await fetch('/api/chat/conversations', {
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error('Failed to load conversations');
    }

    return response.json();
}

/**
 * Get messages for a specific conversation
 */
export async function getConversationMessages(
    conversationId: string,
    token?: string
): Promise<ChatMessage[]> {
    const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error('Failed to load messages');
    }

    return response.json();
}

/**
 * Delete a specific conversation
 */
export async function deleteConversation(
    conversationId: string,
    token?: string
): Promise<void> {
    const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete conversation');
    }
}
