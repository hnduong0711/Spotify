import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../Pagination/Pagination';
import ArtistModal from '../ArtistModal/ArtistModal';
import { set } from 'react-hook-form';

// Component quản lý nghệ sĩ
const ArtistManagement = () => {
  const [artists, setArtists] = useState([]);
  const [searchArtist, setSearchArtist] = useState('');
  const [artistPage, setArtistPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editArtist, setEditArtist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const artistsPerPage = 5;

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

  const addArtist = async (artistData) => {
    try {
      // Bước 1: Tạo user
      const userResponse = await axios.post(
        'http://localhost:8000/api/user/create',
        {
          username: artistData.username,
          email: artistData.email,
          password: artistData.password,
          role: artistData.role,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          timeout: 10000,
        }
      );

      // Bước 2: Tạo nghệ sĩ với user ID
      const artistResponse = await axios.post(
        'http://localhost:8000/api/artist/create',
        {
          name: artistData.name,
          picture: artistData.picture,
          user: userResponse.data.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          timeout: 10000,
        }
      );

      setArtists([...artists, artistResponse.data]);
    } catch (err) {
      console.error('Lỗi thêm nghệ sĩ:', err.response?.data);
      setError(err.response?.data?.message || 'Không thể thêm nghệ sĩ');
    }
  };

  const updateArtist = async (artistData) => {
    console.log('Updating artist:', artistData);
    
    try {
      // Cập nhật user (giả định API PUT tồn tại)
      await axios.put(
        `http://localhost:8000/api/user/${editArtist.user}/update`,
        {
          username: artistData.username,
          email: artistData.email,
          password: artistData.password,
          role: artistData.role,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          timeout: 10000,
        }
      );

      // Cập nhật nghệ sĩ
      const artistResponse = await axios.put(
        `http://localhost:8000/api/artist/${editArtist.id}/update`,
        {
          name: artistData.name,
          picture: artistData.picture,
          user: editArtist.user,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          timeout: 10000,
        }
      );

      setArtists(
        artists.map((artist) =>
          artist.id === editArtist.id ? artistResponse.data : artist
        )
      );
    } catch (err) {
      console.error('Lỗi cập nhật nghệ sĩ:', err.response?.data);
      setError(err.response?.data?.message || 'Không thể cập nhật nghệ sĩ');
    }
  };

  const deleteArtist = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nghệ sĩ này?')) {
      try {
        // Lấy thông tin nghệ sĩ để lấy user ID
        const artistResponse = await axios.get(
          `http://localhost:8000/api/artist/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
            timeout: 10000,
          }
        );
        const userId = artistResponse.data.user;

        // Xóa user (sẽ tự động xóa nghệ sĩ do ràng buộc database)
        await axios.delete(`http://localhost:8000/api/user/${userId}/delete`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          timeout: 10000,
        });

        setArtists(artists.filter((artist) => artist.id !== id));
      } catch (err) {
        console.error('Lỗi xóa nghệ sĩ:', err.response?.data);
        setError(err.response?.data?.message || 'Không thể xóa nghệ sĩ');
      }
    }
  };

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchArtist.toLowerCase())
  );

  const totalArtistPages = Math.ceil(filteredArtists.length / artistsPerPage);
  const paginatedArtists = filteredArtists.slice(
    (artistPage - 1) * artistsPerPage,
    artistPage * artistsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full overflow-y-auto">
      <h2 className="text-4xl mb-4 text-spotify-base text-center font-semibold">
        Quản Lý Nghệ Sĩ
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Đang tải...</p>}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm nghệ sĩ..."
          value={searchArtist}
          onChange={(e) => setSearchArtist(e.target.value)}
          className="border border-black text-black rounded px-3 py-2 w-1/3"
        />
        <button
          onClick={() => {
            setEditArtist(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thêm Nghệ Sĩ
        </button>
      </div>
      <table className="w-full border-collapse text-black">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Tên Người Dùng</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedArtists.map((artist) => (
            <tr key={artist.id}>
              <td className="border p-2">{artist.id}</td>
              <td className="border p-2">{artist.name}</td>
              <td className="border p-2">{artist.username}</td>
              <td className="border p-2">{artist.email}</td>
              <td className="border p-2 flex space-x-2">
                <button
                  onClick={() => {
                    setEditArtist(artist);
                    setModalOpen(true);
                  }}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Sửa
                </button>
                <button
                  onClick={() => deleteArtist(artist.id)}
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
        currentPage={artistPage}
        totalPages={totalArtistPages}
        onPageChange={setArtistPage}
      />
      <ArtistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={editArtist ? updateArtist : addArtist}
        artist={editArtist}
        userId={artists.user}
        isEdit={!!editArtist}
      />
    </div>
  );
};

export default ArtistManagement;