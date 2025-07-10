from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from rag_backend import RAGBackend
import json
from datetime import datetime
import threading
import time

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])

# Initialize RAG backend
rag_backend = None
global_events = []
events_lock = threading.Lock()

def init_rag_backend():
    global rag_backend
    try:
        rag_backend = RAGBackend()
        print("RAG backend initialized successfully")
    except Exception as e:
        print(f"Error initializing RAG backend: {e}")

# Initialize on startup
init_rag_backend()

@app.route('/api/submitTweet', methods=['POST'])
def submit_tweet():
    try:
        data = request.get_json()
        tweet = data.get('tweet', '')
        
        if not tweet:
            return jsonify({'error': 'No tweet provided'}), 400
        
        # Process tweet with RAG backend
        if rag_backend:
            event_data = rag_backend.process_tweet(tweet)
            
            if event_data:
                # Add timestamp
                event_data['timestamp'] = datetime.now().isoformat()
                
                # Add to global events
                with events_lock:
                    global_events.append(event_data)
                
                return jsonify({
                    'success': True,
                    'event': event_data,
                    'message': 'Event extracted successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Could not extract event information from tweet'
                }), 400
        else:
            return jsonify({'error': 'RAG backend not initialized'}), 500
            
    except Exception as e:
        print(f"Error processing tweet: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/allEvents', methods=['GET'])
def get_all_events():
    try:
        with events_lock:
            return jsonify(global_events)
    except Exception as e:
        print(f"Error getting events: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        # Get query parameters
        category = request.args.get('category')
        location = request.args.get('location')
        event_type = request.args.get('event_type')
        
        with events_lock:
            filtered_events = global_events.copy()
            
            # Apply filters
            if category:
                filtered_events = [e for e in filtered_events if e.get('category') == category]
            if location:
                filtered_events = [e for e in filtered_events if location.lower() in e.get('locations', '').lower()]
            if event_type:
                filtered_events = [e for e in filtered_events if e.get('event_type') == event_type]
            
            return jsonify(filtered_events)
    except Exception as e:
        print(f"Error filtering events: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        with events_lock:
            categories = list(set([e.get('category') for e in global_events if e.get('category')]))
            return jsonify(categories)
    except Exception as e:
        print(f"Error getting categories: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/locations', methods=['GET'])
def get_locations():
    try:
        with events_lock:
            all_locations = []
            for event in global_events:
                if event.get('locations'):
                    locations = [loc.strip() for loc in event['locations'].split(',')]
                    all_locations.extend(locations)
            unique_locations = list(set(all_locations))
            return jsonify(unique_locations)
    except Exception as e:
        print(f"Error getting locations: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/eventTypes', methods=['GET'])
def get_event_types():
    try:
        with events_lock:
            event_types = list(set([e.get('event_type') for e in global_events if e.get('event_type')]))
            return jsonify(event_types)
    except Exception as e:
        print(f"Error getting event types: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        with events_lock:
            total_events = len(global_events)
            categories = len(set([e.get('category') for e in global_events if e.get('category')]))
            locations = set()
            for event in global_events:
                if event.get('locations'):
                    locations.update([loc.strip() for loc in event['locations'].split(',')])
            
            return jsonify({
                'total_events': total_events,
                'categories': categories,
                'locations': len(locations),
                'last_updated': datetime.now().isoformat()
            })
    except Exception as e:
        print(f"Error getting stats: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
