import os
import pytest
from app.main import app
from fastapi.testclient import TestClient

# Before running tests, run 'prisma db push --force-reset'

@pytest.fixture
def client():
    """Create a test client."""
    os.system("prisma db push --force-reset")
    print("Database cleared and reset.")
    return TestClient(app)