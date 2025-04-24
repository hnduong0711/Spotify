import { useContext, useState } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import { UserContext } from '../../context/ProfileContext'
function AlbumsTab() {
  const { currentUser } = useContext(UserContext)
  const [albums, setAlbums] = useState([
    { id: 1, name: 'Album 1', artist_id: 1, image_url: 'https://via.placeholder.com/32' },
    { id: 2, name: 'Album 2', artist_id: 1, image_url: 'https://via.placeholder.com/32' },
  ])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newAlbum, setNewAlbum] = useState({ name: '', image: null, imagePreview: null })
  const [editingAlbum, setEditingAlbum] = useState(null)

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

  const handleCreateAlbum = async () => {
    if (!newAlbum.name) {
      alert('Vui lòng nhập tên album!')
      return
    }

    const formData = new FormData()
    formData.append('name', newAlbum.name)
    formData.append('artist_id', currentUser.id)
    if (newAlbum.image) {
      formData.append('image', newAlbum.image)
    }

    try {
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer your-token-here',
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to create album')
      }

      const createdAlbum = await response.json()
      setAlbums([...albums, createdAlbum])
      setNewAlbum({ name: '', image: null, imagePreview: null })
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating album:', error)
      alert('Có lỗi xảy ra khi tạo album. Vui lòng thử lại!')
    }
  }

  const handleEditAlbum = async () => {
    if (!editingAlbum.name) {
      alert('Vui lòng nhập tên album!')
      return
    }

    const formData = new FormData()
    formData.append('name', editingAlbum.name)
    if (editingAlbum.image && typeof editingAlbum.image !== 'string') {
      formData.append('image', editingAlbum.image)
    }

    try {
      const response = await fetch(`/api/albums/${editingAlbum.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer your-token-here',
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to update album')
      }

      const updatedAlbum = await response.json()
      setAlbums(albums.map(album => (album.id === updatedAlbum.id ? updatedAlbum : album)))
      setEditingAlbum(null)
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error updating album:', error)
      alert('Có lỗi xảy ra khi cập nhật album. Vui lòng thử lại!')
    }
  }

  const handleDeleteAlbum = async (albumId) => {
    if (!confirm('Bạn có chắc muốn xóa album này?')) return

    try {
      const response = await fetch(`/api/albums/${albumId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer your-token-here',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete album')
      }

      setAlbums(albums.filter(album => album.id !== albumId))
    } catch (error) {
      console.error('Error deleting album:', error)
      alert('Có lỗi xảy ra khi xóa album. Vui lòng thử lại!')
    }
  }

  return (
    <div>
      <h1 className="text-3xl text-white font-semibold mb-6">Quản Lý Album</h1>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="mb-4 flex items-center space-x-2 bg-spotify-base text-black px-4 py-2 rounded hover:bg-spotify-highlight"
      >
        <Plus size={20} />
        <span>Tạo Album</span>
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {albums.map(album => (
          <div key={album.id} className="bg-[#1a1a1a] p-4 rounded-lg">
            <img src={album.image_url} alt={album.name} className="w-full h-32 object-cover rounded mb-2" />
            <h3 className="text-white font-semibold">{album.name}</h3>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => {
                  setEditingAlbum({ ...album, image: null, imagePreview: album.image_url })
                  setIsEditModalOpen(true)
                }}
                className="p-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeleteAlbum(album.id)}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal tạo album */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.1 }}
            onClick={() => setIsCreateModalOpen(false)}
          ></div>
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl text-white font-semibold mb-4">Tạo Album Mới</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="album_name" className="block text-white mb-1">
                  Tên Album
                </label>
                <input
                  type="text"
                  id="album_name"
                  value={newAlbum.name}
                  onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Nhập tên album"
                />
              </div>
              <div>
                <label htmlFor="album_image" className="block text-white mb-1">
                  Hình Ảnh
                </label>
                <input
                  type="file"
                  id="album_image"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setNewAlbum, 'image')}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                />
                {newAlbum.imagePreview && (
                  <div className="mt-2">
                    <img src={newAlbum.imagePreview} alt="Preview" className="w-24 h-24 rounded object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateAlbum}
                className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa album */}
      {isEditModalOpen && editingAlbum && (
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
            <h2 className="text-2xl text-white font-semibold mb-4">Chỉnh Sửa Album</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit_album_name" className="block text-white mb-1">
                  Tên Album
                </label>
                <input
                  type="text"
                  id="edit_album_name"
                  value={editingAlbum.name}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, name: e.target.value })}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Nhập tên album"
                />
              </div>
              <div>
                <label htmlFor="edit_album_image" className="block text-white mb-1">
                  Hình Ảnh
                </label>
                <input
                  type="file"
                  id="edit_album_image"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setEditingAlbum, 'image')}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                />
                {editingAlbum.imagePreview && (
                  <div className="mt-2">
                    <img src={editingAlbum.imagePreview} alt="Preview" className="w-24 h-24 rounded object-cover" />
                  </div>
                )}
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
                onClick={handleEditAlbum}
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

export default AlbumsTab