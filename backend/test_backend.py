import requests
import json

def test_backend():
    base_url = "http://localhost:5002"
    
    print("Testing backend API...")
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/api/allEvents")
        print(f"✅ Server is running on {base_url}")
        print(f"✅ Response status: {response.status_code}")
        
        if response.status_code == 200:
            events = response.json()
            print(f"✅ Found {len(events)} events")
            if events:
                print(f"✅ Sample event: {events[0]['event_type']} in {events[0]['locations']}")
        else:
            print(f"❌ Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to {base_url}")
        print("Make sure the backend is running with: python app.py")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_backend() 