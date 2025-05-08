import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import AlbumModal from '../AlbumModal/AlbumModal';

// Component quản lý album
const AlbumManagement = () => {
  const [albums, setAlbums] = useState([]);
  const [searchAlbum, setSearchAlbum] = useState('');
  const [albumPage, setAlbumPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAlbum, setEditAlbum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const albumsPerPage = 5;
  const navigate = useNavigate();

  // Load danh sách album
  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/album', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          timeout: 10000,
        });
        setAlbums(response.data);
      } catch (err) {
        console.error('Lỗi tải danh sách album:', err.response?.data);
        setError(err.response?.data?.message || 'Không thể tải danh sách album');
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  const addAlbum = async (albumData) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/album/create',
        albumData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          timeout: 10000,
        }
      );
      setAlbums([...albums, response.data]);
    } catch (err) {
      console.error('Lỗi thêm album:', err.response?.data);
      setError(err.response?.data?.message || 'Không thể thêm album');
    }
  };

  const updateAlbum = async (albumData) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/album/${editAlbum.id}/update`,
        albumData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          timeout: 10000,
        }
      );
      setAlbums(
        albums.map((album) =>
          album.id === editAlbum.id ? response.data : album
        )
      );
    } catch (err) {
      console.error('Lỗi cập nhật album:', err.response?.data);
      setError(err.response?.data?.message || 'Không thể cập nhật album');
    }
  };

  const deleteAlbum = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa album này?')) {
      try {
        await axios.delete(`http://localhost:8000/api/album/${id}/delete`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          timeout: 10000,
        });
        setAlbums(albums.filter((album) => album.id !== id));
      } catch (err) {
        console.error('Lỗi xóa album:', err.response?.data);
        setError(err.response?.data?.message || 'Không thể xóa album');
      }
    }
  };

  const filteredAlbums = albums.filter((album) =>
    album.name.toLowerCase().includes(searchAlbum.toLowerCase())
  );

  const totalAlbumPages = Math.ceil(filteredAlbums.length / albumsPerPage);
  const paginatedAlbums = filteredAlbums.slice(
    (albumPage - 1) * albumsPerPage,
    albumPage * albumsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full overflow-y-auto">
      <h2 className="text-4xl mb-4 text-spotify-base text-center font-semibold">
        Quản Lý Album
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Đang tải...</p>}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm album..."
          value={searchAlbum}
          onChange={(e) => setSearchAlbum(e.target.value)}
          className="border rounded px-3 py-2 w-1/3"
        />
        <button
          onClick={() => {
            setEditAlbum(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thêm Album
        </button>
      </div>
      <table className="w-full border-collapse text-black">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên Album</th>
            <th className="border p-2">Nghệ Sĩ Sở Hữu</th>
            <th className="border p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAlbums.map((album) => (
            <tr key={album.id}>
              <td className="border p-2">{album.id}</td>
              <td className="border p-2">{album.name}</td>
              <td className="border p-2">{album.artist.name}</td>
              <td className="border p-2 flex space-x-2">
                <button
                  onClick={() => {
                    setEditAlbum(album);
                    setModalOpen(true);
                  }}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Sửa
                </button>
                <button
                  onClick={() => deleteAlbum(album.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Xóa
                </button>
                <button
                  onClick={() => navigate(`/admin/albums/${album.id}`)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Xem Chi Tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={albumPage}
        totalPages={totalAlbumPages}
        onPageChange={setAlbumPage}
      />
      <AlbumModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={editAlbum ? updateAlbum : addAlbum}
        album={editAlbum}
        isEdit={!!editAlbum}
      />
    </div>
  );
};

export default AlbumManagement;