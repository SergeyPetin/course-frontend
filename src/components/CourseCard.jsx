import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  // проверяем, куплен ли этот курс
  const raw = localStorage.getItem('purchasedCourses');
  const purchasedIds = raw ? JSON.parse(raw) : [];
  const isPurchased = purchasedIds.includes(course.id);

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
          border: isPurchased 
            ? '2px solid #22c55e'  // зелёная рамка для купленных
            : '1px solid rgba(148,163,184,0.2)',
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
        {/* Обложка курса */}
        {course.coverImageUrl ? (
          <div style={{ height: 140, marginBottom: 16, borderRadius: 12, overflow: 'hidden' }}>
            <img
              key={`${course.id}-${course.coverImageUrl || 'empty'}-${Date.now()}`}
              src={course.coverImageUrl ? `${course.coverImageUrl}?v=${Date.now()}` : ''}
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
            margin: '0 0 8px 0',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {course.title}
        </h3>

        {/* Нижняя часть: цена ИЛИ "Куплен" */}
        <div style={{ marginTop: 'auto' }}>
          {isPurchased ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                padding: '8px 12px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600
              }}
            >
              ✅ Куплен
            </div>
          ) : (
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#22c55e'
              }}
            >
              {course.price} ₽
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
