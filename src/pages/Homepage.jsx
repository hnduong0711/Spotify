import { motion } from 'framer-motion'
import PlaylistCardList from '../components/PlaylistCard/PlaylistCardList'

function HomePage() {
  const playlists1 = [
    { id: 1, name: 'RapViet for life', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Chill Hits', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Pop Vibes', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Rock Classics', image: 'https://via.placeholder.com/150' },
  ]

  const playlists2 = [
    { id: 5, name: 'Top Hits 2023', image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Indie Mix', image: 'https://via.placeholder.com/150' },
    { id: 7, name: 'Jazz Vibes', image: 'https://via.placeholder.com/150' },
    { id: 8, name: 'Classical Essentials', image: 'https://via.placeholder.com/150' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-r-lg overflow-x-hidden"
    >
      <h1 className="text-2xl font-bold mb-6">Good Evening</h1>
      <PlaylistCardList title="Your Playlists" data={playlists1} />
      <PlaylistCardList title="Recommended for You" data={playlists2} />
    </motion.div>
  )
}

export default HomePage