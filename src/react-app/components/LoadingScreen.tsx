import { useEffect, useState, useRef } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
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
      
      // 当进度达到100%时，延迟一段时间后隐藏加载界面
      if (currentProgress >= 100) {
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onLoadComplete();
          }, 500); // 淡出动画完成后执行回调
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
    
    // 确保至少显示1秒的加载动画，即使资源已经加载完成
    const minLoadingTime = setTimeout(() => {
      if (progress >= 100) {
        setIsVisible(false);
        setTimeout(() => {
          onLoadComplete();
        }, 500);
      }
    }, 1000);
    
    // 如果5秒后仍未加载完成，也显示内容
    const maxLoadingTime = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onLoadComplete();
      }, 500);
    }, 5000);
    
    return () => {
      clearTimeout(minLoadingTime);
      clearTimeout(maxLoadingTime);
    };
  }, [onLoadComplete, progress]);
  
  return (
    <div className={`loading-container ${!isVisible ? 'fade-out' : ''}`} ref={loadingRef}>
      <div className="loading-content">
        <img src="/umeq.png" alt="Ume Q版" className="loading-image" />
        <div className="loading-bar">
          <div className="loading-color" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="loading-num">{progress}</div>
      </div>
    </div>
  );
};

export default LoadingScreen;