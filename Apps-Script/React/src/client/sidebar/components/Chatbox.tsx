import { useState, useRef, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you with your sheet?', sender: 'ai' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatboxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages update
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const message = inputValue.trim();

    if (message === '') return;

    // Add user message to chat
    setMessages((prev) => [...prev, { text: message, sender: 'user' }]);
    setInputValue('');

    try {
      const response = await serverFunctions.processMessage(message);

      if (response.error === 'Unauthorized') {
        setMessages((prev) => [
          ...prev,
          {
            text: 'Error: You are not authorized to use this feature.',
            sender: 'ai',
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          text: response.response,
          sender: 'ai',
        },
      ]);
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: 'Error: Could not get response.',
          sender: 'ai',
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div
        ref={chatboxRef}
        className="flex-1 border border-gray-300 rounded-lg p-4 mb-4 overflow-y-auto flex flex-col"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded-lg p-3 mb-2 ${
              message.sender === 'user'
                ? 'ml-auto bg-gray-200'
                : 'mr-auto bg-gray-100'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form className="flex gap-2" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          autoFocus
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
