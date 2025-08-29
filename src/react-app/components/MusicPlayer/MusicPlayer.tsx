import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';

interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  cover?: string;
}

interface MusicPlayerProps {
  autoPlaySongId?: string;
  playlist?: Song[];
}

const defaultPlaylist: Song[] = [
  {
    id: '2728105200',
    name: 'Starmine',
    artist: '网易云音乐',
    album: '默认专辑',
    duration: 240,
    url: '#', // 临时替换为本地占位符
    cover: '/images/default-album.jpg'
  }
];

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  autoPlaySongId = '2728105200',
  playlist = defaultPlaylist
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const finalPlaylist = React.useMemo(() => {
    return playlist.length > 0 ? playlist : defaultPlaylist;
  }, [playlist]);

  useEffect(() => {
    // 自动播放指定歌曲
    const autoPlaySong = finalPlaylist.find(song => song.id === autoPlaySongId);
    if (autoPlaySong) {
      setCurrentSong(autoPlaySong);
      setIsLoading(false);
      // 由于浏览器限制，需要用户交互才能自动播放
      // 这里只是准备好歌曲，实际播放需要用户点击
    } else if (finalPlaylist.length > 0) {
      setCurrentSong(finalPlaylist[0]);
      setIsLoading(false);
    }
  }, [autoPlaySongId, finalPlaylist]);

  const togglePlay = () => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // 对于网易云音乐链接，我们需要特殊处理
        if (currentSong.url.includes('music.163.com')) {
          // 打开网易云音乐页面
          window.open(currentSong.url, '_blank');
          return;
        }
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const selectSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(false);
    setShowPlaylist(false);
  };

  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  if (isLoading) {
    return (
      <div className="music-player-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="music-player-container">
      <div className="player-circle" onClick={togglePlay}>
        <div className="player-content">
          <div className="album-cover">
            {currentSong?.cover && (
              <img src={currentSong.cover} alt="Album Cover" />
            )}
          </div>
          <div className="player-controls">
            <button className="play-btn">
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="white"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                </svg>
              )}
            </button>
          </div>
          <div className="song-info">
            <div className="song-title">{currentSong?.name || 'Loading...'}</div>
            <div className="artist-name">{currentSong?.artist || '网易云音乐'}</div>
          </div>
        </div>
      </div>

      {/* 播放列表按钮 */}
      <button className="playlist-btn" onClick={togglePlaylist}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 6H21V8H3V6ZM3 11H21V13H3V11ZM3 16H21V18H3V16Z" fill="white"/>
        </svg>
      </button>

      {/* 播放列表 */}
      {showPlaylist && (
        <div className="playlist-container">
          <div className="playlist-header">
            <h3>播放列表</h3>
            <button className="close-btn" onClick={() => setShowPlaylist(false)}>
              ×
            </button>
          </div>
          <div className="playlist-items">
            {finalPlaylist.map((song) => (
              <div 
                key={song.id}
                className={`playlist-item ${currentSong?.id === song.id ? 'active' : ''}`}
                onClick={() => selectSong(song)}
              >
                <div className="song-info-item">
                  <div className="song-name">{song.name}</div>
                  <div className="artist-name">{song.artist}</div>
                </div>
                <div className="song-duration">
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 音频元素 */}
      <audio 
        ref={audioRef}
        src={currentSong?.url}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default MusicPlayer;