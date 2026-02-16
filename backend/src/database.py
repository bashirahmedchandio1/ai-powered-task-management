import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session

# Load environment variables from the parent directory's .env file
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Neon connection string usually needs some adjustments for SQLAlchemy if using pooling,
# but for basic direct connection it works as is.
# We ensure it's postgresql:// not postgres://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session
