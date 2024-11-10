# heart-app
# Heart App (Chatbot)

This is a Flask-based chatbot application designed to provide heart-related information. The app can be run alongside the `ml-api` application.

## Setup Instructions

1. Install the required dependencies:

   ```
   pip install -r requirements.txt
   ```

2. Run the Heart App server:

   ```
   python app.py
   ```

The server will start running and be accessible locally at `http://127.0.0.1:5001/`.

## Running with ml-api

To run both the Heart App and the ml-api server together, simply start them on different ports:

1. Run `ml-api` on port `5000`:

   ```
   python app.py
   ```

2. Run Heart App on port `5001`:

   ```
   python app.py
   ```

The Heart App will be accessible at `http://127.0.0.1:5001/`.

## Dependencies

The `requirements.txt` file includes all the necessary libraries for the project.
