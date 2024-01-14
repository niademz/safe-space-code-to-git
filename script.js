const urlParams = new URLSearchParams(window.location.search);
const chatroom = urlParams.get('chatroom');

// Initialize the socket with the chatroom name as a query parameter
const socket = io({ query: { chatroom: chatroom } });
// JavaScript code to prompt for the username and update the UI
const usernameInput = prompt("Please enter your username:");
const usernameElement = document.getElementById("username");
usernameElement.textContent = `Username: ${usernameInput}`;



// JavaScript code to handle sending messages
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

// Load chat history from the server when the page loads
loadChatHistory();

sendButton.addEventListener("click", () => {
  const messageText = messageInput.value;
  if (messageText.trim() !== "") {
    // Create a new message container
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");

    // Create a new message element
    const message = document.createElement("div");
    message.classList.add("message", "user-message");
    message.textContent = `${usernameInput}: ${messageText}`; // Include the username here

   
    // Append the username and message to the container
    messageContainer.appendChild(message);

    // Append the message container to the chat messages
    chatMessages.appendChild(messageContainer);

    // Send the message to the server along with the chatroom name
    socket.emit('chat message', { username: usernameInput, message: messageText, chatroom: chatroom });

    // Clear the input field
    messageInput.value = "";
  }
});

// Handle receiving messages from the server
socket.on('chat message', (data) => {
  // Use the createMessageElement function to create a message container
  const messageContainer = createMessageElement(data.username, data.message, "other-message");

  // Append the message container to the chat messages
  chatMessages.appendChild(messageContainer);
});

// Function to load chat history from the server
function loadChatHistory() {
  // Send a request to the server to load chat history
  socket.emit('load chat history');
}

// Listen for chat history data from the server
socket.on('chat history data', (data) => {
  // Populate chat history on the client-side based on the data received from the server
  data.forEach((messageData) => {
    const { username, message_text } = messageData;
    const messageContainer = createMessageElement(username, message_text, "other-message", chatroom);
    chatMessages.appendChild(messageContainer);
  });
});

// Helper function to create a message element
function createMessageElement(username, messageText, messageClass) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");

  const message = document.createElement("div");
  message.classList.add("message", messageClass);
  message.textContent = `${username}: ${messageText}`;

  messageContainer.appendChild(message);

  return messageContainer;
}
console.log('Chatroom:', chatroom);