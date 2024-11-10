from flask import Flask, request, jsonify, render_template
import requests
import os

# Initialize Flask app
app = Flask(__name__)

# Your API credentials
api_key = 'e3C544G6mWYDknXOEWYSh9U0kcA96ha5'
external_user_id = '672f3917acd02ec128301bb0'
session_id = None

# Route for the chat interface
@app.route('/')
def index():
    return render_template('index.html')

# Endpoint to create a chat session
@app.route('/create_session', methods=['POST'])
def create_chat_session():
    global session_id
    create_session_url = 'https://api.on-demand.io/chat/v1/sessions'
    headers = {'apikey': api_key}
    create_session_body = {"pluginIds": [], "externalUserId": external_user_id}
    
    response = requests.post(create_session_url, headers=headers, json=create_session_body)
    
    if response.status_code == 201:
        session_id = response.json()['data']['id']
        return jsonify({"status": "success", "session_id": session_id})
    else:
        return jsonify({"status": "error", "message": response.text}), response.status_code

# Endpoint to submit a chat query
@app.route('/submit_query', methods=['POST'])
def submit_query():
    query = request.json.get('query')
    if session_id:
        submit_query_url = f'https://api.on-demand.io/chat/v1/sessions/{session_id}/query'
        headers = {'apikey': api_key}
        
        submit_query_body = {
            "endpointId": "predefined-openai-gpt4o",
            "query": query,
            "pluginIds": [
                "plugin-1712327325", "plugin-1713962163", "plugin-1713965172",
                "plugin-1717464304", "plugin-1722285968", "plugin-1726688608"
            ],
            "responseMode": "sync"
        }
        
        response = requests.post(submit_query_url, headers=headers, json=submit_query_body)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"status": "error", "message": response.text}), response.status_code
    return jsonify({"status": "error", "message": "Session ID not found"}), 400

# Endpoint to upload a heartbeat file and get prediction
@app.route('/upload_file', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file:
        response = requests.post('http://127.0.0.1:5000/predict', files={'file': file})
        return jsonify(response.json())
    return jsonify({"status": "error", "message": "No file provided"}), 400

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5001)
