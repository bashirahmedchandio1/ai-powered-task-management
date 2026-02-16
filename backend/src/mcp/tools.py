"""MCP tool implementations for task management."""

from typing import Optional, Dict, Any
from sqlmodel import Session, select
from datetime import datetime, timezone

from ..database import engine
from ..models import Task


def add_task(user_id: str, title: str, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Create a new task for the user.
    
    Args:
        user_id: User identifier from JWT token
        title: Task title (required, max 200 chars)
        description: Task description (optional, max 1000 chars)
    
    Returns:
        Dictionary with success status, task_id, title, and message
    """
    # Validate inputs
    if not title or not title.strip():
        return {
            "success": False,
            "error": "Task title cannot be empty"
        }
    
    if len(title) > 200:
        return {
            "success": False,
            "error": "Task title must be 200 characters or less"
        }
    
    if description and len(description) > 1000:
        return {
            "success": False,
            "error": "Task description must be 1000 characters or less"
        }
    
    try:
        with Session(engine) as session:
            # Create new task
            new_task = Task(
                user_id=user_id,
                title=title.strip(),
                description=description.strip() if description else None
            )
            
            session.add(new_task)
            session.commit()
            session.refresh(new_task)
            
            return {
                "success": True,
                "task_id": new_task.id,
                "title": new_task.title,
                "message": f"Task '{new_task.title}' created successfully"
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to create task: {str(e)}"
        }


def list_tasks(user_id: str, status: str = "all") -> Dict[str, Any]:
    """
    Retrieve user's tasks with optional filtering.
    
    Args:
        user_id: User identifier from JWT token
        status: Filter by status ("all", "pending", "completed")
    
    Returns:
        Dictionary with success status, count, and list of tasks
    """
    try:
        with Session(engine) as session:
            # Build query filtered by user_id
            query = select(Task).where(Task.user_id == user_id)
            
            # Apply status filter
            if status == "completed":
                query = query.where(Task.completed == True)
            elif status == "pending":
                query = query.where(Task.completed == False)
            # "all" - no additional filter
            
            # Order by created_at desc
            query = query.order_by(Task.created_at.desc())
            
            tasks = session.exec(query).all()
            
            # Format tasks
            task_list = [
                {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "created_at": task.created_at.isoformat()
                }
                for task in tasks
            ]
            
            return {
                "success": True,
                "count": len(task_list),
                "tasks": task_list
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to retrieve tasks: {str(e)}"
        }


def complete_task(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Mark a task as completed.
    
    Args:
        user_id: User identifier from JWT token
        task_id: ID of task to complete
    
    Returns:
        Dictionary with success status, task_id, completed status, and message
    """
    try:
        with Session(engine) as session:
            # Find task by id AND user_id (security)
            task = session.exec(
                select(Task).where(Task.id == task_id, Task.user_id == user_id)
            ).first()
            
            if not task:
                return {
                    "success": False,
                    "error": f"Task {task_id} not found"
                }
            
            # Mark as completed (idempotent)
            task.completed = True
            task.updated_at = datetime.now(timezone.utc)
            
            session.add(task)
            session.commit()
            session.refresh(task)
            
            return {
                "success": True,
                "task_id": task.id,
                "title": task.title,
                "completed": task.completed,
                "message": f"Task '{task.title}' marked as completed"
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to complete task: {str(e)}"
        }


def delete_task(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Delete a task permanently.
    
    Args:
        user_id: User identifier from JWT token
        task_id: ID of task to delete
    
    Returns:
        Dictionary with success status, task_id, and message
    """
    try:
        with Session(engine) as session:
            # Find task by id AND user_id (security)
            task = session.exec(
                select(Task).where(Task.id == task_id, Task.user_id == user_id)
            ).first()
            
            if not task:
                return {
                    "success": False,
                    "error": f"Task {task_id} not found"
                }
            
            task_title = task.title
            
            # Delete task
            session.delete(task)
            session.commit()
            
            return {
                "success": True,
                "task_id": task_id,
                "message": f"Task '{task_title}' deleted successfully"
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to delete task: {str(e)}"
        }


def update_task(
    user_id: str, 
    task_id: int, 
    title: Optional[str] = None, 
    description: Optional[str] = None
) -> Dict[str, Any]:
    """
    Update task title and/or description.
    
    Args:
        user_id: User identifier from JWT token
        task_id: ID of task to update
        title: New task title (optional)
        description: New task description (optional)
    
    Returns:
        Dictionary with success status, updated task info, and message
    """
    # Validate at least one field provided
    if title is None and description is None:
        return {
            "success": False,
            "error": "No fields provided to update"
        }
    
    # Validate title if provided
    if title is not None:
        if not title.strip():
            return {
                "success": False,
                "error": "Task title cannot be empty"
            }
        if len(title) > 200:
            return {
                "success": False,
                "error": "Task title must be 200 characters or less"
            }
    
    # Validate description if provided
    if description is not None and len(description) > 1000:
        return {
            "success": False,
            "error": "Task description must be 1000 characters or less"
        }
    
    try:
        with Session(engine) as session:
            # Find task by id AND user_id (security)
            task = session.exec(
                select(Task).where(Task.id == task_id, Task.user_id == user_id)
            ).first()
            
            if not task:
                return {
                    "success": False,
                    "error": f"Task {task_id} not found"
                }
            
            # Update fields
            if title is not None:
                task.title = title.strip()
            if description is not None:
                task.description = description.strip() if description.strip() else None
            
            task.updated_at = datetime.now(timezone.utc)
            
            session.add(task)
            session.commit()
            session.refresh(task)
            
            return {
                "success": True,
                "task_id": task.id,
                "title": task.title,
                "description": task.description,
                "message": f"Task '{task.title}' updated successfully"
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to update task: {str(e)}"
        }
