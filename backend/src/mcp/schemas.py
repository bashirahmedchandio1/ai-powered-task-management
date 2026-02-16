"""Tool parameter and response schemas for MCP tools."""

from typing import Optional, List
from pydantic import BaseModel, Field


class TaskInfo(BaseModel):
    """Information about a task."""
    id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: str


class ToolResponse(BaseModel):
    """Standard response format for all tools."""
    success: bool
    message: Optional[str] = None
    error: Optional[str] = None


class AddTaskResponse(ToolResponse):
    """Response from add_task tool."""
    task_id: Optional[int] = None
    title: Optional[str] = None


class ListTasksResponse(ToolResponse):
    """Response from list_tasks tool."""
    count: Optional[int] = None
    tasks: Optional[List[TaskInfo]] = None


class CompleteTaskResponse(ToolResponse):
    """Response from complete_task tool."""
    task_id: Optional[int] = None
    title: Optional[str] = None
    completed: Optional[bool] = None


class DeleteTaskResponse(ToolResponse):
    """Response from delete_task tool."""
    task_id: Optional[int] = None


class UpdateTaskResponse(ToolResponse):
    """Response from update_task tool."""
    task_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
