import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Modal thêm/sửa bài hát
const SongModal = ({ isOpen, onClose, onSubmit, song, isEdit }) => {
  const [formData, setFormData] = useState({
    name: song?.name || '',
    duration: song?.duration || 0,
    artist_id: song?.artist?.id || '',
    image_file: null,
    audio_file: null,
    video_file: null,
  });
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(song?.image_url || '');
  const [audioUrl, setAudioUrl] = useState(song?.audio_url || '');
  const [videoUrl, setVideoUrl] = useState(song?.video_url || '');

  // Load danh sách nghệ sĩ
  useEffect(() => {
    const fetchArtists = async () => {
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
      }
    };
    fetchArtists();
  }, []);

  // Load dữ liệu bài hát khi sửa
  useEffect(() => {
    if (isEdit && song?.id) {
      const fetchSong = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:8000/api/song/${song.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
              },
              timeout: 10000,
            }
          );
          const data = response.data;
          setFormData({
            name: data.name,
            duration: data.duration,
            artist_id: data.artist.id,
            image_file: null,
            audio_file: null,
            video_file: null,
          });
          setImageUrl(data.image_url);
          setAudioUrl(data.audio_url);
          setVideoUrl(data.video_url);
        } catch (err) {
          console.error('Lỗi tải dữ liệu bài hát:', err.response?.data);
          setError(err.response?.data?.message || 'Không thể tải dữ liệu bài hát');
        } finally {
          setLoading(false);
        }
      };
      fetchSong();
    }
  }, [isEdit, song]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      if (name === 'audio_file') {
        calculateDuration(files[0]);
      }
      if (name === 'video_file' && formData.audio_file) {
        validateDuration(files[0], formData.audio_file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateDuration = (audioFile) => {
    const audio = new Audio(URL.createObjectURL(audioFile));
    audio.onloadedmetadata = () => {
      setFormData((prev) => ({ ...prev, duration: Math.round(audio.duration) }));
      if (formData.video_file) {
        validateDuration(formData.video_file, audioFile);
      }
    };
  };

  const validateDuration = (videoFile, audioFile) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.onloadedmetadata = () => {
      const audio = new Audio(URL.createObjectURL(audioFile));
      audio.onloadedmetadata = () => {
        if (Math.round(video.duration) !== Math.round(audio.duration)) {
          setError('Thời lượng video và audio phải bằng nhau');
        } else {
          setError('');
        }
      };
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) return;

    const data = new FormData();
    data.append('name', formData.name);
    data.append('duration', formData.duration);
    data.append('artist', formData.artist_id); // Sửa từ artist_id thành artist
    if (formData.image_file) data.append('image_file', formData.image_file);
    if (formData.audio_file) data.append('audio_file', formData.audio_file);
    if (formData.video_file) data.append('video_file', formData.video_file);

    for (let pair of data.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      await onSubmit(data);
      setFormData({
        name: '',
        duration: 0,
        artist_id: '',
        image_file: null,
        audio_file: null,
        video_file: null,
      });
      setImageUrl('');
      setAudioUrl('');
      setVideoUrl('');
      setError('');
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Lỗi gửi dữ liệu:', err.response?.data);
      setError(err.response?.data?.message || 'Không thể gửi dữ liệu');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl mb-4">
          {isEdit ? 'Sửa Bài Hát' : 'Thêm Bài Hát'}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p className="text-gray-500 mb-4">Đang tải...</p>}
        <form onSubmit={handleSubmit}>
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
            <label className="block text-sm font-medium mb-1">Thời Lượng (giây)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nghệ Sĩ</label>
            <select
              name="artist_id"
              value={formData.artist_id}
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
            <label className="block text-sm font-medium mb-1">Hình Ảnh (PNG)</label>
            {/* {imageUrl && !formData.image_file && (
              <img src={imageUrl} alt="Preview" className="w-32 h-32 mb-2" />
            )} */}
            <input
              type="file"
              name="image_file"
              accept="image/png"
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Âm Thanh (MP3)</label>
            {/* {audioUrl && !formData.audio_file && (
              <audio controls src={audioUrl} className="mb-2" />
            )} */}
            <input
              type="file"
              name="audio_file"
              accept="audio/mp3"
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Video (MP4)</label>
            {/* {videoUrl && !formData.video_file && (
              <video controls src={videoUrl} className="w-32 h-32 mb-2" />
            )} */}
            <input
              type="file"
              name="video_file"
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