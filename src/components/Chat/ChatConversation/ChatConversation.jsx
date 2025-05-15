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

  // Load lịch sử chat
  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chat/${currentUser}/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const history = response.data.map(msg => ({
        ...msg,
        sender: String(msg.sender), // Ép kiểu sender thành chuỗi
        senderUsername: String(msg.sender) === currentUser ? usernameCurrent : username,
      }));
      setMessages(history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser")) || {};
    const userIdLocal = user.id || "undefined";
    const userUsernameLocal = user.username || "Anonymous";

    setCurrentUser(String(userIdLocal)); // Ép kiểu currentUser thành chuỗi
    setUsernameCurrent(userUsernameLocal);
    console.log("Current user ID:", userIdLocal, "Username:", userUsernameLocal);
  }, []);

  useEffect(() => {
    if (!currentUser || !userId) return;

    // Chỉ load lịch sử chat một lần khi component mount
    loadChatHistory();

    // Kết nối WebSocket
    socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${currentUser}/${userId}/`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected!");
    };

    socketRef.current.onmessage = async (e) => {
      const data = JSON.parse(e.data);
      console.log("Received message data:", data);
      // Kiểm tra trùng lặp chặt chẽ hơn
      const isDuplicate = messages.some(
        msg => msg.message === data.message && msg.sender === String(data.sender) && msg.timestamp === data.timestamp
      );
      if (!isDuplicate) {
        const senderUsername = String(data.sender) === currentUser ? usernameCurrent : await getUsernameFromId(data.sender);
        const updatedData = {
          ...data,
          sender: String(data.sender), // Ép kiểu sender thành chuỗi
          senderUsername,
          timestamp: data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, updatedData]);
      }
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

  // Tự động scroll xuống dưới cùng khi messages thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (messageInput.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      // Gửi qua WebSocket
      const messageData = {
        message: messageInput,
        sender: currentUser,
      };
      socketRef.current.send(JSON.stringify(messageData));

      // Gọi API để lưu tin nhắn vào backend
      try {
        await axios.post(
          `http://localhost:8000/api/chat`,
          {
            sender: currentUser,
            receiver: userId,
            message: messageInput,
            timestamp: new Date().toISOString(),
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      } catch (error) {
        console.error("Error saving message to backend:", error);
      }

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

  // Format thời gian thành hh:mm
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
              msg.sender === currentUser
                ? "bg-spotify-base text-black ml-auto"
                : "bg-gray-700 text-white"
            }`}
          >
            <strong>{msg.senderUsername}:</strong> {msg.message} <span className="text-xs text-gray-400">({formatTime(msg.timestamp)})</span>
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