function sendMessage() {
    const userInput = document.getElementById("user-input").value;

    if (!userInput) return;

    displayMessage("User: " + userInput, "user");
    document.getElementById("user-input").value = "";  // Clear input
    showTypingIndicator();

    // Check if session_id exists in localStorage
    let sessionId = localStorage.getItem('sessionId');
    
    // If session_id doesn't exist, create a new session
    if (!sessionId) {
        fetch('/create_session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                sessionId = data.session_id;
                localStorage.setItem('sessionId', sessionId);  // Store session ID in localStorage
                sendQueryWithSession(sessionId, userInput);
            } else {
                console.error("Error creating session:", data.message);
                displayMessage("Bot: Error creating session.", "bot");
                hideTypingIndicator();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage("Bot: Error creating session.", "bot");
            hideTypingIndicator();
        });
    } else {
        sendQueryWithSession(sessionId, userInput);
    }
}

function sendQueryWithSession(sessionId, userInput) {
    const payload = JSON.stringify({ query: userInput, session_id: sessionId });

    fetch('/submit_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
    })
    .then(response => response.json())
    .then(data => {
        const answer = data.data ? data.data.answer : "Error fetching response.";
        displayMessage("Bot: " + answer, "bot");
        hideTypingIndicator();
    })
    .catch(error => {
        console.error('Error:', error);
        displayMessage("Bot: Error fetching response.", "bot");
        hideTypingIndicator();
    });
}


function uploadFile() {
    const fileInput = document.getElementById("file-input");
    if (!fileInput.files.length) {
        displayMessage("Bot: No file selected.", "bot");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    showTypingIndicator();

    fetch('/upload_file', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.predicted_class !== undefined) {
                let diagnosis;
                switch (data.predicted_class) {
                    case 0: diagnosis = "Normal"; break;
                    case 1: diagnosis = "Murmur"; break;
                    case 2: diagnosis = "Extrasystole"; break;
                    default: diagnosis = "Unknown"; break;
                }
                displayMessage("Bot: Your heartbeat is classified as " + diagnosis, "bot");
            } else {
                displayMessage("Bot: Error with file upload.", "bot");
            }
            hideTypingIndicator();
        })
        .catch(() => {
            displayMessage("Bot: Error uploading the file.", "bot");
            hideTypingIndicator();
        });
}

function displayMessage(message, sender) {
    const messagesDiv = document.getElementById("messages");
    const newMessage = document.createElement("p");
    newMessage.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    newMessage.textContent = message;
    messagesDiv.appendChild(newMessage);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator");
    typingIndicator.classList.remove("d-none");
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator");
    typingIndicator.classList.add("d-none");
}

function clearChat() {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = '';  // Clear all messages in the chat
    displayMessage("Bot: Chat has been cleared. You can start a new conversation.", "bot");

    // Clear the file input as well
    const fileInput = document.getElementById("file-input");
    fileInput.value = '';
}

// Event listener for Enter key to send messages
function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}
