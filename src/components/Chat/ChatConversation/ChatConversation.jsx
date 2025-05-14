import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ChatConversation() {
  const { userId, username } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [usernameCurrent, setUsernameCurrent] = useState("");
  const chatLogRef = useRef(null);
  const socketRef = useRef(null);

  const accessToken = localStorage.getItem("accessToken");

  // Lấy username từ ID
  const getUsernameFromId = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/user/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.username || "Unknown";
    } catch (error) {
      console.error("Error fetching username:", error);
      return "Unknown";
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser")) || {};
    const userIdLocal = user.id || "undefined";
    const userUsernameLocal = user.username || "Anonymous";

    setCurrentUser(userIdLocal);
    setUsernameCurrent(userUsernameLocal);
    console.log("Current user ID:", userIdLocal, "Username:", userUsernameLocal);
  }, []);

  useEffect(() => {
    if (!currentUser || !userId) return;

    // Kết nối WebSocket
    socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${currentUser}/${userId}/`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected!");
    };

    socketRef.current.onmessage = async (e) => {
      const data = JSON.parse(e.data);
      console.log("Received message data:", data);
      // Ánh xạ sender ID thành username
      const senderUsername = data.sender === currentUser ? usernameCurrent : await getUsernameFromId(data.sender);
      const updatedData = { ...data, senderUsername };
      setMessages((prev) => [...prev, updatedData]);
      scrollToBottom();
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = (event) => {
      console.log("WebSocket closed:", event);
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [userId, username, accessToken, currentUser, usernameCurrent]);

  const sendMessage = () => {
    if (messageInput.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: messageInput }));
      setMessageInput("");
    } else {
      console.log("WebSocket is not open or message is empty");
    }
  };

  const scrollToBottom = () => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  };

  return (
    <div className="bg-[#121212] min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Chat với {username || "Đang tải..."}</h1>
      <div
        ref={chatLogRef}
        className="h-96 overflow-y-auto p-4 bg-[#2a2a2a] rounded mb-4 space-y-4"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[40%] p-2 rounded-lg break-words ${
              msg.senderUsername === usernameCurrent
                ? "bg-spotify-base text-black ml-auto"
                : "bg-gray-700 text-white"
            }`}
          >
            <strong>{msg.senderUsername}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="w-full p-2 rounded bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
        />
        <button
          onClick={sendMessage}
          className="bg-spotify-base text-black px-4 py-2 rounded hover:bg-spotify-highlight"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}

export default ChatConversation;