from typing import Optional, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, or_, desc, asc

from ..database import get_session
from ..models import Task
from ..schemas import TaskCreate, TaskUpdate, TaskResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    order: str = Query("desc")
):
    """Get all tasks for the current user with filtering and sorting."""
    query = select(Task).where(Task.user_id == user_id)
    
    # Apply status filter
    if status_filter == "completed":
        query = query.where(Task.completed == True)
    elif status_filter == "active":
        query = query.where(Task.completed == False)
        
    # Apply search filter
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            or_(
                Task.title.ilike(search_filter),
                Task.description.ilike(search_filter)
            )
        )
        
    # Apply sorting
    sort_column = getattr(Task, sort_by, Task.created_at)
    if order.lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))
        
    tasks = session.exec(query).all()
    return tasks


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """Create a new task for the current user."""
    new_task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description
    )
    
    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    
    return new_task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """Get a specific task by ID."""
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """Update a task. Can only update own tasks."""
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Update fields if provided
    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
    
    task.updated_at = datetime.now(timezone.utc)
    
    session.add(task)
    session.commit()
    session.refresh(task)
    
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    """Delete a task. Can only delete own tasks."""
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    session.delete(task)
    session.commit()
    
    return None
