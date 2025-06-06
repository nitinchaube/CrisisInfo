from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from helper import *

app = Flask(__name__)
CORS(app)  

# Load events from file
def load_events():
    with open('./events.json') as f:
        return json.load(f)


@app.route('/api/allEvents')
def get_events():
    events = load_events()
    return jsonify(events)


@app.route('/api/getEventTypes')
def get_event_types():
    unique_event_types = list({event["event_type"] for event in events})
    return jsonify(unique_event_types) if unique_event_types else (jsonify({"error": "No event types found"}), 400)


@app.route('/api/getEventLocations')
def get_event_locations():
    all_locations = set()
    for event in events:
        raw_locations = event.get("locations", '')
        if raw_locations:
            for loc in raw_locations.split(","):
                all_locations.add(loc.strip())
    unique_locations = sorted(all_locations)
    return jsonify(unique_locations) if unique_locations else (jsonify({"error": "No locations found"}), 400)


@app.route('/api/getEventCategories')
def get_event_categories():
    unique_event_categories = list({event["category"] for event in events})
    return jsonify(unique_event_categories) if unique_event_categories else (jsonify({"error": "No categories found"}), 400)


@app.route('/api/getFilteredEvents', methods=['GET'])
def get_filtered_events():
    selected_types = request.args.getlist('event_types')
    selected_locations = request.args.getlist('locations')
    selected_categories = request.args.getlist('categories')

    print("Filters received:")
    print("  Event Types:", selected_types)
    print("  Locations:", selected_locations)
    print("  Categories:", selected_categories)

    filtered = events

    # Step 1: Filter by type
    if selected_types:
        filtered = [event for event in filtered if event["event_type"] in selected_types]

    # Step 2: Filter by locations
    if selected_locations:
        tmp = []
        for event in filtered:
            event_locs = [loc.strip() for loc in event.get('locations', '').split(',')]
            if any(loc in selected_locations for loc in event_locs):
                tmp.append(event)
        filtered = tmp

    # Step 3: Filter by categories
    if selected_categories:
        filtered = [event for event in filtered if event['category'] in selected_categories]

    return jsonify(filtered) if filtered else (jsonify({"error": "No matching events found"}), 400)

@app.route("/api/submitTweet", methods=['POST'])
def submit_tweet():
    data = request.get_json()
    tweet_text = data.get('tweet')

    if not tweet_text:
        return jsonify({"error": "Tweet is required"}), 400
    
    result = DisasterExtraction(tweet= tweet_text)
    return jsonify({"message": result})



@app.route('/api/events/<string:event_id>')
def get_event(event_id):
    event = next((e for e in events if e['id'] == event_id), None)
    return jsonify(event) if event else (jsonify({"error": "Event not found"}), 404)


@app.route('/api/graph')
def get_graph():
    
    graph_data = {
        "nodes": [],
        "edges": []
    }
    return jsonify(graph_data)

if __name__=="__main__":
    app.run(debug=True)
