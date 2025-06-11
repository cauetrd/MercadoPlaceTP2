from fastapi.testclient import TestClient

def test_create_user(client: TestClient):
    user = {
        "username": "testuser1",
        "email": "testuser1@example.com",
        "password": "testpassword"
    }
    response = client.post("/users/", json=user)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == user["username"]
    assert data["email"] == user["email"]
    assert "id" in data
    assert "createdAt" in data
    assert "updatedAt" in data

def test_update_user(client: TestClient):
    # First create a user to update
    user = {
        "username": "testuser2", 
        "email": "testuser2@example.com",
        "password": "testpassword"
    }
    response = client.post("/users/", json=user)  # Changed from PUT to POST
    assert response.status_code == 200
    created_user = response.json()
    user_id = created_user["id"]
    
    # Now update the user
    updated_user = {
        "username": "updateduser2",
        "email": "updateduser2@example.com"
    }
    response = client.put(f"/users/{user_id}", json=updated_user)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == updated_user["username"]
    assert data["email"] == updated_user["email"]