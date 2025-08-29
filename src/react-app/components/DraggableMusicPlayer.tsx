import React, { useState, useRef, useEffect } from 'react';
import './DraggableMusicPlayer.css';

interface Position {
  x: number;
  y: number;
}

const DraggableMusicPlayer: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 20, y: window.innerHeight - 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [iframeVisible, setIframeVisible] = useState(true); // 控制iframe可见性而非完全移除
  const playerRef = useRef<HTMLDivElement>(null);
  const lastPositionRef = useRef<Position>({ x: 20, y: window.innerHeight - 120 }); // 存储上一次位置，优化拖动体验

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 320),
        y: Math.min(prev.y, window.innerHeight - 106)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      // 使用requestAnimationFrame优化拖动性能，减少迟滞感
      requestAnimationFrame(() => {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 320));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 106));
        
        // 更新位置并存储到ref中
        setPosition({ x: newX, y: newY });
        lastPositionRef.current = { x: newX, y: newY };
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    // 保持iframe存在但缩放为0x0，这样音乐不会停止播放
    setIframeVisible(true);
  };


  return (
    <div
      ref={playerRef}
      className={`draggable-music-player ${isDragging ? 'dragging' : ''} ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab',
        width: isExpanded ? '310px' : '80px',
        height: isExpanded ? '300px' : '80px',
        transition: 'all 0.3s ease'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 黑胶唱片效果 - 始终可见 */}
      <div 
        className="vinyl-record"
        onClick={toggleExpanded}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%)',
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          animation: isPlaying ? 'spin 3s linear infinite' : 'none',
          zIndex: isExpanded ? 999 : 1001,
          opacity: isExpanded ? 0.7 : 1
        }}
      >
        {/* 唱片中心孔 */}
        {/* <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#000'
        }} /> */}
        {/* 唱片纹理 */}
        {/* <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          animation: 'none'
        }} /> */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '57px',
          height: '57px',
          borderRadius: '50%',
          background: 'url(/images/umer.png)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          animation: 'none',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }} />
        {/* <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }} /> */}
        {/* <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }} /> */}
      </div>

      {/* 关闭按钮 - 移到frame外部 */}
      {/* {isExpanded && (
        <div 
          className="collapse-button"
          onClick={toggleExpanded}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            zIndex: 1002,
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
          }}
        >
          ×
        </div>
      )} */}

      {/* iframe播放器 - 使用0x0缩放而非完全隐藏 */}
      {iframeVisible && (
        <div 
          style={{ 
            position: 'absolute',
            left: '80px',
            width: isExpanded ? '310px' : '0',
            height: isExpanded ? '300px' : '0',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            opacity: isExpanded ? 1 : 0
          }}
        >
          <iframe 
            title="music-player"
            src="//music.163.com/outchain/player?type=0&id=14209419938&auto=1&height=430"
            style={{ 
              borderRadius: '8px', 
              width: '310px', 
              height: '300px',
              border: 'none',
              pointerEvents: isDragging || !isExpanded ? 'none' : 'auto',
              display: 'block'
            }}
            frameBorder="no"
          />
        </div>
      )}
    </div>
  );
};

export default DraggableMusicPlayer;