// src/App.tsx

import HeroSection from "./components/HeroSection";
import GlassMusicPlayer, { LyricsProvider, LyricsDisplay } from "./components/GlassMusicPlayer";
import LoadingScreen from "./components/LoadingScreen";
import InfoModal from "./components/InfoModal";
import "./App.css";
import { useEffect, useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [visitCount, setVisitCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    // console.log('%c 🌸 普罗丢桑,很高兴认识你', 'color: #FF6B6B; font-size: 14px;');
    // console.log('GitHub:  https://github.com/huvz04');
    // console.log('X (Twitter): https://x.com/ume_Anchiyumi');
    // console.log('QQ: 1686448912');

    // 获取页面访问次数和设备类型
    fetch('/api/visit-count', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        setVisitCount(data.count);
        setIsMobile(data.isMobile);

        // 将设备类型信息添加到document的data属性中，方便CSS选择器使用
        document.documentElement.dataset.isMobile = data.isMobile;

        // 如果是移动设备，添加特定的类名到body
        if (data.isMobile) {
          document.body.classList.add('mobile-device');
        }
      })
      .catch(error => {
        console.error('Error fetching visit count:', error);
        // 使用UA检测作为备用方案
        const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobile(mobileCheck);
        document.documentElement.dataset.isMobile = String(mobileCheck);
        if (mobileCheck) {
          document.body.classList.add('mobile-device');
        }
      });
  }, []);

  return (
    <LyricsProvider>
      <div className="custom-navbar"
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          zIndex: 1000,
          display: 'flex',
          gap: '20px',
          alignItems: 'center'
        }}
      >
        <a
          href="https://x.com/ume_Anchiyumi"
          className="icon-link"
          style={{
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.5)',
            textDecoration: 'none',
            transition: 'all 0.3s ease'
          }}
          target="_blank"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = 'rgba(234, 83, 58, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
          }}
        >
          <img src="/icon/x-twitter.svg" alt="X" style={{ width: '20px', height: '20px' }} />
        </a>
        <a
          href="https://github.com/huvz04"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.5)',
            textDecoration: 'none',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = 'rgba(234, 83, 58, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <button
          onClick={() => setIsInfoModalOpen(true)}
          style={{
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            padding: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = 'rgba(234, 83, 58, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            {/* <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/> */}
            <path d="M12.003 2c-5.514 0-9.998 4.484-9.998 9.997 0 5.515 4.484 10 9.998 10 5.516 0 10.002-4.485 10.002-10 0-5.513-4.486-9.997-10.002-9.997zm0 1.5c4.69 0 8.502 3.814 8.502 8.497 0 4.687-3.812 8.5-8.502 8.5-4.687 0-8.498-3.813-8.498-8.5 0-4.683 3.811-8.497 8.498-8.497zm0 1c-4.136 0-7.5 3.364-7.5 7.5s3.364 7.5 7.5 7.5c4.137 0 7.5-3.364 7.5-7.5s-3.363-7.5-7.5-7.5zm-1.003 3.5h2v5h-2v-5zm0 6h2v2h-2v-2z" />
          </svg>
        </button>
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
            width: document.documentElement.dataset.isMobile === 'true' ? '110px' : '210px',
            height: document.documentElement.dataset.isMobile === 'true' ? '65px' : '80px',
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
            width: document.documentElement.dataset.isMobile === 'true' ? '80px' : '150px',
            height: document.documentElement.dataset.isMobile === 'true' ? '60px' : '100%',
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

      {loading ? (
        <LoadingScreen onLoadComplete={() => setLoading(false)} />
      ) : (
        <>
          <div className="app">
            <HeroSection />
          </div>
          <GlassMusicPlayer

          />
          <LyricsDisplay />
          <InfoModal
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
            visitCount={visitCount}
          />
        </>
      )

      }
    </LyricsProvider>
  )
}
