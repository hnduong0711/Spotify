import axios from "axios";
import { picture } from "framer-motion/client";
import { useEffect, useState } from "react";
import {EyeClosed, Eye} from "lucide-react";

function ChangePasswordTab() {
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const token = localStorage.getItem("accessToken");
  const [currentUser, setCurrentUser] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfitmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  console.log("Current User:", currentUser);
  console.log("New Password", newPassword);
  console.log("Confirm Password", confirmPassword);

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

  const handleUpdateProfile = async () => {
    const result = window.confirm(
        "Bạn có chắc chắn muốn thay đổi mật khẩu không?"
    );
    if (!result) {
        return;
    }
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/user/${user.id}/update`,
        {
          username: currentUser.username,
          email: currentUser.email,
          password: newPassword,
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
      } else {
        alert("Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl text-white font-semibold mb-6">
        Thông Tin Cá Nhân
      </h1>
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="password" className="block text-white mb-1">
              Mật khẩu cũ
            </label>
            <input
              type={isShowPassword ? "text" : "password"}
              id="password"
              autoComplete="off"
              placeholder="Nhập mật khẩu cũ"
              value={currentUser.password}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, password: e.target.value })
              }
              className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
            {
                isShowPassword ? (
                    <Eye size={24} className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer" onClick={() => setIsShowPassword(!isShowPassword)} />
                ) : <EyeClosed size={24} className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer" onClick={() => setIsShowPassword(!isShowPassword)} />
            }
          </div>
          <div className="relative">
            <label htmlFor="email" className="block text-white mb-1">
              Mật khẩu mới
            </label>
            <input
              type={isShowNewPassword ? "text" : "password"}
              id="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
            {
                isShowNewPassword ? (
                    <Eye size={24} className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer" onClick={() => setIsShowNewPassword(!isShowNewPassword)} />
                ) : <EyeClosed size={24} className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer" onClick={() => setIsShowNewPassword(!isShowNewPassword)} />
            }
          </div>
          <div className="relative">
            <label htmlFor="email" className="block text-white mb-1">
              Nhập lại mật khẩu mới
            </label>
            <input
              type={isShowConfirmPassword ? "text" : "password"}
              id="newpassword"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
            {
                isShowConfirmPassword ? (
                    <Eye size={24} className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer" onClick={() => setIsShowConfitmPassword(!isShowConfirmPassword)} />
                ) : <EyeClosed size={24} className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer" onClick={() => setIsShowConfitmPassword(!isShowConfirmPassword)} />
            }
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
      </div>
    </div>
  );
}

export default ChangePasswordTab;
