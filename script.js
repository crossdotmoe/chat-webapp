const socket = io('https://chat-webapp.crossdotmoe.workers.dev/'); // Replace with the actual URL of your Cloudflare Worker.

socket.on('connect', () => {
  console.log('Connected to the server.');

  // Handle chat messages and other WebSocket events here.
  socket.on('chat', (data) => {
    appendMessage(data.sender, data.message);
  });

  // Handle other events here.
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server.');
});

// Get references to the HTML elements by their IDs
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const chatWindow = document.getElementById('chat'); // Define chatWindow

// Handle sending chat messages
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message && username) {
    socket.emit('chat', { sender: username, message });
    appendMessage(username , message);
    messageInput.value = '';
  }
});

// Set the user's username
usernameInput.addEventListener('input', (event) => {
  username = event.target.value;
});

// Function to append a message to the chat window
function appendMessage(sender, message) {
  const messageElement = document.createElement('p');
  messageElement.textContent = `${sender}: ${message}`;
  chatWindow.appendChild(messageElement);
}
