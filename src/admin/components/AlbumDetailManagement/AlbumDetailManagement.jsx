import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import AlbumSongModal from '../AlbumSongModal/AlbumSongModal';

// Component quản lý chi tiết album
const AlbumDetailManagement = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [albumSongs, setAlbumSongs] = useState([]);
  const [searchSong, setSearchSong] = useState('');
  const [songPage, setSongPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const songsPerPage = 5;

  // Load danh sách bài hát trong album
  useEffect(() => {
    const fetchAlbumSongs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/album-song/album/${albumId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
            timeout: 10000,
          }
        );
        console.log('Danh sách bài hát trong album:', response.data);
        
        setAlbumSongs(response.data);
      } catch (err) {
        console.error('Lỗi tải danh sách bài hát:', err.response?.data);
        setError(
          err.response?.data?.message || 'Không thể tải danh sách bài hát'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumSongs();
  }, [albumId]);

  const addSongToAlbum = async (songData) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/album-song/create',
        songData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          timeout: 10000,
        }
      );
      setAlbumSongs([...albumSongs, response.data]);
    } catch (err) {
      console.error('Lỗi thêm bài hát vào album:', err.response?.data);
      setError(err.response?.data?.message || 'Không thể thêm bài hát vào album');
    }
  };

  const deleteSongFromAlbum = async (songId) => {
    if (window.confirm('Bạn có chắc muốn xóa bài hát này khỏi album?')) {
      try {
        await axios.delete(
          `http://localhost:8000/api/album-song/album/${albumId}/song/${songId}/delete`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
            timeout: 10000,
          }
        );
        setAlbumSongs(albumSongs.filter((song) => song.song.id !== songId));
      } catch (err) {
        console.error('Lỗi xóa bài hát khỏi album:', err.response?.data);
        setError(
          err.response?.data?.message || 'Không thể xóa bài hát khỏi album'
        );
      }
    }
  };

  const filteredSongs = albumSongs.filter((albumSong) =>
    albumSong.song.name.toLowerCase().includes(searchSong.toLowerCase())
  );

  const totalSongPages = Math.ceil(filteredSongs.length / songsPerPage);
  const paginatedSongs = filteredSongs.slice(
    (songPage - 1) * songsPerPage,
    songPage * songsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full overflow-y-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-4xl text-spotify-base text-center font-semibold">
          Quản Lý Bài Hát Trong Album
        </h2>
        <button
          onClick={() => navigate('/admin/albums')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Quay Lại
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Đang tải...</p>}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm bài hát..."
          value={searchSong}
          onChange={(e) => setSearchSong(e.target.value)}
          className="border rounded px-3 py-2 w-1/3"
        />
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thêm Bài Hát
        </button>
      </div>
      <table className="w-full border-collapse text-black">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên Bài Hát</th>
            <th className="border p-2">Nghệ Sĩ</th>
            <th className="border p-2">Thời Lượng</th>
            <th className="border p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSongs.map((albumSong) => (
            <tr key={albumSong.id}>
              <td className="border p-2">{albumSong.song.id}</td>
              <td className="border p-2">{albumSong.song.name}</td>
              <td className="border p-2">{albumSong.song.artist.name}</td>
              <td className="border p-2">{albumSong.song.duration} giây</td>
              <td className="border p-2 flex space-x-2">
                <button
                  onClick={() => deleteSongFromAlbum(albumSong.song.id)}
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
      <AlbumSongModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addSongToAlbum}
        currentAlbumId={albumId}
      />
    </div>
  );
};

export default AlbumDetailManagement;