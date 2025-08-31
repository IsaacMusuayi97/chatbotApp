import { useState } from 'react'
import './ChatInput.css'

export function ChatInput({ chatMessages, setChatMessages }) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  function saveInputText(event) {
    setInputText(event.target.value);
  }

  async function sendMessage() {
    if (!inputText.trim()) return;

    const newChatMessages = [
      ...chatMessages,
      {
        message: inputText,
        sender: 'user',
        id: crypto.randomUUID()
      }
    ];
    setChatMessages(newChatMessages);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('https://chatbotapp-1-j63y.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText })
      });

      const data = await res.json();

      setChatMessages([
        ...newChatMessages,
        {
          message: data.reply,
          sender: 'robot',
          id: crypto.randomUUID()
        }
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages([
        ...newChatMessages,
        {
          message: "⚠️ Error: Couldn't connect to server",
          sender: 'robot',
          id: crypto.randomUUID()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-input-container">
      <input 
        placeholder="Send a message to Chatbot" 
        size="30" 
        onChange={saveInputText}
        value={inputText}
        className="chat-input"
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        disabled={loading}
      />
      <button
        onClick={sendMessage}
        className="send-button"
        disabled={loading}
      >
        {loading ? <span className="spinner"></span> : "Send"}
      </button>
    </div>
  );
}
