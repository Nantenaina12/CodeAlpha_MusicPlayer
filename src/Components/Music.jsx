
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Music() {
  const [musics, setMusics] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);

  // Charger les musiques depuis l'API
  useEffect(() => {
    axios
      .get("https://api.npoint.io/76e1477f2f448c35503a")
      .then((res) => {
        console.log("Musiques chargées :", res.data);
        setMusics(res.data);
      })
      .catch((error) => {
        console.error("Erreur API :", error);
      });
  }, []);

  // Lire ou mettre en pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) =>
        console.warn("Lecture bloquée par le navigateur :", err)
      );
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentIndex]);

  // Lecture auto quand on change de chanson
  useEffect(() => {
    if (musics.length > 0 && isPlaying) {
      audioRef.current.play();
    }
  }, [currentIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextSong = () => {
    setCurrentIndex((prev) => (prev + 1) % musics.length);
    setIsPlaying(true); // auto-play
  };

  const prevSong = () => {
    setCurrentIndex((prev) => (prev - 1 + musics.length) % musics.length);
    setIsPlaying(true); // auto-play
  };

  // Quand la musique est chargée
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  // Mise à jour du temps
  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    setCurrentTime(current);
    setProgress((current / duration) * 100);
  };

  // Avancer/Reculer
  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  // Format mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return musics.length > 0 ? (
    <div className="music-player" style={{ textAlign: "center" }}>
      <h2>{musics[currentIndex].title}</h2>
      <p>{musics[currentIndex].artist}</p>

      {musics[currentIndex].cover && (
        <img
          src={musics[currentIndex].cover}
          alt={musics[currentIndex].title}
          width="200"
          style={{ borderRadius: "10px" }}
        />
      )}

      <audio
        ref={audioRef}
        src={musics[currentIndex].url}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong} // ✅ passe à la suivante automatiquement
      />

      {/* Barre de progression */}
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
        style={{ width: "80%", marginTop: "10px" }}
      />

      {/* Temps écoulé / total */}
      <div>
        <span>{formatTime(currentTime)}</span> /{" "}
        <span>{formatTime(duration)}</span>
      </div>

      {/* Boutons */}
      <div className="controls" style={{ marginTop: "10px" }}>
        <button onClick={prevSong}>⏮</button>
        <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶️"}</button>
        <button onClick={nextSong}>⏭</button>
      </div>
    </div>
  ) : (
    <p>Chargement des musiques...</p>
  );
}
