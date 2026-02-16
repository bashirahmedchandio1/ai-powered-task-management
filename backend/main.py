"""
Vercel entry point for FastAPI application.
This file is required by Vercel to properly deploy the FastAPI app as a serverless function.
"""
from src.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
