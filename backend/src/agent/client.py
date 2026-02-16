"""OpenAI Agent client for todo assistant."""

import os
import json
from typing import List, Dict, Any, Optional
from openai import OpenAI
from dotenv import load_dotenv

from .prompts import SYSTEM_PROMPT
from ..mcp.server import get_mcp_tools, get_tool

# Load environment variables
load_dotenv()

# Initialize OpenAI client with Google AI (Gemini) via OpenAI compatibility
# Using Google's Gemini model through the OpenAI-compatible API
client = OpenAI(
    api_key=os.getenv("GOOGLE_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)


def run_agent(
    user_id: str,
    message: str,
    conversation_history: Optional[List[Dict[str, str]]] = None,
    model: str = "gemini-2.5-flash"
) -> str:
    """
    Run the OpenAI agent with user message and conversation history.
    
    Args:
        user_id: User identifier for tool authentication
        message: User's message
        conversation_history: List of previous messages [{role, content}]
        model: Model to use (default: gemini-2.5-flash via Google AI)
    
    Returns:
        Assistant's response string
    """
    # Prepare messages
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Add conversation history
    if conversation_history:
        messages.extend(conversation_history)
    
    # Add current user message
    messages.append({"role": "user", "content": message})
    
    # Get tools
    tools = get_mcp_tools()
    
    # Run agent with tool calling
    max_iterations = 10
    iteration = 0
    
    while iteration < max_iterations:
        iteration += 1
        
        try:
            # Call OpenAI API
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                tools=tools,
                tool_choice="auto"
            )
            
            assistant_message = response.choices[0].message
            
            # Check if agent wants to call tools
            if assistant_message.tool_calls:
                # Add assistant message to history
                messages.append({
                    "role": "assistant",
                    "content": assistant_message.content or "",
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": tc.type,
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments
                            }
                        }
                        for tc in assistant_message.tool_calls
                    ]
                })
                
                # Execute each tool call
                for tool_call in assistant_message.tool_calls:
                    function_name = tool_call.function.name
                    function_args = json.loads(tool_call.function.arguments)
                    
                    # Inject user_id into function arguments (security)
                    function_args["user_id"] = user_id
                    
                    # Get and execute the tool
                    tool_function = get_tool(function_name)
                    result = tool_function(**function_args)
                    
                    # Add tool response to messages
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "name": function_name,
                        "content": json.dumps(result)
                    })
            else:
                # No more tool calls, return final response
                return assistant_message.content or "I'm not sure how to help with that."
        
        except Exception as e:
            # Log error and return friendly message
            print(f"Agent error: {str(e)}")
            return f"I apologize, but I encountered an error: {str(e)}"
    
    # Max iterations reached
    return "I apologize, but I'm having trouble completing that request. Could you try rephrasing?"

