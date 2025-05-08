// import { createContext, useContext, useState } from 'react'
// import { User, Album, Music, LogOut, X, Plus, Edit, Trash2 } from 'lucide-react'
// import { motion } from 'framer-motion'

// // Context để quản lý currentUser
// const UserContext = createContext()

// function UserProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState({
//     id: 1,
//     username: 'user1',
//     email: 'user1@example.com',
//     image_url: 'https://via.placeholder.com/150',
//     role_id: 1, // 1: "User", 2: "Artist"
//   })

//   return (
//     <UserContext.Provider value={{ currentUser, setCurrentUser }}>
//       {children}
//     </UserContext.Provider>
//   )
// }

// // Component Profile Tab
// function ProfileTab() {
//   const { currentUser, setCurrentUser } = useContext(UserContext)
//   const [isEditing, setIsEditing] = useState(false)
//   const [artistRequestSent, setArtistRequestSent] = useState(false)
//   const [imagePreview, setImagePreview] = useState(currentUser.image_url)

//   const isArtist = currentUser.role_id === 2

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setCurrentUser({ ...currentUser, image_url: file })
//       setImagePreview(URL.createObjectURL(file))
//     }
//   }

//   const handleUpdateProfile = async () => {
//     const formData = new FormData()
//     formData.append('username', currentUser.username)
//     formData.append('email', currentUser.email)
//     if (typeof currentUser.image_url !== 'string') {
//       formData.append('image', currentUser.image_url)
//     }

//     try {
//       const response = await fetch(`/api/users/${currentUser.id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': 'Bearer your-token-here',
//         },
//         body: formData,
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update profile')
//       }

//       const updatedUser = await response.json()
//       setCurrentUser({ ...currentUser, image_url: updatedUser.image_url })
//       alert('Cập nhật thông tin thành công!')
//       setIsEditing(false)
//     } catch (error) {
//       console.error('Error updating profile:', error)
//       alert('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại!')
//     }
//   }

//   const handleRequestArtist = async () => {
//     try {
//       const response = await fetch('/api/request-artist', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer your-token-here',
//         },
//         body: JSON.stringify({ user_id: currentUser.id }),
//       })

//       if (!response.ok) {
//         throw new Error('Failed to send artist request')
//       }

//       setArtistRequestSent(true)
//       alert('Yêu cầu đăng ký Artist đã được gửi!')
//     } catch (error) {
//       console.error('Error sending artist request:', error)
//       alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại!')
//     }
//   }

//   return (
//     <div>
//       <h1 className="text-3xl text-white font-semibold mb-6">Thông Tin Cá Nhân</h1>
//       <div className="bg-[#1a1a1a] p-6 rounded-lg">
//         {isEditing ? (
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="username" className="block text-white mb-1">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 value={currentUser.username}
//                 onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
//                 className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//               />
//             </div>
//             <div>
//               <label htmlFor="email" className="block text-white mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={currentUser.email}
//                 onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
//                 className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//               />
//             </div>
//             <div>
//               <label htmlFor="image" className="block text-white mb-1">
//                 Ảnh Đại Diện
//               </label>
//               <input
//                 type="file"
//                 id="image"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//               />
//               {imagePreview && (
//                 <div className="mt-2">
//                   <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
//                 </div>
//               )}
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleUpdateProfile}
//                 className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
//               >
//                 Lưu
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Hủy
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <img src={currentUser.image_url} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
//             <p className="text-white">
//               <span className="font-semibold">Username:</span> {currentUser.username}
//             </p>
//             <p className="text-white">
//               <span className="font-semibold">Email:</span> {currentUser.email}
//             </p>
//             <p className="text-white">
//               <span className="font-semibold">Role:</span>{' '}
//               {currentUser.role_id === 1 ? 'User' : 'Artist'}
//             </p>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
//               >
//                 Chỉnh Sửa
//               </button>
//               {!isArtist && !artistRequestSent && (
//                 <button
//                   onClick={handleRequestArtist}
//                   className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
//                 >
//                   Đăng Ký Artist
//                 </button>
//               )}
//               {!isArtist && artistRequestSent && (
//                 <p className="text-spotify-green">Yêu cầu Artist đã được gửi!</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// // Component Albums Tab
// function AlbumsTab() {
//   const { currentUser } = useContext(UserContext)
//   const [albums, setAlbums] = useState([
//     { id: 1, name: 'Album 1', artist_id: 1, image_url: 'https://via.placeholder.com/32' },
//     { id: 2, name: 'Album 2', artist_id: 1, image_url: 'https://via.placeholder.com/32' },
//   ])
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [newAlbum, setNewAlbum] = useState({ name: '', image: null, imagePreview: null })
//   const [editingAlbum, setEditingAlbum] = useState(null)

//   const handleImageChange = (e, setState, field) => {
//     const file = e.target.files[0]
//     if (file) {
//       setState(prev => ({
//         ...prev,
//         [field]: file,
//         imagePreview: URL.createObjectURL(file),
//       }))
//     } else {
//       setState(prev => ({
//         ...prev,
//         [field]: null,
//         imagePreview: null,
//       }))
//     }
//   }

//   const handleCreateAlbum = async () => {
//     if (!newAlbum.name) {
//       alert('Vui lòng nhập tên album!')
//       return
//     }

//     const formData = new FormData()
//     formData.append('name', newAlbum.name)
//     formData.append('artist_id', currentUser.id)
//     if (newAlbum.image) {
//       formData.append('image', newAlbum.image)
//     }

//     try {
//       const response = await fetch('/api/albums', {
//         method: 'POST',
//         headers: {
//           'Authorization': 'Bearer your-token-here',
//         },
//         body: formData,
//       })

//       if (!response.ok) {
//         throw new Error('Failed to create album')
//       }

//       const createdAlbum = await response.json()
//       setAlbums([...albums, createdAlbum])
//       setNewAlbum({ name: '', image: null, imagePreview: null })
//       setIsCreateModalOpen(false)
//     } catch (error) {
//       console.error('Error creating album:', error)
//       alert('Có lỗi xảy ra khi tạo album. Vui lòng thử lại!')
//     }
//   }

//   const handleEditAlbum = async () => {
//     if (!editingAlbum.name) {
//       alert('Vui lòng nhập tên album!')
//       return
//     }

//     const formData = new FormData()
//     formData.append('name', editingAlbum.name)
//     if (editingAlbum.image && typeof editingAlbum.image !== 'string') {
//       formData.append('image', editingAlbum.image)
//     }

//     try {
//       const response = await fetch(`/api/albums/${editingAlbum.id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': 'Bearer your-token-here',
//         },
//         body: formData,
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update album')
//       }

//       const updatedAlbum = await response.json()
//       setAlbums(albums.map(album => (album.id === updatedAlbum.id ? updatedAlbum : album)))
//       setEditingAlbum(null)
//       setIsEditModalOpen(false)
//     } catch (error) {
//       console.error('Error updating album:', error)
//       alert('Có lỗi xảy ra khi cập nhật album. Vui lòng thử lại!')
//     }
//   }

//   const handleDeleteAlbum = async (albumId) => {
//     if (!confirm('Bạn có chắc muốn xóa album này?')) return

//     try {
//       const response = await fetch(`/api/albums/${albumId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': 'Bearer your-token-here',
//         },
//       })

//       if (!response.ok) {
//         throw new Error('Failed to delete album')
//       }

//       setAlbums(albums.filter(album => album.id !== albumId))
//     } catch (error) {
//       console.error('Error deleting album:', error)
//       alert('Có lỗi xảy ra khi xóa album. Vui lòng thử lại!')
//     }
//   }

//   return (
//     <div>
//       <h1 className="text-3xl text-white font-semibold mb-6">Quản Lý Album</h1>
//       <button
//         onClick={() => setIsCreateModalOpen(true)}
//         className="mb-4 flex items-center space-x-2 bg-spotify-base text-black px-4 py-2 rounded hover:bg-spotify-highlight"
//       >
//         <Plus size={20} />
//         <span>Tạo Album</span>
//       </button>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {albums.map(album => (
//           <div key={album.id} className="bg-[#1a1a1a] p-4 rounded-lg">
//             <img src={album.image_url} alt={album.name} className="w-full h-32 object-cover rounded mb-2" />
//             <h3 className="text-white font-semibold">{album.name}</h3>
//             <div className="flex space-x-2 mt-2">
//               <button
//                 onClick={() => {
//                   setEditingAlbum({ ...album, image: null, imagePreview: album.image_url })
//                   setIsEditModalOpen(true)
//                 }}
//                 className="p-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
//               >
//                 <Edit size={16} />
//               </button>
//               <button
//                 onClick={() => handleDeleteAlbum(album.id)}
//                 className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal tạo album */}
//       {isCreateModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div
//             className="absolute inset-0 bg-black"
//             style={{ opacity: 0.1 }}
//             onClick={() => setIsCreateModalOpen(false)}
//           ></div>
//           <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg relative w-full max-w-md">
//             <button
//               onClick={() => setIsCreateModalOpen(false)}
//               className="absolute top-2 right-2 text-white hover:text-gray-300"
//             >
//               <X size={24} />
//             </button>
//             <h2 className="text-2xl text-white font-semibold mb-4">Tạo Album Mới</h2>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="album_name" className="block text-white mb-1">
//                   Tên Album
//                 </label>
//                 <input
//                   type="text"
//                   id="album_name"
//                   value={newAlbum.name}
//                   onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })}
//                   className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//                   placeholder="Nhập tên album"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="album_image" className="block text-white mb-1">
//                   Hình Ảnh
//                 </label>
//                 <input
//                   type="file"
//                   id="album_image"
//                   accept="image/*"
//                   onChange={(e) => handleImageChange(e, setNewAlbum, 'image')}
//                   className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//                 />
//                 {newAlbum.imagePreview && (
//                   <div className="mt-2">
//                     <img src={newAlbum.imagePreview} alt="Preview" className="w-24 h-24 rounded object-cover" />
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end space-x-2">
//               <button
//                 onClick={() => setIsCreateModalOpen(false)}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={handleCreateAlbum}
//                 className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
//               >
//                 Tạo
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal chỉnh sửa album */}
//       {isEditModalOpen && editingAlbum && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div
//             className="absolute inset-0 bg-black"
//             style={{ opacity: 0.1 }}
//             onClick={() => setIsEditModalOpen(false)}
//           ></div>
//           <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg relative w-full max-w-md">
//             <button
//               onClick={() => setIsEditModalOpen(false)}
//               className="absolute top-2 right-2 text-white hover:text-gray-300"
//             >
//               <X size={24} />
//             </button>
//             <h2 className="text-2xl text-white font-semibold mb-4">Chỉnh Sửa Album</h2>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="edit_album_name" className="block text-white mb-1">
//                   Tên Album
//                 </label>
//                 <input
//                   type="text"
//                   id="edit_album_name"
//                   value={editingAlbum.name}
//                   onChange={(e) => setEditingAlbum({ ...editingAlbum, name: e.target.value })}
//                   className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//                   placeholder="Nhập tên album"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="edit_album_image" className="block text-white mb-1">
//                   Hình Ảnh
//                 </label>
//                 <input
//                   type="file"
//                   id="edit_album_image"
//                   accept="image/*"
//                   onChange={(e) => handleImageChange(e, setEditingAlbum, 'image')}
//                   className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//                 />
//                 {editingAlbum.imagePreview && (
//                   <div className="mt-2">
//                     <img src={editingAlbum.imagePreview} alt="Preview" className="w-24 h-24 rounded object-cover" />
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end space-x-2">
//               <button
//                 onClick={() => setIsEditModalOpen(false)}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={handleEditAlbum}
//                 className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
//               >
//                 Lưu
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // Component Songs Tab
// function SongsTab() {
//   const { currentUser } = useContext(UserContext)
//   const [songs, setSongs] = useState([
//     {
//       id: 1,
//       name: 'Song 1',
//       artist_id: 1,
//       image_url: 'https://via.placeholder.com/32',
//       audio_url: 'https://example.com/song1.mp3',
//       video_url: 'https://example.com/song1.mp4',
//     },
//     {
//       id: 2,
//       name: 'Song 2',
//       artist_id: 1,
//       image_url: 'https://via.placeholder.com/32',
//       audio_url: 'https://example.com/song2.mp3',
//       video_url: 'https://example.com/song2.mp4',
//     },
//   ])
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [newSong, setNewSong] = useState({ name: '', image: null, audio: null, video_url: '', imagePreview: null })
//   const [editingSong, setEditingSong] = useState(null)

//   const handleImageChange = (e, setState, field) => {
//     const file = e.target.files[0]
//     if (file) {
//       setState(prev => ({
//         ...prev,
//         [field]: file,
//         imagePreview: URL.createObjectURL(file),
//       }))
//     } else {
//       setState(prev => ({
//         ...prev,
//         [field]: null,
//         imagePreview: null,
//       }))
//     }
//   }

//   const handleUploadSong = async () => {
//     if (!newSong.name || !newSong.audio) {
//       alert('Vui lòng nhập tên bài hát và chọn file âm thanh!')
//       return
//     }

//     const formData = new FormData()
//     formData.append('name', newSong.name)
//     formData.append('artist_id', currentUser.id)
//     formData.append('audio', newSong.audio)
//     if (newSong.image) {
//       formData.append('image', newSong.image)
//     }
//     if (newSong.video_url) {
//       formData.append('video_url', newSong.video_url)
//     }

//     try {
//       const response = await fetch('/api/songs', {
//         method: 'POST',
//         headers: {
//           'Authorization': 'Bearer your-token-here',
//         },
//         body: formData,
//       })

//       if (!response.ok) {
//         throw new Error('Failed to upload song')
//       }

//       const uploadedSong = await response.json()
//       setSongs([...songs, uploadedSong])
//       setNewSong({ name: '', image: null, audio: null, video_url: '', imagePreview: null })
//       setIsUploadModalOpen(false)
//     } catch (error) {
//       console.error('Error uploading song:', error)
//       alert('Có lỗi xảy ra khi tải bài hát lên. Vui lòng thử lại!')
//     }
//   }

//   const handleEditSong = async () => {
//     if (!editingSong.name) {
//       alert('Vui lòng nhập tên bài hát!')
//       return
//     }

//     const formData = new FormData()
//     formData.append('name', editingSong.name)
//     if (editingSong.image && typeof editingSong.image !== 'string') {
//       formData.append('image', editingSong.image)
//     }
//     if (editingSong.audio && typeof editingSong.audio !== 'string') {
//       formData.append('audio', editingSong.audio)
//     }
//     formData.append('video_url', editingSong.video_url)

//     try {
//       const response = await fetch(`/api/songs/${editingSong.id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': 'Bearer your-token-here',
//         },
//         body: formData,
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update song')
//       }

//       const updatedSong = await response.json()
//       setSongs(songs.map(song => (song.id === updatedSong.id ? updatedSong : song)))
//       setEditingSong(null)
//       setIsEditModalOpen(false)
//     } catch (error) {
//       console.error('Error updating song:', error)
//       alert('Có lỗi xảy ra khi cập nhật bài hát. Vui lòng thử lại!')
//     }
//   }

//   const handleDeleteSong = async (songId) => {
//     if (!confirm('Bạn có chắc muốn xóa bài hát này?')) return

//     try {
//       const response = await fetch(`/api/songs/${songId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': 'Bearer your-token-here',
//         },
//       })

//       if (!response.ok) {
//         throw new Error('Failed to delete song')
//       }

//       setSongs(songs.filter(song => song.id !== songId))
//     } catch (error) {
//       console.error('Error deleting song:', error)
//       alert('Có lỗi xảy ra khi xóa bài hát. Vui lòng thử lại!')
//     }
//   }

//   return (
//     <div>
//       <h1 className="text-3xl text-white font-semibold mb-6">Quản Lý Bài Hát</h1>
//       <button
//         onClick={() => setIsUploadModalOpen(true)}
//         className="mb-4 flex items-center space-x-2 bg-spotify-base text-black px-4 py-2 rounded hover:bg-spotify-highlight"
//       >
//         <Plus size={20} />
//         <span>Tải Bài Hát Lên</span>
//       </button>
//       <div className="space-y-4">
//         {songs.map(song => (
//           <div key={song.id} className="bg-[#1a1a1a] p-4 rounded-lg flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <img src={song.image_url} alt={song.name} className="w-12 h-12 rounded" />
//               <div>
//                 <h3 className="text-white font-semibold">{song.name}</h3>
//                 <div className="flex space-x-2">
//                   <a href={song.audio_url} className="text-spotify-green">Nghe</a>
//                   {song.video_url && (
//                     <a href={song.video_url} className="text-spotify-green">Xem Video</a>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => {
//                   setEditingSong({ ...song, image: null, audio: null, imagePreview: song.image_url })
//                   setIsEditModalOpen(true)
//                 }}
//                 className="p-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
//               >
//                 <Edit size={16} />
//               </button>
//               <button
//                 onClick={() => handleDeleteSong(song.id)}
//                 className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal tải bài hát */}
//       {isUploadModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div
//             className="absolute inset-0 bg-black"
//             style={{ opacity: 0.1 }}
//             onClick={() => setIsUploadModalOpen(false)}
//           ></div>
//           <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg relative w-full max-w-md">
//             <button
//               onClick={() => setIsUploadModalOpen(false)}
//               className="absolute top-2 right-2 text-white hover:text-gray-300"
//             >
//               <X size={24} />
//             </button>
//             <h2 className="text-2xl text-white font-semibold mb-4">Tải Bài Hát Lên</h2>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="song_name" className="block text-white mb-1">
//                   Tên Bài Hát
//                 </label>
//                 <input
//                   type="text"
//                   id="song_name"
//                   value={newSong.name}
//                   onChange={(e) => setNewSong({ ...newSong, name: e.target.value })}
//                   className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//                   placeholder="Nhập tên bài hát"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="song_image" className="block text-white mb-1">
//                   Hình Ảnh
//                 </label>
//                 <input
//                   type="file"
//                   id="song_image"
//                   accept="image/*"
//                   onChange={(e) => handleImageChange(e, setNewSong, 'image')}
//                   className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//                 />
//                 {newSong.imagePreview && (
//                   <div className="mt-2">
//                     <img src={newSong.imagePreview} alt="Preview" className="w-24 h-24 rounded object-cover" />
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="song_audio" className="block text-white mb-1">
//                   File Âm Thanh
//                 </label>
//                 <input
//                   type="file"
//                   id="song_audio"
//                   accept="audio/*"
//                   onChange={(e) => setNewSong({ ...newSong, audio: e.target.files[0] })}
//                   className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="song_video_url" className="block text-white mb-1">
//                   Link Video (MP4)
//                 </label>
//                 <input
//                   type="text"
//                   id="song_video_url"
//                   value={newSong.video_url}
//                   onChange={(e) => setNewSong({ ...newSong, video_url: e.target.value })}
//                   className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//                   placeholder="Nhập link MP4 (tùy chọn)"
//                 />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end space-x-2">
//               <button
//                 onClick={() => setIsUploadModalOpen(false)}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={handleUploadSong}
//                 className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
//               >
//                 Tải Lên
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal chỉnh sửa bài hát */}
//       {isEditModalOpen && editingSong && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div
//             className="absolute inset-0 bg-black"
//             style={{ opacity: 0.1 }}
//             onClick={() => setIsEditModalOpen(false)}
//           ></div>
//           <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg relative w-full max-w-md">
//             <button
//               onClick={() => setIsEditModalOpen(false)}
//               className="absolute top-2 right-2 text-white hover:text-gray-300"
//             >
//               <X size={24} />
//             </button>
//             <h2 className="text-2xl text-white font-semibold mb-4">Chỉnh Sửa Bài Hát</h2>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="edit_song_name" className="block text-white mb-1">
//                   Tên Bài Hát
//                 </label>
//                 <input
//                   type="text"
//                   id="edit_song_name"
//                   value={editingSong.name}
//                   onChange={(e) => setEditingSong({ ...editingSong, name: e.target.value })}
//                   className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//                   placeholder="Nhập tên bài hát"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="edit_song_image" className="block text-white mb-1">
//                   Hình Ảnh
//                 </label>
//                 <input
//                   type="file"
//                   id="edit_song_image"
//                   accept="image/*"
//                   onChange={(e) => handleImageChange(e, setEditingSong, 'image')}
//                   className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//                 />
//                 {editingSong.imagePreview && (
//                   <div className="mt-2">
//                     <img src={editingSong.imagePreview} alt="Preview" className="w-24 h-24 rounded object-cover" />
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="edit_song_audio" className="block text-white mb-1">
//                   File Âm Thanh
//                 </label>
//                 <input
//                   type="file"
//                   id="edit_song_audio"
//                   accept="audio/*"
//                   onChange={(e) => setEditingSong({ ...editingSong, audio: e.target.files[0] })}
//                   className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="edit_song_video_url" className="block text-white mb-1">
//                   Link Video (MP4)
//                 </label>
//                 <input
//                   type="text"
//                   id="edit_song_video_url"
//                   value={editingSong.video_url}
//                   onChange={(e) => setEditingSong({ ...editingSong, video_url: e.target.value })}
//                   className="w-full p-2 rounded bg-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
//                   placeholder="Nhập link MP4 (tùy chọn)"
//                 />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end space-x-2">
//               <button
//                 onClick={() => setIsEditModalOpen(false)}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={handleEditSong}
//                 className="px-4 py-2 bg-spotify-base text-black rounded hover:bg-spotify-highlight"
//               >
//                 Lưu
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // Component chính
// function ProfileManagement() {
//   const { currentUser } = useContext(UserContext)
//   const [activeTab, setActiveTab] = useState('profile')

//   const isArtist = currentUser.role_id === 2

//   return (
//     <div className="min-h-screen bg-[#121212] flex">
//       {/* Sidebar quản lý */}
//       <motion.div
//         className="w-64 bg-[#1a1a1a] p-4 flex flex-col border-r border-gray-700"
//         initial={{ width: 64 }}
//         animate={{ width: 256 }}
//       >
//         <h2 className="text-xl text-white font-semibold mb-6">Quản Lý Tài Khoản</h2>
//         <nav className="flex-1">
//           <ul className="space-y-2">
//             <li>
//               <button
//                 onClick={() => setActiveTab('profile')}
//                 className={`flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a] ${
//                   activeTab === 'profile' ? 'bg-[#2a2a2a]' : ''
//                 }`}
//               >
//                 <User size={20} />
//                 <span>Chỉnh Sửa Thông Tin</span>
//               </button>
//             </li>
//             {isArtist && (
//               <>
//                 <li>
//                   <button
//                     onClick={() => setActiveTab('albums')}
//                     className={`flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a] ${
//                       activeTab === 'albums' ? 'bg-[#2a2a2a]' : ''
//                     }`}
//                   >
//                     <Album size={20} />
//                     <span>Quản Lý Album</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => setActiveTab('songs')}
//                     className={`flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a] ${
//                       activeTab === 'songs' ? 'bg-[#2a2a2a]' : ''
//                     }`}
//                   >
//                     <Music size={20} />
//                     <span>Quản Lý Bài Hát</span>
//                   </button>
//                 </li>
//               </>
//             )}
//             <li>
//               <button
//                 onClick={() => alert('Đăng xuất thành công!')}
//                 className="flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a]"
//               >
//                 <LogOut size={20} />
//                 <span>Đăng Xuất</span>
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </motion.div>

//       {/* Content */}
//       <div className="flex-1 p-6 overflow-y-auto">
//         {activeTab === 'profile' && <ProfileTab />}
//         {activeTab === 'albums' && isArtist && <AlbumsTab />}
//         {activeTab === 'songs' && isArtist && <SongsTab />}
//       </div>
//     </div>
//   )
// }

// // Wrap component chính với UserProvider
// export default function ProfileManagementWrapper() {
//   return (
//     <UserProvider>
//       <ProfileManagement />
//     </UserProvider>
//   )
// }