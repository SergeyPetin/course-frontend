import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LessonPlayer from '../components/LessonPlayer';

const API_URL = 'https://bek-production-15ec.up.railway.app';

function CourseManagePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({
    title: '',
    videoId: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const loadLessons = async () => {
    try {
      const lessonsRes = await fetch(`${API_URL}/courses/${id}/lessons`);
      const lessonsData = await lessonsRes.json();
      const sorted = Array.isArray(lessonsData)
        ? [...lessonsData].sort((a, b) => {
            const orderA = a.orderNumber ?? a.id ?? 0;
            const orderB = b.orderNumber ?? b.id ?? 0;
            return orderA - orderB;
          })
        : [];
      setLessons(sorted);
    } catch (e) {
      console.error('Ошибка загрузки уроков:', e);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const courseRes = await fetch(`${API_URL}/courses/${id}`);
        const courseData = await courseRes.json();
        setCourse(courseData);
      } catch (e) {
        console.error('Ошибка загрузки курса:', e);
      }
      await loadLessons();
    };
    loadData();
  }, [id]);

  const addLesson = async () => {
    if (!newLesson.title.trim() || !newLesson.videoId.trim()) return;

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
        setNewLesson({ title: '', videoId: '' });
        await loadLessons();
      } else {
        console.error('Ошибка создания урока:', response.status, await response.text());
        alert(`Ошибка ${response.status}`);
      }
    } catch (e) {
      console.error('Сетевая ошибка при создании урока:', e);
      alert('Сервер недоступен');
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (lessonId) => {
    if (!window.confirm('Удалить этот урок? Это действие нельзя отменить.')) {
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(
        `${API_URL}/courses/${id}/lessons/${lessonId}`,
        {
          method: 'DELETE',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` })
          }
        }
      );

      if (response.ok || response.status === 204) {
        setLessons((prev) => prev.filter((l) => l.id !== lessonId));
        if (selectedLesson && selectedLesson.id === lessonId) {
          setSelectedLesson(null);
        }
      } else {
        const text = await response.text();
        alert(`Ошибка удаления урока: ${response.status} ${text || ''}`);
      }
    } catch (e) {
      console.error('Сетевая ошибка при удалении урока:', e);
      alert('Сетевая ошибка при удалении урока');
    }
  };

  if (!course) return <div>Загрузка...</div>;

  return (
    <div
      style={{
        padding: '40px 20px',
        background: '#0f172a',
        minHeight: '100vh'
      }}
    >
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

        <div
          style={{
            background: '#020617',
            padding: 24,
            borderRadius: 16,
            border: '1px solid rgba(148,163,184,0.2)',
            marginBottom: 32
          }}
        >
          <h3 style={{ color: '#e5e7eb', marginBottom: 16 }}>Новый урок</h3>

          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: '2fr 2fr auto'
            }}
          >
            
            <input
              placeholder="Bunny Video ID (dd1be3f3-8796-4de9-aa88-fa152c75f65c)"
value={newLesson.videoId}
onChange={(e) =>
  setNewLesson({ ...newLesson, videoId: e.target.value })
              }
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
              disabled={
                loading ||
                !newLesson.title.trim() ||
              !newLesson.videoId.trim()
              }
              style={{
                padding: '12px 24px',
                background: loading
                  ? '#475569'
                  : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Сохраняем...' : 'Добавить'}
            </button>
          </div>
        </div>

        <div>
          {selectedLesson ? (
            <div style={{ marginTop: 24 }}>
              <h3
                style={{
                  color: '#e5e7eb',
                  marginBottom: 16
                }}
              >
                ▶️ {selectedLesson.title}
              </h3>
              <LessonPlayer videoId={selectedLesson.videoId} />
              <button
                onClick={() => setSelectedLesson(null)}
                style={{
                  marginTop: 16,
                  padding: '12px 24px',
                  background: 'transparent',
                  color: '#38bdf8',
                  border: '1px solid #38bdf8',
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                ← Назад к списку
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {lessons.length === 0 ? (
                <div
                  style={{
                    padding: 40,
                    textAlign: 'center',
                    color: '#9ca3af',
                    background: '#020617',
                    borderRadius: 16
                  }}
                >
                  Нет уроков. Добавьте первый.
                </div>
              ) : (
                lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    style={{
                      padding: 20,
                      background: '#020617',
                      borderRadius: 12,
                      borderLeft: '4px solid #38bdf8',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 16
                    }}
                  >
                    <div
                      style={{ flex: 1, cursor: 'pointer' }}
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          color: '#e5e7eb',
                          marginBottom: 4
                        }}
                      >
                        {index + 1}. {lesson.title}
                      </div>
                      {lesson.durationMinutes &&
                        lesson.durationMinutes > 0 && (
                          <div
                            style={{
                              color: '#9ca3af',
                              fontSize: 14
                            }}
                          >
                            {lesson.durationMinutes} мин.
                          </div>
                        )}
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 12,
                          color: '#38bdf8'
                        }}
                      >
                        Нажмите, чтобы воспроизвести HLS
                      </div>
                    </div>

                    <button
                      onClick={() => deleteLesson(lesson.id)}
                      style={{
                        padding: '8px 14px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      🗑 Удалить
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseManagePage;
