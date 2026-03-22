import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, isPurchased = false }) => {  // ← пропс isPurchased!
  
  return (
    <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div
        style={{
          background: '#020617',
          borderRadius: 16,
          padding: 24,
          height: 320,
          display: 'flex',
          flexDirection: 'column',
          border: isPurchased 
            ? '2px solid #22c55e'  // зелёная рамка ✅
            : '1px solid rgba(148,163,184,0.2)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative'  // ← для бейджа
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
        {/* 🟢 Бейдж "Куплен" — ТВОЙ КОД ИДЕАЛЬНЫЙ! */}
        {isPurchased && (
          <div
            style={{
              position: 'absolute',
              top: 12, 
              right: 12,
              background: 'rgba(34, 197, 94, 0.2)',
              color: '#22c55e',
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600
            }}
          >
            ✅ Куплен
          </div>
        )}

        {/* Обложка — твой код */}
        {course.coverImageUrl ? (
          <div style={{ height: 140, marginBottom: 16, borderRadius: 12, overflow: 'hidden' }}>
            <img
              src={`${course.coverImageUrl}?v=${Date.now()}`}
              alt={course.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12
              }}
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        ) : (
          <div style={{
            height: 140, marginBottom: 16, background: 'linear-gradient(135deg, #1e293b, #334155)',
            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#9ca3af', fontWeight: 500, fontSize: 14
          }}>
            🖼️ Обложка
          </div>
        )}

        {/* Название */}
        <h3 style={{
          fontSize: 18, fontWeight: 700, color: '#e5e7eb', margin: '0 0 8px 0',
          lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {course.title}
        </h3>

        {/* Цена / Куплен */}
        <div style={{ marginTop: 'auto' }}>
          {isPurchased ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e',
              padding: '8px 12px', borderRadius: 999, fontSize: 14, fontWeight: 600
            }}>
              ✅ Куплен
            </div>
          ) : (
            <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e' }}>
              {course.price} ₽
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
