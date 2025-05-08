import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from "../../context/PlayerContext";

function SearchResult() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const query = searchParams.get('q') || '';
  const { playSong } = usePlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/song', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setSongs(response.data);
        setFilteredSongs(response.data);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const filterResults = () => {
      if (!query) {
        setFilteredSongs(songs);
        return;
      }
      const searchQuery = query.toLowerCase();
      const results = songs.filter(song => {
        const matchesSong = song.name.toLowerCase().includes(searchQuery);
        const matchesArtist = song.artist.name.toLowerCase().includes(searchQuery);
        return matchesSong || matchesArtist;
      });
      setFilteredSongs(results);
    };
    filterResults();
  }, [query, songs]);

  const handleSongClick = async (songId) => {
    const selectedSong = filteredSongs.find(song => song.id === songId);
    if (!selectedSong) return;

    // Ánh xạ dữ liệu API sang định dạng mà PlayerContext mong đợi
    const mappedSelectedSong = {
      id: selectedSong.id,
      title: selectedSong.name,
      audioUrl: selectedSong.audio_url,
      videoUrl: selectedSong.video_url,
      image: selectedSong.image_url,
      artists: selectedSong.artist.name,
      duration: selectedSong.duration,
    };

    if (filteredSongs.length === 1) {
      try {
        const artistId = selectedSong.artist.id;
        const response = await axios.get(`http://localhost:8000/api/song/artist/${artistId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const artistSongs = response.data.map(song => ({
          id: song.id,
          title: song.name,
          audioUrl: song.audio_url,
          videoUrl: song.video_url,
          image: song.image_url,
          artists: song.artist.name,
          duration: song.duration,
        }));
        const index = artistSongs.findIndex(song => song.id === selectedSong.id);
        playSong(mappedSelectedSong, artistSongs, index);
      } catch (error) {
        console.error('Error fetching artist songs:', error);
        playSong(mappedSelectedSong, [mappedSelectedSong], 0); // Fallback nếu API lỗi
      }
    } else {
      const mappedSongs = filteredSongs.map(song => ({
        id: song.id,
        title: song.name,
        audioUrl: song.audio_url,
        videoUrl: song.video_url,
        image: song.image_url,
        artists: song.artist.name,
        duration: song.duration,
      }));
      const index = mappedSongs.findIndex(song => song.id === selectedSong.id);
      playSong(mappedSelectedSong, mappedSongs, index);
    }
    navigate(`/song/${selectedSong.id}`);
  };

  return (
    <div className="bg-[#121212] min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Kết quả tìm kiếm</h1>
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setSearchParams({ q: e.target.value })}
          placeholder="Tìm theo tên bài hát hoặc nghệ sĩ..."
          className="w-full p-2 rounded bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Bài hát</h2>
        <ul className="space-y-2">
          {filteredSongs.map((song) => (
            <li
              key={song.id}
              className="flex items-center justify-between p-2 hover:bg-white/10 rounded cursor-pointer"
              onClick={() => handleSongClick(song.id)}
            >
              <div className="flex items-center space-x-4">
                <img src={song.image_url} alt={song.name} className="w-12 h-12 rounded" />
                <div>
                  <p className="font-medium">{song.name}</p>
                  <p className="text-gray-400 text-sm">{song.artist.name}</p>
                </div>
              </div>
              <span className="text-gray-400">{(song.duration / 60).toFixed(2)} phút</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchResult;