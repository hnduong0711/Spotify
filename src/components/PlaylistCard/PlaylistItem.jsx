import { useNavigate } from 'react-router-dom'

function PlaylistItem({ playlist }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/playlist/${playlist.id}`)
  }

  return (
    <div className="px-2">
      <div
        className="bg-[#282828] rounded-lg p-4 cursor-pointer hover:bg-[#3E3E3E] transition"
        onClick={handleClick}
      >
        <img src={playlist.image} alt={playlist.name} className="w-full h-40 object-cover rounded" />
        <p className="mt-2 text-sm font-semibold">{playlist.name}</p>
      </div>
    </div>
  )
}

export default PlaylistItem