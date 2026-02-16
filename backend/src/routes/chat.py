"""Chat API endpoint for conversational task management."""

from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_session
from ..models import Conversation, Message
from ..schemas import ChatRequest, ChatResponse
from ..auth import get_current_user
from ..agent.client import run_agent

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """
    Chat endpoint for conversational task management.
    
    Flow:
    1. Get or create conversation
    2. Fetch conversation history from database
    3. Store user message
    4. Run OpenAI agent with history and tools
    5. Store assistant response
    6. Return response and conversation_id
    """
    try:
        # Step 1: Get or create conversation
        if request.conversation_id:
            # Verify conversation belongs to user (security)
            conversation = session.exec(
                select(Conversation).where(
                    Conversation.id == request.conversation_id,
                    Conversation.user_id == user_id
                )
            ).first()
            
            if not conversation:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversation not found"
                )
        else:
            # Create new conversation
            conversation = Conversation(user_id=user_id)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)
        
        # Step 2: Fetch conversation history (last 50 messages for context)
        messages = session.exec(
            select(Message)
            .where(Message.conversation_id == conversation.id)
            .order_by(Message.created_at.desc())
            .limit(50)
        ).all()
        
        # Reverse to chronological order
        messages = list(reversed(messages))
        
        # Format history for agent
        conversation_history = [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]
        
        # Step 3: Store user message
        user_message = Message(
            conversation_id=conversation.id,
            role="user",
            content=request.message
        )
        session.add(user_message)
        session.commit()
        
        # Step 4: Run agent
        agent_response = run_agent(
            user_id=user_id,
            message=request.message,
            conversation_history=conversation_history
        )
        
        # Step 5: Store assistant response
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=agent_response
        )
        session.add(assistant_message)
        
        # Update conversation timestamp
        conversation.updated_at = datetime.now(timezone.utc)
        
        # Auto-generate title from first message if not set
        if not conversation.title and request.message:
            # Use first 50 chars of first user message as title
            conversation.title = request.message[:50] + ("..." if len(request.message) > 50 else "")
        
        session.add(conversation)
        session.commit()
        
        # Step 6: Return response
        return ChatResponse(
            response=agent_response,
            conversation_id=conversation.id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat error: {str(e)}"
        )


@router.get("/conversations", response_model=list)
async def list_conversations(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """Get all conversations for the current user."""
    conversations = session.exec(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
    ).all()
    
    return [
        {
            "id": conv.id,
            "title": conv.title or "New Conversation",
            "created_at": conv.created_at.isoformat(),
            "updated_at": conv.updated_at.isoformat()
        }
        for conv in conversations
    ]


@router.get("/conversations/{conversation_id}/messages", response_model=list)
async def get_conversation_messages(
    conversation_id: str,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """Get all messages for a conversation."""
    # Verify conversation belongs to user
    conversation = session.exec(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
    ).first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    ).all()
    
    return [
        {
            "id": msg.id,
            "role": msg.role,
            "content": msg.content,
            "created_at": msg.created_at.isoformat()
        }
        for msg in messages
    ]


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: str,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """Delete a conversation and all its messages."""
    conversation = session.exec(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
    ).first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    session.delete(conversation)
    session.commit()
    return None
