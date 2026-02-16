from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from .database import engine
from .routes import auth, tasks, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(
    title="Todo App API",
    description="FastAPI backend for the Todo application",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://ai-powered-taskflow.vercel.app/",
        "https://todo-app-api-jade.vercel.app",
        "*"  # Allow all origins for development - restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(chat.router)


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "message": "Backend is running"}


@app.get("/")
def root():
    """Root endpoint."""
    return {"message": "Welcome to Todo App API", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
