import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Chat() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [accessToken]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (userId, username) => {
    navigate(`/Chat/ChatConversation/${userId}/${username}`);
  };

  return (
    <div className="bg-[#121212] min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Danh sách người dùng</h1>
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm theo username..."
          className="w-full p-2 rounded bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
        />
      </div>
      <ul className="space-y-2">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="flex items-center space-x-4 p-2 hover:bg-white/10 rounded cursor-pointer"
            onClick={() => handleUserClick(user.id, user.username)}
          >
            <img
              src="https://freesvg.org/img/abstract-user-flat-3.png"
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Chat;