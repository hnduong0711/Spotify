import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Modal thêm/sửa album
const AlbumModal = ({ isOpen, onClose, onSubmit, album, isEdit }) => {
  const [formData, setFormData] = useState({
    name: album?.name || '',
    artist: album?.artist?.id || '',
    image_url: album?.image_url || '',
  });
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load danh sách nghệ sĩ
  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/artist', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          timeout: 10000,
        });
        setArtists(response.data);
      } catch (err) {
        console.error('Lỗi tải danh sách nghệ sĩ:', err.response?.data);
        setError(err.response?.data?.message || 'Không thể tải danh sách nghệ sĩ');
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra tên album
    if (!formData.name) {
      setError('Tên album là bắt buộc');
      return;
    }

    // Kiểm tra nghệ sĩ
    if (!formData.artist) {
      setError('Vui lòng chọn nghệ sĩ');
      return;
    }

    // Kiểm tra URL ảnh
    if (formData.image_url && !formData.image_url.match(/^https?:\/\//)) {
      setError('URL ảnh phải bắt đầu bằng http hoặc https');
      return;
    }

    // Chuẩn bị dữ liệu gửi
    const submitData = {
      name: formData.name,
      artist: formData.artist,
      image_url:
        formData.image_url ||
        'https://i.pinimg.com/736x/ec/e4/b5/ece4b597f82c0970b9a92ac5d9207701.jpg',
    };

    onSubmit(submitData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl mb-4">
          {isEdit ? 'Sửa Album' : 'Thêm Album'}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p className="text-gray-500 mb-4">Đang tải...</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tên Album</label>
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
            <label className="block text-sm font-medium mb-1">Nghệ Sĩ</label>
            <select
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Chọn nghệ sĩ</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Ảnh (URL)</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="https://example.com/image.png"
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

export default AlbumModal;