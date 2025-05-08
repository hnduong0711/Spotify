import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import axios from "axios";

function PlaylistTab() {
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const token = localStorage.getItem("accessToken");

  const [playlists, setPlaylists] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: "", image_url: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [firstSongs, setFirstSongs] = useState({});

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/playlist/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.data) {
          throw new Error("No data found");
        }
        setPlaylists(response.data);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };
    fetchPlaylist();
  }, [user.id, token]);

  const fetchFirstSong = async (playlistId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/playlist-song/playlist/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data[0]?.song;
    } catch (error) {
      console.error("Error fetching first song:", error);
    }
  };

  useEffect(() => {
    const fetchAllFirstSongs = async () => {
      const songMap = {};
      for (const playlist of playlists) {
        const firstSong = await fetchFirstSong(playlist.id);
        if (firstSong) {
          songMap[playlist.id] = firstSong;
        }
      }
      setFirstSongs(songMap);
    };

    if (playlists.length > 0) {
      fetchAllFirstSongs();
    }
  }, [playlists]);

  const handleImageChange = (e) => {
    const url = e.target.value;
    if (url && url.startsWith("http")) {
      setNewPlaylist({ ...newPlaylist, image_url: url });
      setImagePreview(url);
    } else {
      setNewPlaylist({ ...newPlaylist, image_url: "" });
      setImagePreview(null);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name) {
      alert("Vui lòng nhập tên playlist!");
      return;
    }

    const payload = {
      name: newPlaylist.name,
      user: user.id,
    };
    if (newPlaylist.image_url) {
      payload.image_url = newPlaylist.image_url;
    }

    try {
      const response = await axios.post(`http://localhost:8000/api/playlist/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const createdPlaylist = response.data;
      const songsResponse = await axios.get(`http://localhost:8000/api/playlist-song/playlist/${createdPlaylist.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const firstSong = songsResponse.data[0]?.song;
      const defaultImage = firstSong?.image_url || "https://i.pinimg.com/736x/ec/e4/b5/ece4b597f82c0970b9a92ac5d9207701.jpg";
      setPlaylists([...playlists, {
        id: createdPlaylist.id,
        name: createdPlaylist.name,
        image_url: createdPlaylist.image_url || defaultImage,
      }]);
      setNewPlaylist({ name: "", image_url: "" });
      setImagePreview(null);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating playlist:", error.response?.data || error.message);
      alert("Có lỗi xảy ra khi tạo playlist. Vui lòng thử lại!");
    }
  };

  const handleEditPlaylist = async () => {
    if (!editingPlaylist.name) {
      alert("Vui lòng nhập tên playlist!");
      return;
    }

    const payload = {
      name: editingPlaylist.name,
      user: user.id,
    };
    if (editingPlaylist.image_url) {
      payload.image_url = editingPlaylist.image_url;
    } else if (!editingPlaylist.image_url && editingPlaylist.originalImageUrl) {
      payload.image_url = editingPlaylist.originalImageUrl;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/playlist/${editingPlaylist.id}/update`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const updatedPlaylist = response.data;
      const songsResponse = await axios.get(`http://localhost:8000/api/playlist-song/playlist/${updatedPlaylist.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const firstSong = songsResponse.data[0]?.song;
      const defaultImage = firstSong?.image_url || "https://i.pinimg.com/736x/ec/e4/b5/ece4b597f82c0970b9a92ac5d9207701.jpg";
      setPlaylists(playlists.map(p => 
        p.id === updatedPlaylist.id 
          ? { ...p, name: updatedPlaylist.name, image_url: updatedPlaylist.image_url || p.image_url || defaultImage }
          : p
      ));
      setEditingPlaylist(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating playlist:", error.response?.data || error.message);
      alert("Có lỗi xảy ra khi cập nhật playlist. Vui lòng thử lại!");
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!confirm("Bạn có chắc muốn xóa playlist này?")) return;
  
    try {
      const response = await axios.delete(`http://localhost:8000/api/playlist/${playlistId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 204 || response.status === 200) {
        setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId));
        console.log("Playlist deleted successfully, UI updated");
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting playlist:", error.response?.data || error.message);
      // Hiển thị lỗi cụ thể hơn
      alert(`Có lỗi xảy ra khi xóa playlist: ${error.response?.data?.message || error.message}. Vui lòng thử lại!`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl text-white font-semibold mb-6">Quản Lý Danh Sách Phát</h1>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="mb-4 flex items-center space-x-2 bg-spotify-base text-black px-4 py-2 rounded hover:bg-spotify-highlight"
      >
        <Plus size={20} />
        <span>Tạo Danh sách phát</span>
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="bg-[#1a1a1a] p-4 rounded-lg">
            <img
              src={playlist.image_url || firstSongs[playlist.id]?.image_url}
              alt={playlist.name}
              className="w-full h-52 object-cover rounded mb-2"
            />
            <h3 className="text-white font-semibold">{playlist.name}</h3>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => {
                  setEditingPlaylist({
                    ...playlist,
                    originalImageUrl: playlist.image_url,
                    image_url: "",
                    imagePreview: playlist.image_url,
                  });
                  setIsEditModalOpen(true);
                }}
                className="p-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeletePlaylist(playlist.id)}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal tạo playlist */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.1 }}
            onClick={() => setIsCreateModalOpen(false)}
          ></div>
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewPlaylist({ name: "", image_url: "" });
                setImagePreview(null);
              }}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl text-white font-semibold mb-4">Tạo Playlist Mới</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-white mb-1">Tên Playlist</label>
                <input
                  type="text"
                  id="name"
                  value={newPlaylist.name}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Nhập tên playlist"
                />
              </div>
              <div>
                <label htmlFor="image_url" className="block text-white mb-1">URL Hình Ảnh (bắt đầu bằng http)</label>
                <input
                  type="text"
                  id="image_url"
                  value={newPlaylist.image_url}
                  onChange={handleImageChange}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Dán URL ảnh (VD: https://example.com/image.jpg)"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewPlaylist({ name: "", image_url: "" });
                  setImagePreview(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={handleCreatePlaylist}
                className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa playlist */}
      {isEditModalOpen && editingPlaylist && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.1 }}
            onClick={() => {
              setIsEditModalOpen(false);
              setEditingPlaylist(null);
            }}
          ></div>
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingPlaylist(null);
              }}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl text-white font-semibold mb-4">Chỉnh Sửa Playlist</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-white mb-1">Tên Playlist</label>
                <input
                  type="text"
                  id="name"
                  value={editingPlaylist.name}
                  onChange={(e) => setEditingPlaylist({ ...editingPlaylist, name: e.target.value })}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Nhập tên playlist"
                />
              </div>
              <div>
                <label htmlFor="image_url" className="block text-white mb-1">URL Hình Ảnh (bắt đầu bằng http)</label>
                <input
                  type="text"
                  id="image_url"
                  value={editingPlaylist.image_url}
                  onChange={handleImageChange}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Dán URL ảnh (VD: https://example.com/image.jpg)"
                />
                {editingPlaylist.imagePreview && (
                  <div className="mt-2">
                    <img src={editingPlaylist.imagePreview} alt="Preview" className="w-24 h-24 rounded object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingPlaylist(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={handleEditPlaylist}
                className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistTab;