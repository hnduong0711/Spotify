import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Component chat với DeepSeek
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (!input.trim()) {
      setError('Vui lòng nhập tin nhắn');
      return;
    }

    // Thêm tin nhắn người dùng vào lịch sử
    const userMessage = {
      role: 'user',
      content: input,
    };
    setMessages([...messages, userMessage]);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/deepseek/chat',
        {
          message: input,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          timeout: 10000,
        }
      );

      const deepSeekMessage = {
        role: 'assistant',
        content: response.data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, deepSeekMessage]);
    } catch (err) {
      console.error('Lỗi gửi tin nhắn:', err.response?.data);
      setError(err.response?.data?.message || 'Không thể gửi tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full text-black bg-white p-6 rounded-lg shadow">
      <h2 className="text-4xl mb-4 text-spotify-base text-center font-semibold">
        Chat Với DeepSeek
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Đang gửi...</p>}
      <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-lg bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } mb-4`}
          >
            <div
              className={`flex items-start ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              } max-w-3/4`}
            >
              <img
                src={
                  message.role === 'user'
                    ? 'https://static.thenounproject.com/png/3324336-200.png'
                    : 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/deepseek.png'
                }
                alt={message.role}
                className="w-10 h-10 rounded-full mr-2"
              />
              <div
                className={`p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border rounded px-3 py-2 resize-none"
          rows="3"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default Chat;