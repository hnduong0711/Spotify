import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from "../../context/PlayerContext";
import { Plus, Heart } from 'lucide-react';
import { toast } from 'react-toastify';

function SearchResult() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState({});
  const query = searchParams.get('q') || '';
  const { playSong } = usePlayer();

  const user = JSON.parse(localStorage.getItem('currentUser')) || {};
  const userId = user.id || 0;
  const accessToken = localStorage.getItem('accessToken');

  // Lấy danh sách bài hát
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/song', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSongs(response.data);
        setFilteredSongs(response.data);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };
    fetchSongs();
  }, [accessToken]);

  // Lọc bài hát theo query
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

  // Lấy danh sách phát của người dùng
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/playlist/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };
    fetchPlaylists();
  }, [userId, accessToken]);

  // Lấy danh sách bài hát yêu thích
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/favourite-song/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setFavouriteSongs(response.data.map(item => item.song.id));
      } catch (error) {
        console.error('Error fetching favourite songs:', error);
      }
    };
    fetchFavourites();
  }, [userId, accessToken]);

  // Lấy danh sách bài hát trong mỗi playlist
  useEffect(() => {
    const fetchPlaylistSongs = async () => {
      const songMap = {};
      for (const playlist of playlists) {
        try {
          const response = await axios.get(`http://localhost:8000/api/playlist-song/playlist/${playlist.id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          songMap[playlist.id] = response.data.map(item => item.song_id);
        } catch (error) {
          console.error(`Error fetching songs for playlist ${playlist.id}:`, error);
        }
      }
      setPlaylistSongs(songMap);
    };
    if (playlists.length > 0) fetchPlaylistSongs();
  }, [playlists, accessToken]);

  // Xử lý click vào bài hát
  const handleSongClick = async (songId) => {
    const selectedSong = filteredSongs.find(song => song.id === songId);
    if (!selectedSong) return;

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
            Authorization: `Bearer ${accessToken}`,
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
        playSong(mappedSelectedSong, [mappedSelectedSong], 0);
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

  // Xử lý thêm/xóa bài hát khỏi danh sách phát
  const handleTogglePlaylistSong = async (playlistId, songId) => {
    const isInPlaylist = playlistSongs[playlistId]?.includes(songId);
    try {
      if (isInPlaylist) {
        await axios.delete(`http://localhost:8000/api/playlist-song/playlist/${playlistId}/song/${songId}/delete`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPlaylistSongs({
          ...playlistSongs,
          [playlistId]: playlistSongs[playlistId].filter(id => id !== songId),
        });
        toast.success('Đã xóa khỏi danh sách thành công!');
      } else {
        await axios.post('http://localhost:8000/api/playlist-song/create', {
          playlist: playlistId,
          song_id: songId,
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setPlaylistSongs({
          ...playlistSongs,
          [playlistId]: [...(playlistSongs[playlistId] || []), songId],
        });
        toast.success('Thêm vào danh sách thành công!');
      }
    } catch (error) {
      console.error('Error toggling playlist song:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  // Xử lý thích/xóa khỏi danh sách yêu thích
  const handleToggleFavourite = async (songId) => {
    const isFavourited = favouriteSongs.includes(songId);
    try {
      if (isFavourited) {
        await axios.delete(`http://localhost:8000/api/favourite-song/${songId}/delete`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setFavouriteSongs(favouriteSongs.filter(id => id !== songId));
      } else {
        await axios.post('http://localhost:8000/api/favourite-song/create', {
          user: userId,
          song_id: songId,
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setFavouriteSongs([...favouriteSongs, songId]);
      }
    } catch (error) {
      console.error('Error toggling favourite:', error);
      toast.error('Có lỗi xảy ra khi cập nhật danh sách yêu thích!');
    }
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
              className="flex items-center justify-between p-2 hover:bg-white/10 rounded relative"
            >
              <div
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => handleSongClick(song.id)}
              >
                <img src={song.image_url} alt={song.name} className="w-12 h-12 rounded" />
                <div>
                  <p className="font-medium">{song.name}</p>
                  <p className="text-gray-400 text-sm">{song.artist.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">{(song.duration / 60).toFixed(2)} phút</span>
                <button
                  onClick={() => setShowPlaylistDropdown(showPlaylistDropdown === song.id ? null : song.id)}
                  className="text-gray-400 hover:text-white"
                >
                  <Plus size={20} />
                </button>
                <button
                  onClick={() => handleToggleFavourite(song.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Heart
                    size={20}
                    fill={favouriteSongs.includes(song.id) ? "red" : "none"}
                    stroke={favouriteSongs.includes(song.id) ? "red" : "currentColor"}
                  />
                </button>
              </div>
              {showPlaylistDropdown === song.id && (
                <div className="absolute right-0 top-12 bg-[#2a2a2a] rounded-lg shadow-lg z-10 w-48">
                  {playlists.length > 0 ? (
                    playlists.map(playlist => (
                      <button
                        key={playlist.id}
                        onClick={() => handleTogglePlaylistSong(playlist.id, song.id)}
                        className="flex items-center justify-between w-full text-left px-4 py-2 text-white hover:bg-spotify-base hover:text-black"
                      >
                        <span>{playlist.name}</span>
                        {playlistSongs[playlist.id]?.includes(song.id) && (
                          <span className="w-4 h-4 flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-gray-400">Không có danh sách phát</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchResult;