import Slider from 'react-slick'
import { motion } from 'framer-motion'

function HomePage() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Giữ 4 slide hiển thị
    slidesToScroll: 1,
    arrows: true,
  }

  const playlists = [
    { id: 1, name: 'RapViet for life', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Chill Hits', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Pop Vibes', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Rock Classics', image: 'https://via.placeholder.com/150' },
  ]

  return (
    <div className="rounded-r-lg overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-6">Good Evening</h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
        <Slider {...settings}>
          {playlists.map(playlist => (
            <div key={playlist.id} className="px-2">
              <div className="bg-[#282828] rounded-lg p-4">
                <img src={playlist.image} alt={playlist.name} className="w-full h-40 object-cover rounded" />
                <p className="mt-2 text-sm font-semibold">{playlist.name}</p>
              </div>
            </div>
          ))}
        </Slider>
      </motion.div>
    </div>
  )
}

export default HomePage