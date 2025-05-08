import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SongModal from '../SongModal/SongModal';
import Pagination from '../Pagination/Pagination';

// Component quản lý bài hát
const SongManagement = () => {
  const [songs, setSongs] = useState([]);
  const [searchSong, setSearchSong] = useState('');
  const [songModalOpen, setSongModalOpen] = useState(false);
  const [editSong, setEditSong] = useState(null);
  const [songPage, setSongPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const songsPerPage = 5;

  // Load danh sách bài hát
  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/song', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        setSongs(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải danh sách bài hát');
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const addSong = async (formData) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/song/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setSongs([...songs, response.data]);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể thêm bài hát');
    }
  };

  const updateSong = async (formData) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/song/${editSong.id}/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setSongs(
        songs.map((song) => (song.id === response.data.id ? response.data : song))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể cập nhật bài hát');
    }
  };

  const deleteSong = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bài hát này?')) {
      try {
        await axios.delete(`http://localhost:8000/api/song/${id}/delete`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        setSongs(songs.filter((song) => song.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể xóa bài hát');
      }
    }
  };

  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().includes(searchSong.toLowerCase())
  );

  const totalSongPages = Math.ceil(filteredSongs.length / songsPerPage);
  const paginatedSongs = filteredSongs.slice(
    (songPage - 1) * songsPerPage,
    songPage * songsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full overflow-y-auto">
      <h2 className="text-4xl mb-4 text-spotify-base text-center font-semibold">
        Quản Lý Bài Hát
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Đang tải...</p>}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm bài hát..."
          value={searchSong}
          onChange={(e) => setSearchSong(e.target.value)}
          className="border border-black text-black rounded px-3 py-2 w-1/3"
        />
        <button
          onClick={() => {
            setEditSong(null);
            setSongModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thêm Bài Hát
        </button>
      </div>
      <table className="w-full border-collapse text-black">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSongs.map((song) => (
            <tr key={song.id}>
              <td className="border p-2">{song.id}</td>
              <td className="border p-2">{song.name}</td>
              <td className="border p-2 flex space-x-2">
                <button
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => {
                    setEditSong(song);
                    setSongModalOpen(true);
                  }}
                >
                  Sửa
                </button>
                <button
                  onClick={() => deleteSong(song.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={songPage}
        totalPages={totalSongPages}
        onPageChange={setSongPage}
      />
      <SongModal
        isOpen={songModalOpen}
        onClose={() => setSongModalOpen(false)}
        onSubmit={editSong ? updateSong : addSong}
        song={editSong}
        isEdit={!!editSong}
      />
    </div>
  );
};

export default SongManagement;