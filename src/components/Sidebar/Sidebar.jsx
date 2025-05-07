import { useState, useEffect } from 'react'
import { Plus, ChevronLeft, ChevronRight, X, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [favourites, setFavourites] = useState([])
  const [newPlaylist, setNewPlaylist] = useState({ name: '', image_url: '' })
  const [imagePreview, setImagePreview] = useState(null)
  const [editingPlaylist, setEditingPlaylist] = useState(null)
  const [deletePlaylistId, setDeletePlaylistId] = useState(null)
  const [showOptions, setShowOptions] = useState(null)

  const user = JSON.parse(localStorage.getItem('currentUser')) || {}
  const userId = user.id || 0
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/playlist/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        console.log('Playlists response:', response.data)
        const updatedPlaylists = await Promise.all(
          response.data.map(async (playlist) => {
            const songsResponse = await axios.get(`http://localhost:8000/api/playlist-song/playlist/${playlist.id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
            const firstSong = songsResponse.data[0]?.song
            const defaultImage = firstSong?.image_url || 'https://i.pinimg.com/736x/ec/e4/b5/ece4b597f82c0970b9a92ac5d9207701.jpg'
            return {
              id: playlist.id,
              name: playlist.name,
              image: playlist.image_url || defaultImage,
            }
          })
        )
        setPlaylists(updatedPlaylists)
      } catch (error) {
        console.error('Error fetching playlists:', error)
      }
    }

    const fetchFavourites = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/favourite-song/user/4`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        console.log('Favourites response:', response.data)
        setFavourites(
          response.data.map(item => ({
            id: item.song.id,
            name: item.song.name,
            image: item.song.image_url || 'https://via.placeholder.com/32',
          }))
        )
      } catch (error) {
        console.error('Error fetching favourites:', error)
      }
    }

    fetchPlaylists()
    fetchFavourites()
  }, [userId, accessToken])

  const handleImageChange = (e) => {
    const url = e.target.value
    if (url && url.startsWith('http')) {
      setNewPlaylist({ ...newPlaylist, image_url: url })
      setImagePreview(url)
    } else {
      setNewPlaylist({ ...newPlaylist, image_url: '' })
      setImagePreview(null)
    }
  }

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name) {
      alert('Vui lòng nhập tên playlist!')
      return
    }

    const payload = {
      name: newPlaylist.name,
      user: userId,
    }
    if (newPlaylist.image_url) {
      payload.image_url = newPlaylist.image_url
    }

    try {
      console.log('Sending data to create playlist:', payload)
      const response = await axios.post(`http://localhost:8000/api/playlist/create`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Created playlist:', response.data)
      const createdPlaylist = response.data
      const songsResponse = await axios.get(`http://localhost:8000/api/playlist-song/playlist/${createdPlaylist.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const firstSong = songsResponse.data[0]?.song
      const defaultImage = firstSong?.image_url || 'https://i.pinimg.com/736x/ec/e4/b5/ece4b597f82c0970b9a92ac5d9207701.jpg'
      setPlaylists([...playlists, {
        id: createdPlaylist.id,
        name: createdPlaylist.name,
        image: createdPlaylist.image_url || defaultImage,
      }])
      setNewPlaylist({ name: '', image_url: '' })
      setImagePreview(null)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating playlist:', error.response?.data || error.message)
      alert('Có lỗi xảy ra khi tạo playlist. Vui lòng thử lại!')
    }
  }

  const handleEditPlaylist = (playlist) => {
    setEditingPlaylist(playlist)
    setNewPlaylist({ name: playlist.name, image_url: '' })
    setImagePreview(null)
    setShowOptions(null)
    setIsModalOpen(true)
  }

  const handleUpdatePlaylist = async () => {
    if (!newPlaylist.name) {
      alert('Vui lòng nhập tên playlist!')
      return
    }

    const payload = {
      name: newPlaylist.name,
      user: userId,
    }
    if (newPlaylist.image_url) {
      payload.image_url = newPlaylist.image_url
    }

    try {
      console.log('Updating playlist:', payload)
      const response = await axios.put(`http://localhost:8000/api/playlist/${editingPlaylist.id}/update`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Updated playlist:', response.data)
      const updatedPlaylist = response.data
      const songsResponse = await axios.get(`http://localhost:8000/api/playlist-song/playlist/${updatedPlaylist.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const firstSong = songsResponse.data[0]?.song
      const defaultImage = firstSong?.image_url || 'https://i.pinimg.com/736x/ec/e4/b5/ece4b597f82c0970b9a92ac5d9207701.jpg'
      setPlaylists(playlists.map(p => 
        p.id === updatedPlaylist.id 
          ? { ...p, name: updatedPlaylist.name, image: updatedPlaylist.image_url || p.image || defaultImage }
          : p
      ))
      setNewPlaylist({ name: '', image_url: '' })
      setImagePreview(null)
      setEditingPlaylist(null)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error updating playlist:', error.response?.data || error.message)
      alert('Có lỗi xảy ra khi cập nhật playlist. Vui lòng thử lại!')
    }
  }

  const handleDeletePlaylist = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/playlist/${deletePlaylistId}/delete`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setPlaylists(playlists.filter(p => p.id !== deletePlaylistId))
      setIsDeleteModalOpen(false)
      setDeletePlaylistId(null)
    } catch (error) {
      console.error('Error deleting playlist:', error.response?.data || error.message)
      alert('Có lỗi xảy ra khi xóa playlist. Vui lòng thử lại!')
    }
  }

  const handlePlaylistClick = (type, id) => {
    navigate(`/${type}/${id}`)
  }

  return (
    <>
      <motion.div
        animate={{ width: isOpen ? 350 : 150 }}
        className="bg-[#1a1a1a] h-[calc(100vh-80px)] p-4 flex flex-col border-r border-gray-700 rounded-r-lg"
      >
        <button onClick={() => setIsOpen(!isOpen)} className="mb-4 self-end cursor-pointer">
          {isOpen ? <ChevronLeft size={24} className="text-white" /> : <ChevronRight size={24} className="text-white" />}
        </button>
        <nav className="flex-1">
          <ul className="flex items-center justify-end">
            <li className="w-full">
              <button
                onClick={() => {
                  setEditingPlaylist(null)
                  setNewPlaylist({ name: '', image_url: '' })
                  setImagePreview(null)
                  setIsModalOpen(true)
                }}
                className={`flex items-center space-x-2 text-white hover:bg-spotify-base hover:text-black transition-all duration-300 border-2 border-spotify-green rounded-lg p-2 w-full ${isOpen ? 'justify-start' : 'justify-center'}`}
              >
                <Plus size={24} />
                {isOpen && <span>Tạo danh sách phát</span>}
              </button>
            </li>
          </ul>
          {isOpen ? (
            <div className="mt-4 pr-2 overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
              <h3 className="text-xl text-spotify-base font-semibold">Favorites</h3>
              <ul className="mt-2 space-y-4">
                <li className="hover:bg-white/10 p-4 hover:rounded-lg transition-all duration-300">
                  <button
                    onClick={() => handlePlaylistClick('favourites', 'user-favourites')}
                    className="flex items-center space-x-4 text-white hover:text-spotify-green cursor-pointer w-full text-left"
                  >
                    <img src="https://via.placeholder.com/32" alt="Favorites" className="w-8 h-8 rounded" />
                    <span className="truncate">Favorites</span>
                  </button>
                </li>
              </ul>
              <h3 className="text-xl text-spotify-base font-semibold mt-6">Danh sách phát</h3>
              <ul className="mt-2 space-y-4">
                {playlists.map(playlist => (
                  <li key={playlist.id} className="hover:bg-white/10 p-4 hover:rounded-lg transition-all duration-300 relative">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handlePlaylistClick('playlist', playlist.id)}
                        className="flex items-center space-x-4 text-white hover:text-spotify-green cursor-pointer w-full text-left"
                      >
                        <img src={playlist.image} alt={playlist.name} className="w-8 h-8 rounded" />
                        <span className="truncate">{playlist.name}</span>
                      </button>
                      <button
                        onClick={() => {setShowOptions(playlist.id === showOptions ? null : playlist.id)}}
                        className="text-white hover:text-spotify-green"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                    {showOptions === playlist.id && (
                      <div className="absolute right-4 top-12 bg-[#2a2a2a] rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleEditPlaylist(playlist)}
                          className="flex items-center space-x-2 text-white hover:bg-spotify-base hover:text-black w-full px-4 py-2 rounded-t-lg"
                        >
                          <Edit size={16} />
                          <span>Chỉnh sửa</span>
                        </button>
                        <button
                          onClick={() => {
                            setDeletePlaylistId(playlist.id)
                            setShowOptions(null)
                            setIsDeleteModalOpen(true)
                          }}
                          className="flex items-center space-x-2 text-white hover:bg-red-600 w-full px-4 py-2 rounded-b-lg"
                        >
                          <Trash2 size={16} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4 pb-10 overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
              <ul className="space-y-4">
                <li className="hover:bg-white/10 p-4 hover:rounded-lg transition-all duration-300">
                  <button
                    onClick={() => handlePlaylistClick('favourites', 'user-favourites')}
                    className="flex items-center justify-center text-white hover:text-spotify-green cursor-pointer"
                  >
                    <img src="https://via.placeholder.com/32" alt="Favorites" className="w-8 h-8 rounded" />
                  </button>
                </li>
                {playlists.map(playlist => (
                  <li key={playlist.id} className="hover:bg-white/10 p-4 hover:rounded-lg transition-all duration-300">
                    <button
                      onClick={() => handlePlaylistClick('playlist', playlist.id)}
                      className="flex items-center justify-center text-white hover:text-spotify-green cursor-pointer"
                    >
                      <img src={playlist.image} alt={playlist.name} className="w-8 h-8 rounded" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </motion.div>

      {/* Modal tạo/chỉnh sửa playlist */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.1 }}
            onClick={() => {
              setIsModalOpen(false)
              setEditingPlaylist(null)
              setNewPlaylist({ name: '', image_url: '' })
              setImagePreview(null)
            }}
          ></div>
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={() => {
                setIsModalOpen(false)
                setEditingPlaylist(null)
                setNewPlaylist({ name: '', image_url: '' })
                setImagePreview(null)
              }}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl text-white font-semibold mb-4">
              {editingPlaylist ? 'Chỉnh sửa Playlist' : 'Tạo Playlist Mới'}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-white mb-1">
                  Tên Playlist
                </label>
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
                <label htmlFor="image_url" className="block text-white mb-1">
                  URL Hình Ảnh (bắt đầu bằng http)
                </label>
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
                  setIsModalOpen(false)
                  setEditingPlaylist(null)
                  setNewPlaylist({ name: '', image_url: '' })
                  setImagePreview(null)
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={editingPlaylist ? handleUpdatePlaylist : handleCreatePlaylist}
                className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                {editingPlaylist ? 'Cập nhật' : 'Tạo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.1 }}
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <h2 className="text-xl text-white font-semibold mb-4">Bạn có muốn xóa playlist này không?</h2>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setDeletePlaylistId(null)
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar