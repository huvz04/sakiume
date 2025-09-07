import { useEffect, useState, useRef } from 'react';
import './LoadingScreen.css';
import config from '../config/config.json';
import { Fragment } from 'react';
interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // 模拟资源加载进度
    const videoElement = document.getElementById('bg-video') as HTMLVideoElement;
    const images = Array.from(document.querySelectorAll('img'));
    const totalResources = images.length + 1; // 视频 + 图片数量
    let loadedResources = 0;
    
    // 监听视频加载
    if (videoElement) {
      videoElement.addEventListener('canplaythrough', () => {
        loadedResources++;
        updateProgress();
      });
    }

    // 更新进度函数
    const updateProgress = () => {
      const currentProgress = Math.floor((loadedResources / totalResources) * 100);
      setProgress(currentProgress);
      
      // 当进度达到100%时，显示TAP TO START
      if (currentProgress >= 100) {
        setTimeout(() => {
          setIsLoaded(true);
          setCanStart(true);
        }, 500);
      }
    };

    // 监听图片加载
    images.forEach(img => {
      if (img.complete) {
        loadedResources++;
        updateProgress();
      } else {
        img.addEventListener('load', () => {
          loadedResources++;
          updateProgress();
        });
      }
    });
    
    // 确保至少显示2秒的加载动画
    const minLoadingTime = setTimeout(() => {
      if (progress >= 100) {
        setIsLoaded(true);
        setCanStart(true);
      }
    }, 1000);
    
    // 如果8秒后仍未加载完成，也显示TAP TO START
    const maxLoadingTime = setTimeout(() => {
      setIsLoaded(true);
      setCanStart(true);
    }, 8000);
    
    return () => {
      clearTimeout(minLoadingTime);
      clearTimeout(maxLoadingTime);
    };
  }, [progress]);

  // 处理全屏点击开始
  const handleScreenClick = () => {
    if (canStart) {
      setIsVisible(false);
      setTimeout(() => {
        onLoadComplete();
      }, 800); // 等待淡出动画完成
    }
  };
  
  return (
    <div 
      className={`gakumas-loading-container ${!isVisible ? 'fade-out' : ''}`} 
      ref={loadingRef}
      onClick={handleScreenClick}
    >
      {/* 背景渐变 */}
      <div className="gakumas-background">
        <div className="gradient-overlay"></div>
    </div>
      
      {/* 中央卡片 */}
      <div className="gakumas-card">
        <div className="card-content">
          {/* 主要图片 - 正方形 */}
          <div className="card-image">
            <img src={config.assets.images['starMine-start']} alt="Star-mine" />
          </div>
          
          {/* 歌曲信息 */}
          <div className="card-info">
            <h2 >Star-mine</h2>
            <p className="card-song-idol">花海 佑芽</p>
            <div className="card-song-artist">
              <p>作詞：じん</p>
              <p>作曲：じん</p>
              <p>編曲：じん</p>
            </div>
          </div>
          
          {/* 右下角logo */}
          <div className="card-logo">
            <img src={config.assets.icons.hatsuhoshi} alt="初星学園" />
          </div>
        </div>
      </div>
      
      {/* 底部文字 */}
      <div className="gakumas-text">
        {!isLoaded ? (
          <div className="loading-text">
            LOADING<span className="dots"></span>
          </div>
        ) : (
          <div className="tap-to-start">
            TAP TO START
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;