const chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage('user', input);
  userInput.value = '';
  const botMessage = await fetchResponse(input);
  await typeMessage('bot', botMessage);
});

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
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await response.json();
    return data.reply || "Nimam odgovora.";
  } catch (err) {
    return "Napaka pri povezavi z Valoranom.";
  }
}


