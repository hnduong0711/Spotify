import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion } from 'framer-motion'

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [playlists, setPlaylists] = useState([
    { id: 1, name: 'RapViet for life', image: 'https://via.placeholder.com/32' },
    { id: 2, name: 'Pop for life', image: 'https://via.placeholder.com/32' },
    { id: 3, name: 'RapViet for life', image: 'https://via.placeholder.com/32' },
    { id: 4, name: 'Pop for life', image: 'https://via.placeholder.com/32' },
    { id: 5, name: 'RapViet for life', image: 'https://via.placeholder.com/32' },
    { id: 6, name: 'Pop for life', image: 'https://via.placeholder.com/32' },
    { id: 7, name: 'RapViet for life', image: 'https://via.placeholder.com/32' },
    { id: 8, name: 'Pop for life', image: 'https://via.placeholder.com/32' },
    { id: 9, name: 'RapViet for life', image: 'https://via.placeholder.com/32' },
    { id: 10, name: 'Pop for life', image: 'https://via.placeholder.com/32' },
    { id: 11, name: 'RapViet for life', image: 'https://via.placeholder.com/32' },
    { id: 12, name: 'End', image: 'https://via.placeholder.com/32' },
  ])
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

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
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer your-token-here', // Thay bằng token thật sau
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to create playlist')
      }

      const createdPlaylist = await response.json()
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
                {isOpen && <span className=''>Tạo danh sách phát</span>}
              </button>
            </li>
          </ul>
          {isOpen ? (
            <div className="mt-4 pr-2 overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
              <h3 className="text-xl text-spotify-base font-semibold">Danh sách phát</h3>
              <ul className="mt-2 space-y-4">
                {playlists.map(playlist => (
                  <li key={playlist.id} className="hover:bg-white/10 p-4 hover:rounded-lg transition-all duration-300">
                    <a href="#" className="flex items-center space-x-4 text-white hover:text-spotify-green cursor-pointer">
                      <img src={playlist.image} alt={playlist.name} className="w-8 h-8 rounded" />
                      <span className="truncate">{playlist.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4 pb-10 overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
              <ul className="space-y-4">
                {playlists.map(playlist => (
                  <li key={playlist.id} className="hover:bg-white/10 p-4 hover:rounded-lg transition-all duration-300">
                    <a href="#" className="flex items-center justify-center text-white hover:text-spotify-green cursor-pointer">
                      <img src={playlist.image} alt={playlist.name} className="w-8 h-8 rounded" />
                    </a>
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
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.1 }}
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal content */}
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