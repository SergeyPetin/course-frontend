import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = 'https://bek-production-15ec.up.railway.app';

function CourseManagePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({ 
    title: '', 
    videoUrl: '', 
    durationMinutes: 0 
  });
  const [loading, setLoading] = useState(false);

  // Загрузка курса + уроков
  useEffect(() => {
    const loadData = async () => {
      try {
        const courseRes = await fetch(`${API_URL}/courses/${id}`);
        const courseData = await courseRes.json();
        setCourse(courseData);

        const lessonsRes = await fetch(`${API_URL}/courses/${id}/lessons`);
        const lessonsData = await lessonsRes.json();
        setLessons(lessonsData);
      } catch (e) {
        console.error('Ошибка загрузки:', e);
      }
    };
    loadData();
  }, [id]);

  const addLesson = async () => {
    if (!newLesson.title.trim() || !newLesson.videoUrl.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${API_URL}/courses/${id}/lessons`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(newLesson)
      });

      if (response.ok) {
        // Очистить форму
        setNewLesson({ title: '', videoUrl: '', durationMinutes: 0 });
        // Перезагрузить уроки
        const lessonsRes = await fetch(`${API_URL}/courses/${id}/lessons`);
        const lessonsData = await lessonsRes.json();
        setLessons(lessonsData);
      }
    } catch (e) {
      alert('Ошибка добавления урока');
    } finally {
      setLoading(false);
    }
  };

  if (!course) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '40px 20px', background: '#0f172a', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Link 
          to={`/courses/${id}`} 
          style={{ 
            color: '#38bdf8', 
            textDecoration: 'none', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8,
            marginBottom: 24 
          }}
        >
          ← Назад к курсу
        </Link>

        <h1 style={{ color: '#e5e7eb', marginBottom: 8 }}>
          📋 Управление курсом: {course.title}
        </h1>
        <div style={{ color: '#9ca3af', marginBottom: 32 }}>
          ID: {id} | Уроков: {lessons.length}
        </div>

        {/* Форма добавления урока */}
        <div style={{
          background: '#020617',
          padding: 24,
          borderRadius: 16,
          border: '1px solid rgba(148,163,184,0.2)',
          marginBottom: 32
        }}>
          <h3 style={{ color: '#e5e7eb', marginBottom: 16 }}>➕ Новый урок</h3>
          
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 2fr 1fr auto' }}>
            <input
              placeholder="Название урока (обязательно)"
              value={newLesson.title}
              onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
              style={{
                padding: '12px 16px',
                background: '#1e293b',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: 12,
                color: 'white'
              }}
            />
            
            <input
              placeholder="Ссылка Bunny Stream (m3u8) (обязательно)"
              value={newLesson.videoUrl}
              onChange={e => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
              style={{
                padding: '12px 16px',
                background: '#1e293b',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: 12,
                color: 'white'
              }}
            />
            
            <input
              type="number"
              min="1"
              placeholder="Минут"
              value={newLesson.durationMinutes}
              onChange={e => setNewLesson({ ...newLesson, durationMinutes: +e.target.value })}
              style={{
                padding: '12px 16px',
                background: '#1e293b',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: 12,
                color: 'white'
              }}
            />
            
            <button
              onClick={addLesson}
              disabled={loading || !newLesson.title.trim() || !newLesson.videoUrl.trim()}
              style={{
                padding: '12px 24px',
                background: loading ? '#475569' : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Сохраняем...' : '➕ Добавить'}
            </button>
          </div>
        </div>

        {/* Список уроков */}
        <div style={{ display: 'grid', gap: 12 }}>
          {lessons.length === 0 ? (
            <div style={{ 
              padding: 40, 
              textAlign: 'center', 
              color: '#9ca3af',
              background: '#020617',
              borderRadius: 16
            }}>
              Нет уроков. Добавьте первый! 🎥
            </div>
          ) : (
            lessons.map((lesson, index) => (
              <div key={lesson.id} style={{
                padding: 20,
                background: '#020617',
                borderRadius: 12,
                borderLeft: '4px solid #38bdf8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#e5e7eb' }}>
                    {index + 1}. {lesson.title}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: 14 }}>
                    {lesson.durationMinutes} мин • {lesson.videoUrl ? '✅ Видео' : '❌ Без видео'}
                  </div>
                </div>
                <code style={{ 
                  background: '#1e293b', 
                  padding: '4px 8px', 
                  borderRadius: 6, 
                  fontSize: 12,
                  maxWidth: 300,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {lesson.videoUrl || 'нет'}
                </code>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseManagePage;
