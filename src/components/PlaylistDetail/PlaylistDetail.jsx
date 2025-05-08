import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Plus, Clock } from "lucide-react";
import axios from "axios";
import { usePlayer } from "../../context/PlayerContext";

function PlaylistDetail() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const { playSong } = usePlayer();
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const headerRef = useRef(null);
  const [playlist, setPlaylist] = useState({
    id: id,
    name: "",
    description: "",
    image: "",
    creator: "",
    songs: 0,
    duration: "",
    tracks: [],
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const userId = user.id || 0;
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setShowFixedHeader(headerBottom <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let playlistResponse;
        if (type === "album") {
          playlistResponse = await axios.get(
            `http://localhost:8000/api/album/${id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } else if (type === "playlist") {
          playlistResponse = await axios.get(
            `http://localhost:8000/api/playlist/${id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        }
        const playlistName = playlistResponse.data.name;

        let songsResponse;
        if (type === "album") {
          songsResponse = await axios.get(
            `http://localhost:8000/api/album-song/album/${id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } else if (type === "playlist") {
          songsResponse = await axios.get(
            `http://localhost:8000/api/playlist-song/playlist/${id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        }
        console.log(`Songs data from API:`, songsResponse.data);

        const songsData = songsResponse.data;
        const totalDuration = songsData.reduce((acc, item) => {
          const song = item.song;
          return acc + (song.duration || 0);
        }, 0);
        const hours = Math.floor(totalDuration / 3600);
        const minutes = Math.floor((totalDuration % 3600) / 60);
        const durationStr =
          hours > 0
            ? `khoảng ${hours} giờ ${minutes} phút`
            : `khoảng ${minutes} phút`;

        const tracks = songsData.map((item, index) => ({
          id: item.song.id,
          title: item.song.name,
          artists: item.song.artist.name,
          album:
            type === "album"
              ? playlistName || "Không có thông tin album"
              : "Playlist tự tạo",
          duration: new Date((item.song.duration || 0) * 1000)
            .toISOString()
            .substr(14, 5),
          image: item.song.image_url || "https://www.svgrepo.com/download/2225/music.svg",
          audioUrl: item.song.audio_url || "",
          videoUrl: item.song.video_url || "",
        }));
        console.log("Mapped tracks:", tracks);

        setPlaylist({
          id,
          name: playlistName || "Không có tên",
          description:
            type === "album" ? "Album công khai" : "Danh sách phát công khai",
          image:
            songsData[0]?.song?.image_url || "https://www.svgrepo.com/download/2225/music.svg",
          creator: type === "album" ? "Admin" : user.username || "Người dùng",
          songs: songsData.length,
          duration: durationStr,
          tracks,
        });
      } catch (error) {
        console.error(`Error fetching data for ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type, accessToken, user.username]);

  const handlePlaySong = (track, index) => {
    console.log(
      "Playing track:",
      track.title,
      "at index:",
      index,
      "with playlist:",
      playlist.tracks
    );
    playSong(track, playlist.tracks, index);
    navigate(`/song/${track.id}`);
  };

  console.log("Playlist state:", playlist);

  if (loading) {
    return <div className="text-white text-center mt-10">Đang tải...</div>;
  }

  return (
    <div className="bg-gradient-to-b from-[#1a6a6a] to-[#1a1a1a] min-h-screen">
      {showFixedHeader && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#1a1a1a] p-4 flex items-center space-x-4">
          <button className="bg-spotify-base text-black rounded-full p-2 hover:bg-spotify-highlight">
            <Play size={16} fill="black" />
          </button>
          <h1 className="text-xl font-bold text-white">{playlist.name}</h1>
        </div>
      )}

      <div ref={headerRef} className="p-6 flex items-end space-x-6">
        <img
          src={playlist.image}
          alt={playlist.name}
          className="w-60 h-60 rounded shadow-lg"
        />
        <div>
          <p className="text-sm text-gray-300">
            {type === "album" ? "Album công khai" : "Danh sách phát công khai"}
          </p>
          <h1 className="text-6xl font-bold text-white mt-2">
            {playlist.name}
          </h1>
          <p className="text-gray-300 mt-2">{playlist.description}</p>
          <p className="text-gray-300 mt-2">
            <span className="font-semibold text-white">{playlist.creator}</span>{" "}
            • {playlist.songs} bài hát, {playlist.duration}
          </p>
        </div>
      </div>

      <div className="p-6 flex items-center space-x-4 bg-[#1a1a1a] bg-opacity-70">
        <div className="relative group">
          <button className="bg-spotify-base text-black rounded-full p-4 hover:bg-spotify-highlight">
            <Play size={24} fill="black" />
          </button>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
            Phát danh sách
          </span>
        </div>
        {type === "album" && (
          <div className="relative group">
            <button className="text-gray-400 hover:text-white">
              <Plus size={24} />
            </button>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Lưu vào thư viện của bạn
            </span>
          </div>
        )}
      </div>

      <div className="p-6 bg-[#1a1a1a]">
        <div className="grid grid-cols-12 gap-4 text-gray-400 border-b border-gray-700 pb-2">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Tiêu đề</div>
          <div className="col-span-4">Album</div>
          <div className="col-span-2 flex justify-end">
            <Clock size={16} />
          </div>
        </div>
        {playlist.tracks.map((track, index) => (
          <div
            key={track.id}
            className="grid grid-cols-12 gap-4 py-2 hover:bg-[#2a2a2a] rounded transition cursor-pointer"
            onClick={() => handlePlaySong(track, index)}
          >
            <div className="col-span-1 text-gray-400">{index + 1}</div>
            <div className="col-span-5 flex items-center space-x-4">
              <img
                src={track.image}
                alt={track.title}
                className="w-10 h-10 rounded"
              />
              <div>
                <p className="text-white">{track.title}</p>
                <p className="text-gray-400 text-sm">{track.artists}</p>
              </div>
            </div>
            <div className="col-span-4 text-gray-400">{track.album}</div>
            <div className="col-span-2 text-gray-400 text-right">
              {track.duration}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistDetail;
