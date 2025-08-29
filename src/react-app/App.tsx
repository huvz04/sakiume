// src/App.tsx

import HeroSection from "./components/HeroSection";
import DraggableMusicPlayer from "./components/DraggableMusicPlayer";
import "./App.css";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    console.log('%c 🌸 普罗丢桑,很高兴认识你', 'color: #FF6B6B; font-size: 14px;');
    console.log('GitHub:  https://github.com/huvz04');
    console.log('X (Twitter): https://x.com/ume_Anchiyumi');
    console.log('QQ: 1686448912');
  }, []);

  return (
    <>
      <div 
        className="custom-navbar" 
        style={{ 
          position: 'absolute', 
          top: 20, 
          right: 20, 
          zIndex: 1000,
          display: 'flex',
          gap: '20px',
          alignItems: 'center'
        }}
      >
        <a 
          href="#" 
          style={{
            color: 'white',
            fontFamily: '"Zen Antique Soft", serif',
            fontSize: '2.3rem',
            fontWeight: '600',
            textDecoration: 'none',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#EA533A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'white';
          }}
        >
          HOME
        </a>
        <a 
          href="#tool" 
          style={{
            color: 'white',
            fontFamily: '"Zen Antique Soft", serif',
            fontSize: '1.2rem',
            fontWeight: '600',
            textDecoration: 'none',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#EA533A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'white';
          }}
        >
          TOOL
        </a>
      </div>
      {/* 左上角图标链接 */}
      <div className="top-left-icons" style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000,
        display: 'flex',
        gap: '15px'
      }}>
        <a 
          href="https://gakuen.idolmaster-official.jp/" 
          className="icon-link"
          style={{
            display: 'block',
            width: '210px',
            height: '80px',
            transition: 'all 0.3s ease'
          }}
          target="_blank"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img 
            src="/images/gkmas.png" 
            alt="GKMAS" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </a>
        <a 
          href="https://idolmaster-official.jp/20th_anniversary" 
          className="icon-link"
          style={{
            display: 'block',
            width: '150px',
            height: '100%',
            transition: 'all 0.3s ease'
          }}
          target="_blank"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img 
            src="/images/logo-20th.png" 
            alt="20th Logo" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </a>
      </div>
      
      <div className="app">
        <HeroSection />
      </div>
      <DraggableMusicPlayer />
    </>
  );
}
