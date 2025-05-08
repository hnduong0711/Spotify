import { useState, useEffect } from "react";
import axios from "axios";
import PlaylistCardList from "../components/PlaylistCard/PlaylistCardList";

function Homepage() {
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const userId = user.id || 0;
  const accessToken = localStorage.getItem("accessToken");

  // Lấy danh sách album
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/album", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setAlbums(response.data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };
    fetchAlbums();
  }, []);

  // Lấy danh sách playlist của user
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/playlist/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPlaylists(response.data);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };
    fetchPlaylists();
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#121212] p-6 flex flex-col">

      <PlaylistCardList title="Danh sách đề cử" data={albums} type={"album"} />
      <PlaylistCardList title="Danh sách phát của bạn" data={playlists} type={"playlist"} />
    </div>
  );
}

export default Homepage;
