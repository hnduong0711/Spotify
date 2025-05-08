import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Component trang đăng nhập admin
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    const adminLogin = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/login",
          {
            username,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const admin = response.data.user;
        if (admin.role !== "ADMIN") {
          setError("Bạn không có quyền truy cập vào trang này!");
          return;
        }
        
        localStorage.setItem("adminToken", response.data.access);
        localStorage.setItem("currentAdmin", JSON.stringify(admin));
        navigate("/admin");
      } catch (error) {
        setError(error.message);
      }
    };
    if (username && password) {
      adminLogin();
      e.preventDefault();
    } else {
      setError("Vui lòng nhập email và mật khẩu!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng Nhập Admin</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text text-sm font-medium mb-1">
              Mật Khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
