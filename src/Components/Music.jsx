import React from 'react'
import { useState, useEffect, useRef } from "react";
import axios from 'axios';

export default function Music() {
    const [musics, setMusics] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    // Charger les musiques depuis une API
    useEffect(() => {
       axios
      .get("https://api.npoint.io/af281e3b67e5e3a1c1f6")
      .then((res) => {
        setMusics(res.data);
      })
      .catch((error) => {
        console.error("Erreur lors de l'appel de la musique :", error);
      });
  }, []);
    // Lecture automatique si musique chargée
    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentIndex]);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const nextSong = () =>
        setCurrentIndex((prev) => (prev + 1) % musics.length);

    const prevSong = () =>
        setCurrentIndex((prev) => (prev - 1 + musics.length) % musics.length);
    const formatTime = (time) => {

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
      


  return (
    <div>

    </div>
  )
}
