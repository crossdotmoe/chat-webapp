// HTML elements
const chatWindow = document.getElementById('chat-window');
const usernameInput = document.getElementById('username-input');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Store the user's username
let username = '';

// WebRTC related variables
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const peerConnection = new RTCPeerConnection(configuration);
const dataChannel = peerConnection.createDataChannel('chat');

dataChannel.onopen = () => {
    // Data channel is open; you can start sending and receiving messages
};

dataChannel.onmessage = (event) => {
    // Handle incoming chat messages
    const message = event.data;
    appendMessage(username, message);
};

// WebSocket for signaling
const signalingSocket = new WebSocket('wss://your-signaling-server-url.com');

signalingSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'offer') {
        handleOffer(data);
    } else if (data.type === 'answer') {
        handleAnswer(data);
    } else if (data.type === 'candidate') {
        handleCandidate(data);
    }
};

// Handle sending chat messages
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message && username) {
        dataChannel.send(message);
        appendMessage('You', message);
        messageInput.value = '';
    }
});

// Function to append a message to the chat window
function appendMessage(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = `${sender}: ${message}`;
    chatWindow.appendChild(messageElement);
}

// Set the user's username
usernameInput.addEventListener('input', (event) => {
    username = event.target.value;
});

// Function to send an offer to another user
function sendOffer(targetUsername) {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    signalingSocket.send(JSON.stringify({
        type: 'offer',
        target: targetUsername,
        offer: offer,
    }));
}

// Function to handle an incoming offer from another user
function handleOffer(offerData) {
    // Handle the offer and set the remote description
}

// Function to send an answer to another user
function sendAnswer(targetUsername) {
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    signalingSocket.send(JSON.stringify({
        type: 'answer',
        target: targetUsername,
        answer: answer,
    }));
}

// Function to handle an incoming answer from another user
function handleAnswer(answerData) {
    // Handle the answer and set the remote description
}

// Function to send ICE candidates to another user
function sendICECandidate(targetUsername, candidate) {
    signalingSocket.send(JSON.stringify({
        type: 'candidate',
        target: targetUsername,
        candidate: candidate,
    }));
}

// Function to handle an incoming ICE candidate from another user
function handleCandidate(candidateData) {
    // Handle the ICE candidate
}

// Connect to your signaling server
signalingSocket.addEventListener('open', () => {
    // Implement the logic to join the chat and negotiate connections here
});
