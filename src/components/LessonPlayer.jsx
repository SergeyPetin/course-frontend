import React from 'react';

const LessonPlayer = ({ videoId }) => {
  return (
    <div
      style={{
        width: '100%',
        margin: '20px 0',
        borderRadius: 12,
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', paddingTop: '56.25%' }}>
        <iframe
          src={`https://player.mediadelivery.net/embed/619827/${videoId}?autoplay=false&loop=false&muted=false&responsive=true`}
          loading="lazy"
          style={{
            border: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%'
          }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default LessonPlayer;
