import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Component trang đăng nhập admin
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Giả lập kiểm tra đăng nhập
    if (email === 'a' && password === 'a') {
      localStorage.setItem('user', JSON.stringify({ email }));
      navigate('/admin');
    } else {
      setError('Email hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng Nhập Admin</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Mật Khẩu</label>
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