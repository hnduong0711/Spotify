import { useState, useEffect } from 'react'
import { Plus, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [favourites, setFavourites] = useState([])
  const [newPlaylist, setNewPlaylist] = useState({ name: '' })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

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
        setPlaylists(
          response.data.map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            image: playlist.image_url || 'https://via.placeholder.com/32',
          }))
        )
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
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    } else {
      setSelectedImage(null)
      setImagePreview(null)
    }
  }

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name) {
      alert('Vui lòng nhập tên playlist!')
      return
    }

    const formData = new FormData()
    formData.append('name', newPlaylist.name)
    if (selectedImage) {
      formData.append('image', selectedImage)
    }

    try {
      const response = await axios.post(`http://localhost:8000/api/playlist/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('Created playlist:', response.data)
      const createdPlaylist = response.data
      setPlaylists([...playlists, {
        id: createdPlaylist.id,
        name: createdPlaylist.name,
        image: createdPlaylist.image_url || 'https://via.placeholder.com/32',
      }])
      setNewPlaylist({ name: '' })
      setSelectedImage(null)
      setImagePreview(null)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating playlist:', error)
      alert('Có lỗi xảy ra khi tạo playlist. Vui lòng thử lại!')
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
                onClick={() => setIsModalOpen(true)}
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
                  <li key={playlist.id} className="hover:bg-white/10 p-4 hover:rounded-lg transition-all duration-300">
                    <button
                      onClick={() => handlePlaylistClick('playlist', playlist.id)}
                      className="flex items-center space-x-4 text-white hover:text-spotify-green cursor-pointer w-full text-left"
                    >
                      <img src={playlist.image} alt={playlist.name} className="w-8 h-8 rounded" />
                      <span className="truncate">{playlist.name}</span>
                    </button>
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

      {/* Modal tạo playlist */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.1 }}
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl text-white font-semibold mb-4">Tạo Playlist Mới</h2>
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
                <label htmlFor="image" className="block text-white mb-1">
                  Hình Ảnh
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
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
                  setSelectedImage(null)
                  setImagePreview(null)
                  setNewPlaylist({ name: '' })
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
    </>
  )
}

export default Sidebar