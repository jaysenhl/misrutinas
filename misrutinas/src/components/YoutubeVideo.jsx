import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff, MdSearch, MdPlayCircle } from 'react-icons/md';
import axios from 'axios';
import '../styles/YoutubeVideo.css';

const YOUTUBE_API_KEY = 'AIzaSyBbFgHQRCewGLmkCAew516Q1n2OL0EufT4'; // Necesitarás una API key de YouTube
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

const YoutubeVideo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.get(YOUTUBE_API_URL, {
        params: {
          part: 'snippet',
          maxResults: 5,
          key: YOUTUBE_API_KEY,
          q: searchTerm,
          type: 'video'
        }
      });

      setVideos(response.data.items);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
    setIsLoading(false);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div className="youtube-section">
      <div className="youtube-header">
        <h2>
          <MdPlayCircle className="header-icon" />
          Ver Youtube
        </h2>
        <button 
          className="toggle-youtube-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <MdVisibilityOff className="btn-icon" />
              <span className="btn-text">Ocultar</span>
            </>
          ) : (
            <>
              <MdVisibility className="btn-icon" />
              <span className="btn-text">Mostrar</span>
            </>
          )}
        </button>
      </div>

      <div className={`youtube-content ${isExpanded ? 'expanded' : ''}`}>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar videos..."
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <MdSearch />
            </button>
          </div>
        </form>

        <div className="video-container">
          {selectedVideo && (
            <div className="selected-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="video-list">
            {isLoading ? (
              <div className="loading">Buscando videos...</div>
            ) : (
              videos.map((video) => (
                <div
                  key={video.id.videoId}
                  className="video-item"
                  onClick={() => handleVideoSelect(video)}
                >
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                  />
                  <div className="video-info">
                    <h3>{video.snippet.title}</h3>
                    <p>{video.snippet.channelTitle}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubeVideo; 