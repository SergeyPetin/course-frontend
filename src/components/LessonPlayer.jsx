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
      <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
        <iframe
          src={`https://kinescope.io/embed/${videoId}`}
          loading="lazy"
          style={{
            border: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%'
          }}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope;"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default LessonPlayer;

