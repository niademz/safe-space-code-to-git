const urlParams = new URLSearchParams(window.location.search);
const chatroom = urlParams.get('chatroom');

const usernameInput = prompt("Please enter your username:");
const usernameElement = document.getElementById("username");
usernameElement.textContent = `Username: ${usernameInput}`;

const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

// Initialize the WebSocket connection
const socket = io({ query: { chatroom: chatroom } });

// Load chat history from the server when the page loads
loadChatHistory();

sendButton.addEventListener("click", () => {
  const messageText = messageInput.value.trim();
  if (messageText !== "") {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");

    const message = document.createElement("div");
    message.classList.add("message", "user-message");
    message.textContent = `${usernameInput}: ${messageText}`;

    messageContainer.appendChild(message);
    chatMessages.appendChild(messageContainer);

    // Emit a 'chat message' event to the server with the message data
    socket.emit('chat message', { username: usernameInput, message: messageText, chatroom: chatroom });

    messageInput.value = "";
  }
});

// Handle receiving messages from the server
socket.on('chat message', (data) => {
  const messageContainer = createMessageElement(data.username, data.message, "other-message");
  chatMessages.appendChild(messageContainer);
});

function loadChatHistory() {
  // Send a request to the server to load chat history
  socket.emit('load chat history');
}

socket.on('chat history data', (data) => {
  // Populate chat history on the client-side based on the data received from the server
  data.forEach((messageData) => {
    const { username, message_text } = messageData;
    const messageContainer = createMessageElement(username, message_text, "other-message", chatroom);
    chatMessages.appendChild(messageContainer);
  });
});

function createMessageElement(username, messageText, messageClass) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");

  const message = document.createElement("div");
  message.classList.add("message", messageClass);
  message.textContent = `${username}: ${messageText}`;

  messageContainer.appendChild(message);

  return messageContainer;
}
