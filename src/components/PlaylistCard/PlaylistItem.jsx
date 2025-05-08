import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PlaylistItem({ playlist, type }) {
  const navigate = useNavigate()
  const [firstSong, setFirstSong] = useState(null)
  const token = localStorage.getItem('accessToken')

  useEffect(() => {
    const fetchFirstSong = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/${type}-song/${type}/${playlist.id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        
        setFirstSong(response.data[0].song)
      } catch (error) {
        console.error('Error fetching first song:', error)
      }
    }
    fetchFirstSong()
  }, [])
  
  const handleClick = () => {
    if (type === 'album') {
      navigate(`/${type}/${playlist.id}`)
    } else if (type === 'playlist') {
      navigate(`/${type}/${playlist.id}`)
    }
  }

  if(firstSong === null) return (
    <div className="bg-[#282828] rounded-lg p-4 cursor-pointer">
      <div className="w-full h-40 bg-gray-600 rounded"><img src={playlist.image_url || "https://i.pinimg.com/736x/ec/e4/b5/ece4b597f82c0970b9a92ac5d9207701.jpg"} alt={playlist.name} className="w-full h-40 object-cover rounded" /></div>
      <p className="mt-2 text-sm font-semibold w-1/2 h-4 rounded">{playlist.name}</p>
    </div>
  )

  return (
    <div className="px-2">
      <div
        className="bg-[#282828] rounded-lg p-4 cursor-pointer hover:bg-[#3E3E3E] transition"
        onClick={handleClick}
      >
        <img src={playlist.image_url || firstSong.image_url} alt={playlist.name} className="w-full h-40 object-cover rounded" />
        <p className="mt-2 text-sm font-semibold">{playlist.name}</p>
      </div>
    </div>
  )
}

export default PlaylistItem