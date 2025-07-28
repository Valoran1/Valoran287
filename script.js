const chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// Enter = submit, Shift+Enter = nova vrstica
chatForm.addEventListener('submit', handleSubmit);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
  }
});

async function handleSubmit(e) {
  e.preventDefault();
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage('user', input);
  userInput.value = '';
  const botMessage = await fetchResponse(input);
  await typeMessage('bot', botMessage);
}

function appendMessage(role, content) {
  const messageEl = document.createElement('div');
  messageEl.classList.add('chat-message', role);
  messageEl.textContent = content;
  chatLog.appendChild(messageEl);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function typeMessage(role, message) {
  const messageEl = document.createElement('div');
  messageEl.classList.add('chat-message', role);
  chatLog.appendChild(messageEl);
  for (let i = 0; i < message.length; i++) {
    messageEl.textContent += message[i];
    chatLog.scrollTop = chatLog.scrollHeight;
    await new Promise((r) => setTimeout(r, 15));
  }
}

async function fetchResponse(userMessage) {
  try {




