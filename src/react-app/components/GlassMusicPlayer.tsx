import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import './GlassMusicPlayer.css';
import config from '../config/config.json'
interface Position {
  x: number;
  y: number;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  file: string;
  duration?: number;
  lyrics?: string; // 添加歌词文件路径
}

interface Lyric {
  time: number;
  text: string;
}
interface LyricsContextType {
  currentLyric: string;
  nextLyric: string;
  isVisible: boolean;
  setCurrentLyric?: (lyric: string) => void;
  setNextLyric?: (lyric: string) => void;
  setIsVisible?: (visible: boolean) => void;
}
// 创建歌词上下文
export const LyricsContext = createContext<LyricsContextType>({ currentLyric: '', nextLyric: '', isVisible: true });


// 歌词提供组件
export const LyricsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentLyric, setCurrentLyric] = useState('');
  const [nextLyric, setNextLyric] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <LyricsContext.Provider value={{
      currentLyric,
      nextLyric,
      isVisible,
      setCurrentLyric,
      setNextLyric,
      setIsVisible
    }}>
      {children}
    </LyricsContext.Provider>
  );
};

// 歌词显示组件
export const LyricsDisplay: React.FC = () => {
  const { currentLyric, nextLyric, isVisible } = useContext(LyricsContext);
  
  if (!isVisible) return null;
  
  return (
    <div className="central-lyrics">
      <p className="current-lyric">{currentLyric}</p>
      <p className="next-lyric">{nextLyric}</p>
    </div>
  );
};

// 添加歌词解析函数
const parseLRC = (lrc: string) => {
  const lines = lrc.split('\n');
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  const lyrics: Lyric[] = [];

  lines.forEach(line => {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const milliseconds = parseInt(match[3]);
      const time = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(timeRegex, '').trim();
      if (text && !text.startsWith('[')) {
        lyrics.push({ time, text });
      }
    }
  });

  return lyrics;
};

const GlassMusicPlayer: React.FC = () => {
  // 状态管理
  const [position, setPosition] = useState<Position>({ x: window.innerWidth / 2 - 300, y: window.innerHeight - 220 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [bgColor, setBgColor] = useState('rgba(57, 57, 57, 0.5)');
  const [lyrics, setLyrics] = useState<{ time: number; text: string }[]>([]); 
  // 引用
  const playerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // 歌词上下文
  const lyricsContext = useContext(LyricsContext);
  // 歌曲列表 - 纯音乐版本和人声版本
  const songs: Song[] = config.assets.music.songs;
  // hasStartedPlayingステートを追加
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  // 自動再生機能を追加
  useEffect(() => {
    if (audioRef.current && !hasStartedPlaying) {
      const playAudio = async () => {
        try {
          // 先加载音频
          // 检查 audioRef.current 是否存在
          if (audioRef.current) {
            audioRef.current.load();
              // 设置音量
            audioRef.current.volume = volume;
            // 尝试播放
            const playPromise = audioRef.current.play();        
           if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
              setHasStartedPlaying(true);
            }).catch(error => {
              console.log('自动播放被阻止:', error);
              // 自动播放被阻止时，确保UI状态正确
              setIsPlaying(false);
            });
          }}
        } catch (error) {
          console.log('音频播放错误:', error);
          setIsPlaying(false);
        }
          
         
      };
      
      // 页面加载后少等待一下再尝试播放
      const timer = setTimeout(playAudio, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasStartedPlaying, volume]);


  useEffect(() => {
    const loadLyrics = async () => {
      console.log(songs[currentSongIndex].lyrics)
      if (!songs[currentSongIndex].lyrics || songs[currentSongIndex].lyrics === '' || songs[currentSongIndex].lyrics == null) { // 检查当前歌曲是否有歌词路径
        setLyrics([{time: 0, text: ''}]); // 如果没有歌词文件，清空歌词
        return;
      }
      try {
        const response = await fetch(songs[currentSongIndex].lyrics);
        const text = await response.text();
        const parsedLyrics = parseLRC(text);
        setLyrics(parsedLyrics);
      } catch (error) {
        console.error('Failed to load lyrics:', error);
        setLyrics([]); // 加载失败也清空歌词
      }
    };

    loadLyrics();
  }, [currentSongIndex, songs]); // 依赖currentSongIndex和songs，当歌曲切换时重新加载歌词

  
  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobileCheck);
      
      // 如果是移动设备，调整位置
      if (mobileCheck) {
        setPosition({ 
          x: window.innerWidth - 80, 
          y: window.innerHeight - 80 
        });
        setIsExpanded( true);
      }
    };
    
    checkMobile();
    
    // 从document.documentElement.dataset获取服务器端检测的设备类型
    if (document.documentElement.dataset.isMobile === 'true') {
      setIsMobile(true);
      setPosition({ 
        x: window.innerWidth - 80, 
        y: window.innerHeight - 80 
      });
      setIsExpanded(true);
    }
  }, []);
  
  // 窗口大小变化处理
  useEffect(() => {
    const handleResize = () => {
      
      // 始终保持在底部中间
      setPosition({
        x: window.innerWidth / 2 - (isExpanded ? 300 : 40),
        y: window.innerHeight - (isExpanded ? 220 : 100)
      });
      
      // 如果是移动设备，调整位置
      if (isMobile) {
        if (isExpanded) {
          setPosition({
            x: window.innerWidth / 2 - 160,
            y: window.innerHeight - 200
          });
        } else {
          
          setPosition({
            x: window.innerWidth - 80,
            y: window.innerHeight - 80
          });
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始调整
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, isExpanded]);
  

  
  // 切换播放器展开/折叠状态
  const toggleExpanded = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // 调整位置，始终保持在底部中间
    if (isMobile) {
      if (!isExpanded) {
        // 展开时居中显示
        setPosition({
          x: window.innerWidth / 2 - 160,
          y: window.innerHeight - 200
        });
      } else {
        // 折叠时靠右下角
        setPosition({
          x: window.innerWidth - 80,
          y: window.innerHeight - 80
        });
      }
    } else {
      // 非移动设备，始终保持在底部中间
      setPosition({
        x: window.innerWidth / 2 - (isExpanded ? 40 : 300),
        y: window.innerHeight - (isExpanded ? 100 : 220)
      });
    }
    
    setIsExpanded(!isExpanded);
  };
  
  // 切换播放/暂停状态
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      
      // 更新歌词显示状态
      if (lyricsContext.setIsVisible) {
        lyricsContext.setIsVisible(!isPlaying);
      }
    }
  };
  
  // 处理音频时间更新
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTimeValue = audioRef.current.currentTime;
      setCurrentTime(currentTimeValue);
      
      // 更新歌词显示
      const currentLyricItem = lyrics.find(lyric => 
        lyric.time <= currentTimeValue && 
        (!lyrics[lyrics.indexOf(lyric) + 1] || lyrics[lyrics.indexOf(lyric) + 1].time > currentTimeValue)
      );
      
      if (currentLyricItem) {
        const nextLyricItem = lyrics[lyrics.indexOf(currentLyricItem) + 1];
        
        if (lyricsContext.setCurrentLyric && lyricsContext.setNextLyric) {
          lyricsContext.setCurrentLyric(currentLyricItem.text);
          lyricsContext.setNextLyric(nextLyricItem ? nextLyricItem.text : '');
        }
      }
    }
  };
  
  // 处理音频元数据加载
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      
      // 更新当前歌曲的持续时间
      const updatedSongs = [...songs];
      updatedSongs[currentSongIndex].duration = audioRef.current.duration;
    }
  };
  
  // 处理进度条拖动
  const handleProgressBarClick = (e: React.MouseEvent) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const seekTime = clickPosition * duration;
      
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  

  
  // 切换歌曲
  const changeSong = (index: number) => {
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setIsPlaying(false);
    
    // 延迟一下再播放，确保音频已加载
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        
        // 更新歌词显示状态
        if (lyricsContext.setIsVisible) {
          lyricsContext.setIsVisible(true);
        }
      }
    }, 100);
    
    // 根据封面图片生成背景色
    generateBackgroundColor(songs[index].cover);
  };
  
  // 上一首歌曲
  const prevSong = () => {
    const newIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    changeSong(newIndex);
  };
  
  // 下一首歌曲
  const nextSong = () => {
    const newIndex = currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1;
    changeSong(newIndex);
  };
  
  // 格式化时间为 mm:ss 格式
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // 根据封面图片生成背景色
  const generateBackgroundColor = (imageSrc: string) => {
    // 这里简化处理，实际应用中可以使用canvas提取图片主色调
    // 这里使用一些预设的渐变色
    // const gradients = [
    //   'rgba(108, 99, 255, 0.5)',
    //   'rgba(255, 107, 107, 0.5)',
    //   'rgba(58, 205, 214, 0.5)',
    //   'rgba(255, 180, 95, 0.5)',
    //   'rgba(191, 85, 236, 0.5)'
    // ];
    
    // // 根据图片路径选择一个渐变色
    // const index = imageSrc.length % gradients.length;
    // setBgColor(gradients[index]);
  };
  
  // 初始化播放器 - 默认不自动播放
  useEffect(() => {
    generateBackgroundColor(songs[currentSongIndex].cover);
    setCurrentSongIndex(0); 
    setIsPlaying(false); 
    
    // 不再自动播放
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
    }
  }, []);
  
  // 当前歌曲
  const currentSong = songs[currentSongIndex];
  
  return (
    <div
      ref={playerRef}
      className={`glass-music-player ${isDragging ? 'dragging' : ''} ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        background: isExpanded ? `linear-gradient(135deg, ${bgColor}, rgba(0, 0, 0, 0.7))` : undefined
      }}
    >
      
      {isExpanded ? (
        <>
          <div className="album-cover" onClick={toggleExpanded}>
            <img 
              src={currentSong.cover} 
              alt={currentSong.title} 
              className={`album-cover-image ${isPlaying ? 'rotating' : ''}`} 
            />
            {/* 移除放大状态下的播放暂停标志 */}
          </div>
          
          <div className="player-controls">
            <div className="song-info">
              <h3 className="song-title">{currentSong.title}</h3>
              <p className="song-artist">{currentSong.artist}</p>
            </div>
            <div className="progress-container">
              <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div 
                ref={progressBarRef}
                className="progress-bar" 
                onClick={handleProgressBarClick}
              >
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
                <div 
                  className="progress-bar-handle" 
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="control-buttons">
              <button className="control-button" onClick={prevSong}>
                <img src={config.assets.icons.prev} alt="前の曲" style={{width: '32px', height: '32px'}} />
              </button>
              <button className="control-button play-button" onClick={togglePlayPause}>
                {isPlaying ? (
                  <img src={config.assets.icons.pause} alt="一時停止" style={{width: '50px', height: '50px'}} />
                ) : (
                  <img src={config.assets.icons.play} alt="再生" style={{width: '50px', height: '50px'}} />
                )}
              </button>
              <button className="control-button" onClick={nextSong}>
                <img src={config.assets.icons.next} alt="次の曲" style={{width: '32px', height: '32px'}} />
              </button>
            </div>
            
            {/* <div className="volume-container">
              <span className="volume-icon">
                {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </span>
              <div 
                ref={volumeBarRef}
                className="volume-slider" 
                onClick={handleVolumeChange}
              >
                <div 
                  className="volume-slider-fill" 
                  style={{ width: `${volume * 100}%` }}
                ></div>
              </div>
            </div> */}
            
            {/* <div className="playlist-toggle" onClick={togglePlaylist}>
              {isPlaylistOpen ? '▲ 隐藏播放列表' : '▼ 显示播放列表'}
            </div> */}
            
            {/* <div className={`playlist ${isPlaylistOpen ? 'open' : ''}`}>
              {songs.map((song, index) => (
                <div 
                  key={song.id}
                  className={`playlist-item ${index === currentSongIndex ? 'active' : ''}`}
                  onClick={() => changeSong(index)}
                >
                  <span className="playlist-item-title">{song.title}</span>
                  <span className="playlist-item-duration">
                    {song.duration ? formatTime(song.duration) : '--:--'}
                  </span>
                </div>
              ))}
            </div> */}
          </div>
        </>
      ) : (
        <div 
          onClick={toggleExpanded}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `url(${currentSong.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: isPlaying ? 'rotate 15s linear infinite' : 'none',
            animationPlayState: !isPlaying ? 'paused' : 'running'
          }}
        >
          {/* 添加缩小状态下的播放暂停标志 */}
          {!isPlaying && (
            <div className="mini-play-overlay">
              <img src={config.assets.icons.play} alt="播放" className="mini-play-icon" />
            </div>
          )}
        </div>
      )}
      
      <audio 
        ref={audioRef}
        src={currentSong.file} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextSong}
      />
    </div>
  );
};

export default GlassMusicPlayer;
