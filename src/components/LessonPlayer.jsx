// src/components/LessonPlayer.jsx ← ЭТОТ код!
import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

const LessonPlayer = ({ hlsUrl }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log('Autoplay prevented'));
      });
      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [hlsUrl]);

  return (
    <div style={{ width: '100%', margin: '20px 0', background: '#000', borderRadius: '12px' }}>
      <video
        ref={videoRef}
        controls
        style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
        poster="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
      />
    </div>
  );
};

export default LessonPlayer;
