import { Link } from 'react-router-dom';  // ← ДОБАВЬ import!

const CourseCard = ({ course }) => (
  <div style={{
    background: '#020617',
    borderRadius: 16,
    padding: 24,
    border: '1px solid rgba(148,163,184,0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%'
  }}>
    <div style={{ position: 'relative', height: 140, marginBottom: 16, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: 12,
        right: 12,
        background: 'rgba(34,197,94,0.9)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600
      }}>
        Новинка
      </div>
    </div>
    <h3 style={{ fontSize: 18, color: '#e5e7eb', marginBottom: 8, fontWeight: 600 }}>
      {course.title}
    </h3>
    <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
      {course.description?.substring(0, 100)}...
    </p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 20, fontWeight: 700, color: '#22c55e' }}>
        {course.price} ₽
      </span>
      <Link to={`/courses/${course.id}`} style={{
        background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none'
      }}>
        Подробнее
      </Link>
    </div>
  </div>
);

export default CourseCard;
