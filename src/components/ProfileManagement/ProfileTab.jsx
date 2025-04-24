import { useContext, useState } from 'react'
import { X } from 'lucide-react'
import { UserContext } from '../../context/ProfileContext'
function ProfileTab() {
  const { currentUser, setCurrentUser } = useContext(UserContext)
  const [isEditing, setIsEditing] = useState(false)
  const [artistRequestSent, setArtistRequestSent] = useState(false)
  const [imagePreview, setImagePreview] = useState(currentUser.image_url)

  const isArtist = currentUser.role_id === 2

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCurrentUser({ ...currentUser, image_url: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleUpdateProfile = async () => {
    const formData = new FormData()
    formData.append('username', currentUser.username)
    formData.append('email', currentUser.email)
    if (typeof currentUser.image_url !== 'string') {
      formData.append('image', currentUser.image_url)
    }

    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer your-token-here',
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = await response.json()
      setCurrentUser({ ...currentUser, image_url: updatedUser.image_url })
      alert('Cập nhật thông tin thành công!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại!')
    }
  }

  const handleRequestArtist = async () => {
    try {
      const response = await fetch('/api/request-artist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-token-here',
        },
        body: JSON.stringify({ user_id: currentUser.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to send artist request')
      }

      setArtistRequestSent(true)
      alert('Yêu cầu đăng ký Artist đã được gửi!')
    } catch (error) {
      console.error('Error sending artist request:', error)
      alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại!')
    }
  }

  return (
    <div>
      <h1 className="text-3xl text-white font-semibold mb-6">Thông Tin Cá Nhân</h1>
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-white mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={currentUser.username}
                onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-white mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={currentUser.email}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-white mb-1">
                Ảnh Đại Diện
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
                  <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                Lưu
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <img src={currentUser.image_url} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            <p className="text-white">
              <span className="font-semibold">Username:</span> {currentUser.username}
            </p>
            <p className="text-white">
              <span className="font-semibold">Email:</span> {currentUser.email}
            </p>
            <p className="text-white">
              <span className="font-semibold">Role:</span>{' '}
              {currentUser.role_id === 1 ? 'User' : 'Artist'}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
              >
                Chỉnh Sửa
              </button>
              {!isArtist && !artistRequestSent && (
                <button
                  onClick={handleRequestArtist}
                  className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
                >
                  Đăng Ký Artist
                </button>
              )}
              {!isArtist && artistRequestSent && (
                <p className="text-spotify-green">Yêu cầu Artist đã được gửi!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileTab