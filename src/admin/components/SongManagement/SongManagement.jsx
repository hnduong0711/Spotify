import React, { useState } from 'react';
import SongModal from '../SongModal/SongModal';
import Pagination from '../Pagination/Pagination';

// Component quản lý bài hát
const SongManagement = () => {
  const [songs, setSongs] = useState([
    { id: 1, name: 'Bài Hát 1', image: null, mp3: null, mp4: null },
    { id: 2, name: 'Bài Hát 2', image: null, mp3: null, mp4: null },
  ]);
  const [searchSong, setSearchSong] = useState('');
  const [songModalOpen, setSongModalOpen] = useState(false);
  const [editSong, setEditSong] = useState(null);
  const [songPage, setSongPage] = useState(1);
  const songsPerPage = 5;

  const addSong = (formData) => {
    const newSong = {
      id: songs.length + 1,
      ...formData,
    };
    setSongs([...songs, newSong]);
    console.log('Thêm bài hát:', newSong);
  };

  const updateSong = (formData) => {
    const updatedSongs = songs.map((song) =>
      song.id === editSong.id ? { ...song, ...formData } : song
    );
    setSongs(updatedSongs);
    console.log('Cập nhật bài hát:', formData);
  };

  const deleteSong = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bài hát này?')) {
      setSongs(songs.filter((song) => song.id !== id));
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
      <h2 className="text-4xl mb-4 text-spotify-base text-center font-semibold">Quản Lý Bài Hát</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm bài hát..."
          value={searchSong}
          onChange={(e) => setSearchSong(e.target.value)}
          className="border rounded px-3 py-2 w-1/3"
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
                  onClick={() => {
                    setEditSong(song);
                    setSongModalOpen(true);
                  }}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
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