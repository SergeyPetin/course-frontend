import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

const LessonPlayer = ({ hlsUrl }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    // если нет video-элемента или ссылки — ничего не делаем
    if (!video || !hlsUrl) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);     // загружаем HLS-поток
      hls.attachMedia(video);     // «прикрепляем» его к <video>

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // нативная поддержка HLS (обычно Safari)
      video.src = hlsUrl;
    }

    // когда компонент или ссылка меняется — чистим за собой
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [hlsUrl]);

  return (
    <div
      style={{
        width: '100%',
        margin: '20px 0',
        background: '#000',
        borderRadius: 12
      }}
    >
      <video
        ref={videoRef}
        controls                 // есть кнопка Play/Pause
        style={{ width: '100%', height: 'auto', borderRadius: 12 }}
        preload="metadata"       // подгружаем только метаданные, не всё видео
        poster="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
      />
    </div>
  );
};

export default LessonPlayer;
