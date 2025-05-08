import React, { useState, useEffect } from "react";
import axios from "axios";

// Modal thêm/sửa nghệ sĩ
const ArtistModal = ({ isOpen, onClose, onSubmit, artist, isEdit }) => {
  const [formData, setFormData] = useState({
    username: artist?.username || "",
    name: artist?.name || "",
    email: artist?.email || "",
    picture: artist?.picture || "",
    password: "",
    role: 2, // Mặc định role là 2
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // Load thông tin user khi sửa
  useEffect(() => {
    if (isEdit && artist?.user) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:8000/api/user/${artist.user}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              },
              timeout: 10000,
            }
          );
          const userData = response.data;
          setFormData({
            username: userData.username,
            name: artist.name,
            email: userData.email,
            picture: artist.picture,
            password: userData.password || "",
            role: userData.role.id || 2,
          });
        } catch (err) {
          console.error("Lỗi tải thông tin user:", err.response?.data);
          setError(
            err.response?.data?.message || "Không thể tải thông tin user"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [isEdit, artist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra URL ảnh
    if (formData.picture && !formData.picture.match(/^https?:\/\//)) {
      setError("URL ảnh phải bắt đầu bằng http hoặc https");
      return;
    }

    // Kiểm tra email
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Email không hợp lệ");
      return;
    }

    // Kiểm tra mật khẩu khi thêm
    if (!isEdit && !formData.password) {
      setError("Mật khẩu là bắt buộc khi thêm nghệ sĩ");
      return;
    }

    // Chuẩn bị dữ liệu gửi
    const submitData = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      picture: formData.picture,
      role: formData.role,
    };
    if (!isEdit || (isEdit && formData.password)) {
      submitData.password = formData.password; // Gửi password nếu thêm hoặc sửa có nhập
    }
    if (isEdit) {
      submitData.user = artist.user; // Gửi user ID khi sửa
    }

    onSubmit(submitData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl mb-4">
          {isEdit ? "Sửa Nghệ Sĩ" : "Thêm Nghệ Sĩ"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p className="text-gray-500 mb-4">Đang tải...</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Tên Người Dùng
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Tên Nghệ Sĩ
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Ảnh (URL)</label>
            <input
              type="text"
              name="picture"
              value={formData.picture}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="https://example.com/image.png"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {isEdit ? "Mật Khẩu Mới (Để trống nếu không đổi)" : "Mật Khẩu"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required={!isEdit}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtistModal;
