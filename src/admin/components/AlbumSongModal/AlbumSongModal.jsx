import React, { useState, useEffect } from 'react';
import axios from 'axios';

// modal thêm bài hát vào album
const AlbumSongModal = ({ isOpen, onClose, onSubmit, currentAlbumId }) => {
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [searchSong, setSearchSong] = useState('');
  const [searchAlbum, setSearchAlbum] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(currentAlbumId || null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // load danh sách album
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

  // load danh sách bài hát khi chọn album
  useEffect(() => {
    if (selectedAlbum) {
      const fetchSongs = async () => {
        setLoading(true);
        try {
          const [albumSongsResponse, allSongsResponse] = await Promise.all([
            axios.get(
              `http://localhost:8000/api/album-song/album/${selectedAlbum}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
                },
                timeout: 10000,
              }
            ),
            axios.get('http://localhost:8000/api/song', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
              },
              timeout: 10000,
            }),
          ]);

          // lấy danh sách ID bài hát đã có trong album
          const albumSongIds = albumSongsResponse.data.map(
            (albumSong) => albumSong.song.id
          );

          // lọc các bài hát chưa có trong album
          const availableSongs = allSongsResponse.data.filter(
            (song) => !albumSongIds.includes(song.id)
          );

          setSongs(availableSongs);
        } catch (err) {
          console.error('Lỗi tải danh sách bài hát:', err.response?.data);
          setError(
            err.response?.data?.message || 'Không thể tải danh sách bài hát'
          );
        } finally {
          setLoading(false);
        }
      };
      fetchSongs();
    } else {
      setSongs([]); // xóa danh sách bài hát nếu chưa chọn album
    }
  }, [selectedAlbum]);

  const handleSongSelect = (songId) => {
    setSelectedSong(songId);
  };

  const handleAlbumSelect = (albumId) => {
    setSelectedAlbum(albumId);
    setSelectedSong(null); // reset bài hát đã chọn khi đổi album
  };

  const handleSubmit = () => {
    if (!selectedSong || !selectedAlbum) {
      setError('Vui lòng chọn một bài hát và một album');
      return;
    }

    const submitData = {
      album: selectedAlbum,
      song_id: selectedSong,
    };

    onSubmit(submitData);
    onClose();
  };

  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().includes(searchSong.toLowerCase())
  );

  const filteredAlbums = albums.filter((album) =>
    album.name.toLowerCase().includes(searchAlbum.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-4xl">
        <h2 className="text-2xl mb-4">Thêm Bài Hát Vào Album</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p className="text-gray-500 mb-4">Đang tải...</p>}
        <div className="flex space-x-4">
          {/* Danh sách album */}
          <div className="w-1/2">
            <h3 className="text-lg font-medium mb-2">Danh Sách Album</h3>
            <input
              type="text"
              placeholder="Tìm kiếm album..."
              value={searchAlbum}
              onChange={(e) => setSearchAlbum(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-2"
            />
            <div className="max-h-64 overflow-y-auto border rounded">
              {filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  className={`p-2 cursor-pointer ${
                    selectedAlbum === album.id
                      ? 'bg-blue-100'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleAlbumSelect(album.id)}
                >
                  {album.name} - {album.artist.name}
                </div>
              ))}
            </div>
          </div>
          {/* Danh sách bài hát */}
          <div className="w-1/2">
            <h3 className="text-lg font-medium mb-2">Danh Sách Bài Hát</h3>
            <input
              type="text"
              placeholder="Tìm kiếm bài hát..."
              value={searchSong}
              onChange={(e) => setSearchSong(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-2"
              disabled={!selectedAlbum}
            />
            <div className="max-h-64 overflow-y-auto border rounded">
              {selectedAlbum ? (
                filteredSongs.length > 0 ? (
                  filteredSongs.map((song) => (
                    <div
                      key={song.id}
                      className={`p-2 cursor-pointer ${
                        selectedSong === song.id
                          ? 'bg-blue-100'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleSongSelect(song.id)}
                    >
                      {song.name} - {song.artist.name}
                    </div>
                  ))
                ) : (
                  <p className="p-2 text-gray-500">
                    Không có bài hát nào khả dụng
                  </p>
                )
              ) : (
                <p className="p-2 text-gray-500">Vui lòng chọn một album</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumSongModal;