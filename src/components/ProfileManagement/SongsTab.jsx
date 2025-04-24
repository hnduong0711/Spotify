import { useContext, useState } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import { UserContext } from '../../context/ProfileContext'

function SongsTab() {
  const { currentUser } = useContext(UserContext)
  const [songs, setSongs] = useState([
    {
      id: 1,
      name: 'Song 1',
      artist_id: 1,
      image_url: 'https://via.placeholder.com/32',
      audio_url: 'https://example.com/song1.mp3',
      video_url: 'https://example.com/song1.mp4',
    },
    {
      id: 2,
      name: 'Song 2',
      artist_id: 1,
      image_url: 'https://via.placeholder.com/32',
      audio_url: 'https://example.com/song2.mp3',
      video_url: 'https://example.com/song2.mp4',
    },
  ])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newSong, setNewSong] = useState({ name: '', image: null, audio: null, video_url: '', imagePreview: null })
  const [editingSong, setEditingSong] = useState(null)

  const handleImageChange = (e, setState, field) => {
    const file = e.target.files[0]
    if (file) {
      setState(prev => ({
        ...prev,
        [field]: file,
        imagePreview: URL.createObjectURL(file),
      }))
    } else {
      setState(prev => ({
        ...prev,
        [field]: null,
        imagePreview: null,
      }))
    }
  }

  const handleUploadSong = async () => {
    if (!newSong.name || !newSong.audio) {
      alert('Vui lòng nhập tên bài hát và chọn file âm thanh!')
      return
    }

    const formData = new FormData()
    formData.append('name', newSong.name)
    formData.append('artist_id', currentUser.id)
    formData.append('audio', newSong.audio)
    if (newSong.image) {
      formData.append('image', newSong.image)
    }
    if (newSong.video_url) {
      formData.append('video_url', newSong.video_url)
    }

    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer your-token-here',
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload song')
      }

      const uploadedSong = await response.json()
      setSongs([...songs, uploadedSong])
      setNewSong({ name: '', image: null, audio: null, video_url: '', imagePreview: null })
      setIsUploadModalOpen(false)
    } catch (error) {
      console.error('Error uploading song:', error)
      alert('Có lỗi xảy ra khi tải bài hát lên. Vui lòng thử lại!')
    }
  }

  const handleEditSong = async () => {
    if (!editingSong.name) {
      alert('Vui lòng nhập tên bài hát!')
      return
    }

    const formData = new FormData()
    formData.append('name', editingSong.name)
    if (editingSong.image && typeof editingSong.image !== 'string') {
      formData.append('image', editingSong.image)
    }
    if (editingSong.audio && typeof editingSong.audio !== 'string') {
      formData.append('audio', editingSong.audio)
    }
    formData.append('video_url', editingSong.video_url)

    try {
      const response = await fetch(`/api/songs/${editingSong.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer your-token-here',
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to update song')
      }

      const updatedSong = await response.json()
      setSongs(songs.map(song => (song.id === updatedSong.id ? updatedSong : song)))
      setEditingSong(null)
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error updating song:', error)
      alert('Có lỗi xảy ra khi cập nhật bài hát. Vui lòng thử lại!')
    }
  }

  const handleDeleteSong = async (songId) => {
    if (!confirm('Bạn có chắc muốn xóa bài hát này?')) return

    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer your-token-here',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete song')
      }

      setSongs(songs.filter(song => song.id !== songId))
    } catch (error) {
      console.error('Error deleting song:', error)
      alert('Có lỗi xảy ra khi xóa bài hát. Vui lòng thử lại!')
    }
  }

  return (
    <div>
      <h1 className="text-3xl text-white font-semibold mb-6">Quản Lý Bài Hát</h1>
      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="mb-4 flex items-center space-x-2 bg-spotify-base text-black px-4 py-2 rounded hover:bg-spotify-highlight"
      >
        <Plus size={20} />
        <span>Tải Bài Hát Lên</span>
      </button>
      <div className="space-y-4">
        {songs.map(song => (
          <div key={song.id} className="bg-[#1a1a1a] p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={song.image_url} alt={song.name} className="w-12 h-12 rounded" />
              <div>
                <h3 className="text-white font-semibold">{song.name}</h3>
                <div className="flex space-x-2">
                  <a href={song.audio_url} className="text-spotify-green">Nghe</a>
                  {song.video_url && (
                    <a href={song.video_url} className="text-spotify-green">Xem Video</a>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingSong({ ...song, image: null, audio: null, imagePreview: song.image_url })
                  setIsEditModalOpen(true)
                }}
                className="p-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeleteSong(song.id)}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal tải bài hát */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.1 }}
            onClick={() => setIsUploadModalOpen(false)}
          ></div>
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl text-white font-semibold mb-4">Tải Bài Hát Lên</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="song_name" className="block text-white mb-1">
                  Tên Bài Hát
                </label>
                <input
                  type="text"
                  id="song_name"
                  value={newSong.name}
                  onChange={(e) => setNewSong({ ...newSong, name: e.target.value })}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Nhập tên bài hát"
                />
              </div>
              <div>
                <label htmlFor="song_image" className="block text-white mb-1">
                  Hình Ảnh
                </label>
                <input
                  type="file"
                  id="song_image"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setNewSong, 'image')}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                />
                {newSong.imagePreview && (
                  <div className="mt-2">
                    <img src={newSong.imagePreview} alt="Preview" className="w-24 h-24 rounded object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="song_audio" className="block text-white mb-1">
                  File Âm Thanh
                </label>
                <input
                  type="file"
                  id="song_audio"
                  accept="audio/*"
                  onChange={(e) => setNewSong({ ...newSong, audio: e.target.files[0] })}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                />
              </div>
              <div>
                <label htmlFor="song_video_url" className="block text-white mb-1">
                  Link Video (MP4)
                </label>
                <input
                  type="text"
                  id="song_video_url"
                  value={newSong.video_url}
                  onChange={(e) => setNewSong({ ...newSong, video_url: e.target.value })}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Nhập link MP4 (tùy chọn)"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={handleUploadSong}
                className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                Tải Lên
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa bài hát */}
      {isEditModalOpen && editingSong && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.1 }}
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl text-white font-semibold mb-4">Chỉnh Sửa Bài Hát</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit_song_name" className="block text-white mb-1">
                  Tên Bài Hát
                </label>
                <input
                  type="text"
                  id="edit_song_name"
                  value={editingSong.name}
                  onChange={(e) => setEditingSong({ ...editingSong, name: e.target.value })}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Nhập tên bài hát"
                />
              </div>
              <div>
                <label htmlFor="edit_song_image" className="block text-white mb-1">
                  Hình Ảnh
                </label>
                <input
                  type="file"
                  id="edit_song_image"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setEditingSong, 'image')}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                />
                {editingSong.imagePreview && (
                  <div className="mt-2">
                    <img src={editingSong.imagePreview} alt="Preview" className="w-24 h-24 rounded object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="edit_song_audio" className="block text-white mb-1">
                  File Âm Thanh
                </label>
                <input
                  type="file"
                  id="edit_song_audio"
                  accept="audio/*"
                  onChange={(e) => setEditingSong({ ...editingSong, audio: e.target.files[0] })}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                />
              </div>
              <div>
                <label htmlFor="edit_song_video_url" className="block text-white mb-1">
                  Link Video (MP4)
                </label>
                <input
                  type="text"
                  id="edit_song_video_url"
                  value={editingSong.video_url}
                  onChange={(e) => setEditingSong({ ...editingSong, video_url: e.target.value })}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Nhập link MP4 (tùy chọn)"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={handleEditSong}
                className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SongsTab