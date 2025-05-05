import React, { useState } from 'react';

// Modal thêm/sửa bài hát
const SongModal = ({ isOpen, onClose, onSubmit, song, isEdit }) => {
  const [formData, setFormData] = useState({
    name: song?.name || '',
    image: null,
    mp3: null,
    mp4: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl mb-4 text-center text-spotify-base">{isEdit ? 'Sửa Bài Hát' : 'Thêm Bài Hát'}</h2>
        <form onSubmit={handleSubmit} className='text-black'>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tên Bài Hát</label>
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
            <label className="block text-sm font-medium mb-1">Hình Ảnh (PNG)</label>
            <input
              type="file"
              name="image"
              accept="image/png"
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Âm Thanh (MP3)</label>
            <input
              type="file"
              name="mp3"
              accept="audio/mp3"
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Video (MP4)</label>
            <input
              type="file"
              name="mp4"
              accept="video/mp4"
              onChange={handleChange}
              className="w-full"
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
              {isEdit ? 'Cập Nhật' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongModal;