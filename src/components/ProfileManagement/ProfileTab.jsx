import axios from "axios";
import { picture } from "framer-motion/client";
import { useEffect, useState } from "react";
function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false);
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const token = localStorage.getItem("accessToken");
  const [currentUser, setCurrentUser] = useState(user);
  const [artist, setArtist] = useState({
    name: '',
    picture: 'https://freesvg.org/img/abstract-user-flat-3.png',
  });

  console.log("Current User:", currentUser);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [user.id, token]);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/artist/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setArtist({
          name: response.data.name,
          picture: response.data.picture || "https://freesvg.org/img/abstract-user-flat-3.png",
        });
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };
    fetchArtistData();
  }, [user.id, token]);

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/user/${user.id}/update`,
        {
          username: currentUser.username,
          email: currentUser.email,
          password: currentUser.password,
          role: currentUser.role.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Cập nhật thành công");
        setIsEditing(false);
      } else {
        alert("Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl text-white font-semibold mb-6">
        Thông Tin Cá Nhân
      </h1>
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-white mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={currentUser.username}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, username: e.target.value })
                }
                className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-white mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
                className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                Lưu
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <img
              src={
                artist.picture ||
                "https://freesvg.org/img/abstract-user-flat-3.png"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <p className="text-white">
              <span className="font-semibold">Username:</span>{" "}
              {currentUser.username}
            </p>
            {artist.name && (
              <p className="text-white">
                <span className="font-semibold">Artist Name:</span>{" "}
                {artist.name}
              </p>
            )}
            <p className="text-white">
              <span className="font-semibold">Email:</span> {currentUser.email}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                Chỉnh Sửa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileTab;
