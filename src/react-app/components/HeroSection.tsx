import React, { useEffect, useState } from 'react';

import './HeroSection.css';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 页面加载后添加动画效果
    setIsLoaded(true);
  }, []);

  return (
    <div className="hero-section">
      {/* 视频背景 */}
      <div className="video-background" data-scroll data-scroll-speed="-0.5">
        <video 
          autoPlay 
          muted 
          loop 
          id="bg-video" 
          playsInline
          onLoadedData={() => console.log('视频已加载')}
        >
          <source src="/video/hero-3.webm" type="video/webm" />
          Your browser does not support HTML5 video.
        </video>
        
        {/* 人物轮廓遮罩 */}
        <img 
          src="/images/gakumas.svg" 
          alt="人物轮廓" 
          className={`silhouette-mask ${isLoaded ? 'fade-in' : ''}`}
        />
      </div>
      
      {/* 背景遮罩层 */}
      <div className="overlay"></div>
      
      {/* 内容区域 */}
      <div className={`content ${isLoaded ? 'fade-in' : ''}`}>
        <h1>花海佑芽</h1>
        <p>Hanami Ume</p>
      </div>
    </div>
  );
};

export default HeroSection;