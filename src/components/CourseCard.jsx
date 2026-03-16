import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Link
      to={`/courses/${course.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block'
      }}
    >
      <div
        style={{
          background: '#020617',
          borderRadius: 16,
          padding: 24,
          height: 320,
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(148,163,184,0.2)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        }}
      >
        {/* ✅ ОБЛОЖКА КУРСА */}
        {course.coverImageUrl ? (
          <div style={{ height: 140, marginBottom: 16, borderRadius: 12, overflow: 'hidden' }}>
            <img
              src={course.coverImageUrl}
              alt={course.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 12
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div
            style={{
              height: 140,
              marginBottom: 16,
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontWeight: 500,
              fontSize: 14
            }}
          >
            🖼️ Обложка
          </div>
        )}

        {/* Название */}
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#e5e7eb',
            margin: '0 0',
            marginBottom: 8,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {course.title}
        </h3>

        {/* Цена */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#22c55e',
            marginTop: 'auto'
          }}
        >
          {course.price} ₽
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
