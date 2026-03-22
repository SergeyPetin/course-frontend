import React, { useState, useEffect, useCallback } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';

import LessonPlayer from './components/LessonPlayer';
import CourseManagePage from './components/CourseManagePage';
import CourseCard from './components/CourseCard';
import MyCoursesPage from './components/MyCoursesPage';

const API_URL = 'https://bek-production-15ec.up.railway.app';


function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch (e) {
    console.error('JWT parse error:', e);
    return null;
  }
}

function Header() {
  const [userRole, setUserRole] = useState(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token || token === 'undefined') {
      setUserRole(null);
      setEmail('');
      return;
    }

    const payload = parseJwt(token);

    if (payload) {
      setUserRole(payload.role || null);
      setEmail(payload.sub || payload.email || 'User');
    } else {
      setUserRole(null);
      setEmail('');
    }
  }, []);

  const canCreateCourse = userRole === 'AUTHOR' || userRole === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    window.location.href = '/auth';
  };

  return (
    <header
      style={{
        background: 'rgba(15,23,42,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148,163,184,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      <div
        style={{
    maxWidth: 960,
    margin: '0 auto',
    padding: '16px 20px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16
  }}
      >
        <Link
          to="/"
          style={{
            fontSize: 24,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none'
          }}
        >
          CourseHub
        </Link>

        <nav style={{ display: 'flex', gap: 32, fontSize: 14 }}>
          <Link to="/" style={{ color: '#e5e7eb', textDecoration: 'none' }}>
            Курсы
          </Link>
          <Link to="/my-courses" style={{ color: '#e5e7eb', textDecoration: 'none' }}>
    Мои курсы
  </Link>
          <Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>
            О нас
          </Link>
        </nav>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {canCreateCourse && (
            <Link
              to="/create-course"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: 'white',
                padding: '8px 20px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              + Создать курс
            </Link>
          )}

          {userRole ? (
            <>
              <span style={{ color: '#e5e7eb', fontSize: 14 }}>👤 {email}</span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(148,163,184,0.4)',
                  color: '#e5e7eb',
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                border: 'none',
                color: 'white',
                padding: '8px 20px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Войти / Регистрация
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { email, password } : { email, fullName, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();

        if (isLogin) {
          if (!data.token) {
            alert('Сервер не вернул токен, авторизация не удалась');
            return;
          }

          localStorage.setItem('jwtToken', data.token);
          alert('✅ Авторизация успешна!');
          window.location.href = '/';
        } else {
          alert('✅ Регистрация успешна! Теперь войдите.');
          navigate('/auth');
        }
      } else {
        const errorText = await response.text();
        alert(`Ошибка ${response.status}${errorText ? `: ${errorText}` : ''}`);
      }
    } catch (error) {
      alert('❌ Сервер недоступен');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '40px 20px',
        background: '#0f172a',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#020617',
          padding: '2.5rem',
          borderRadius: 20,
          border: '1px solid rgba(148,163,184,0.2)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.875rem',
              color: '#e5e7eb',
              fontWeight: 700,
              margin: 0
            }}
          >
            {isLogin ? 'Войти' : 'Регистрация'}
          </h1>
        </div>

        <form
          onSubmit={handleAuth}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '16px 24px',
              margin: '8px 0',
              border: 'none',
              borderRadius: '12px',
              background: '#1e293b',
              color: 'white',
              fontWeight: 600,
              fontSize: 16,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />

          {!isLogin && (
            <input
              placeholder="Полное имя"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px 24px',
                margin: '8px 0',
                border: 'none',
                borderRadius: '12px',
                background: '#1e293b',
                color: 'white',
                fontWeight: 600,
                fontSize: 16,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          )}

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '16px 24px',
              margin: '8px 0',
              border: 'none',
              borderRadius: '12px',
              background: '#1e293b',
              color: 'white',
              fontWeight: 600,
              fontSize: 16,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 24px',
              margin: '8px 0',
              border: 'none',
              borderRadius: '12px',
              background: loading ? '#475569' : '#3b82f6',
              color: 'white',
              fontWeight: 600,
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setEmail('');
            setPassword('');
            setFullName('');
          }}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '1rem',
            border: 'none',
            borderRadius: 12,
            background: 'transparent',
            color: '#60a5fa',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}

function Home({ courses, userSubscriptions, loading }) {  // ← + userSubscriptions
  const isPurchased = (courseId) => userSubscriptions.includes(courseId);  // ← НОВОЕ
  
  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', color: 'white', padding: '0 20px' }}>
        <h1 style={{ fontSize: 32, marginBottom: 24, textAlign: 'center' }}>
          Курсы по программированию
        </h1>

        {loading && (
          <div style={{ textAlign: 'center', padding: 40 }}>Загрузка курсов...</div>
        )}

        {!loading && courses.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
            Нет доступных курсов
          </div>
        )}

        {!loading && courses.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                isPurchased={isPurchased(course.id)}  // ← ГЛАВНОЕ ИЗМЕНЕНИЕ!
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hasAccess, setHasAccess] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  // 🔥🚀 НОВЫЙ КОД №1 — ВСТАВЬ ЗДЕСЬ (ПОСЛЕ state):
  const checkSubscriptionNow = useCallback(async () => {
  const token = localStorage.getItem('jwtToken');
  if (!token || !id) return;
  
  try {
    const response = await fetch(`${API_URL}/subscriptions/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const subs = await response.json();
      const courseIds = subs.map(s => s.course?.id).filter(Boolean);
      const hasSub = courseIds.includes(Number(id));
      
      // 🔥 ЛОГИ ТОЛЬКО ПРИ ИЗМЕНЕНИИ
      if (hasSub !== hasAccess) {
        console.log('🔄 AUTO-UPDATE:', hasAccess, '→', hasSub, 'Course IDs:', courseIds);
        setHasAccess(hasSub);
      }
    }
  } catch (e) {
    console.error('Auto-check failed:', e);
  }
}, [id, hasAccess]);

  // ✅ ТОЛЬКО 1 useEffect — ВСЁ ЗДЕСЬ!
  useEffect(() => {
    console.log('🎯 MAIN useEffect → id:', id);
    
    if (!id) return;
    
    const loadCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/courses/${id}`);
        const data = await response.json();
        setCourse(data);
        
        // Уроки
        const lessons = Array.isArray(data.lessons) ? data.lessons : [];
        if (lessons.length > 0) {
          const sorted = [...lessons].sort((a, b) => {
            const orderA = a.orderNumber ?? a.id ?? 0;
            const orderB = b.orderNumber ?? b.id ?? 0;
            return orderA - orderB;
          });
          setSelectedLesson(sorted[0]);
        }
        setLoading(false);
        
        // Авторство
        const token = localStorage.getItem('jwtToken');
        if (token && data.author) {
          const payload = parseJwt(token);
          const email = payload?.sub || payload?.email;
          const courseAuthorEmail = data.author.email || data.authorEmail;
          const isOwner = !!courseAuthorEmail && !!email && courseAuthorEmail === email;
          setIsAuthor(payload?.role === 'ADMIN' || isOwner);
          if (isOwner || payload?.role === 'ADMIN') {
            setHasAccess(true);
            return;
          }
        }
        
        // Подписка
        if (token) {
          console.log('🔍 Checking subscription for course:', id);
          try {
            const subResponse = await fetch(`${API_URL}/subscriptions/my`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (subResponse.ok) {
              const subs = await subResponse.json();
              console.log('🔍 Found subscriptions:', subs.map(s => s.course?.id));
              const hasSub = subs.some(sub => sub.course?.id == id);
              console.log('🔍 RESULT hasAccess:', hasSub);
              setHasAccess(hasSub);
            }
          } catch (e) {
            console.error('🔍 Subscription check FAILED:', e);
          }
        }
      } catch (err) {
        console.error('Ошибка загрузки курса:', err);
        setLoading(false);
      }
    };
    
    loadCourse();
  }, [id]);

  // 🔥🚀 НОВЫЙ КОД №2 — ВСТАВЬ ЗДЕСЬ (ПОСЛЕ ГЛАВНОГО useEffect):
  useEffect(() => {
    if (!course || !id) return;
    
    // Проверяем каждые 5 секунд
    const interval = setInterval(checkSubscriptionNow, 5000);
    
    return () => clearInterval(interval);
  }, [course, id, checkSubscriptionNow]);

  const handleEdit = () => {
    if (!course) return;

    navigate('/create-course', {
      state: {
        courseToEdit: {
          id: course.id,
          title: course.title,
          description: course.description,
          price: course.price,
          coverImageUrl: course.coverImageUrl,
          previewVideoUrl: course.previewVideoUrl
        }
      }
    });
  };

  const handleDelete = async () => {
    if (
      !window.confirm('Точно удалить этот курс? Это действие нельзя отменить.')
    ) {
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');

      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (response.ok) {
        alert('Курс удалён');
        window.dispatchEvent(new CustomEvent('courseCreated'));
        navigate('/');
      } else {
        const text = await response.text();
        alert(`Ошибка удаления: ${response.status} ${text || ''}`);
      }
    } catch (e) {
      console.error('Сетевая ошибка при удалении курса', e);
      alert('Сетевая ошибка при удалении курса');
    }
  };

const handlePurchase = async () => {
  if (hasAccess) return;

  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`${API_URL}/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({ courseId: Number(id) })
    });

    const data = await response.json();
    
    if (response.ok && data.url) {
      window.location.href = data.url;
    } else {
      console.error('Payment error:', data);
      alert(`Ошибка оплаты: ${data.error || response.status}`);
    }
  } catch (error) {
    console.error('Payment network error:', error);
    alert('Ошибка сети. Попробуйте позже.');
  }
};


  // сортируем уроки по orderNumber
  const sortedLessons =
    course && Array.isArray(course.lessons)
      ? [...course.lessons].sort((a, b) => {
          const orderA = a.orderNumber ?? a.id ?? 0;
          const orderB = b.orderNumber ?? b.id ?? 0;
          return orderA - orderB;
        })
      : [];

  // удобный флаг: можно ли показывать уроки и плеер
  const canViewLessons = isAuthor || hasAccess;

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
        Загрузка...
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
        Курс не найден
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          padding: '40px 0',
          background: '#0f172a',
          minHeight: '100vh'
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            color: 'white',
            padding: '0 20px'
          }}
        >
          <Link
            to="/"
            style={{
              color: '#38bdf8',
              textDecoration: 'none',
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 24
            }}
          >
            ← Назад к курсам
          </Link>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 40,
              alignItems: 'start'
            }}
          >
            {/* Левая колонка: инфо + плеер + уроки */}
            <div>
              <h1
                style={{
                  fontSize: 36,
                  marginBottom: 16,
                  color: '#e5e7eb'
                }}
              >
                {course.title}
              </h1>

              <div
                style={{
                  fontSize: 14,
                  color: '#38bdf8',
                  marginBottom: 24
                }}
              >
                Новинка · Backend · {sortedLessons.length} уроков
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#22c55e',
                  marginBottom: 24
                }}
              >
                {course.price} ₽
              </div>

              <p
                style={{
                  fontSize: 16,
                  color: '#9ca3af',
                  lineHeight: 1.7,
                  marginBottom: 32
                }}
              >
                {course.description ||
                  'Подробное описание курса будет добавлено в ближайшее время.'}
              </p>

              {/* Превью-ролик с YouTube — видно всем */}
              {course.previewVideoUrl && (
                <div style={{ marginBottom: 32 }}>
                  <iframe
                    key={`${course.id}-${course.previewVideoUrl || 'empty'}-${Date.now()}`}
                    width="100%"
                    height="315"
                    src={
                      course.previewVideoUrl
                        ? course.previewVideoUrl.replace('watch?v=', 'embed/') +
                          `?v=${Date.now()}`
                        : ''
                    }
                    title="Промо видео"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: 12 }}
                  ></iframe>
                </div>
              )}

              {/* HLS-плеер с уроком — только если есть доступ.
                  И БЕЗ автозапуска (autoPlay={false}). */}
              {canViewLessons &&
                selectedLesson &&
                selectedLesson.videoId && (
                  <div style={{ marginBottom: 32 }}>
                    <h2
                      style={{
                        fontSize: 20,
                        color: '#e5e7eb',
                        marginBottom: 12
                      }}
                    >
                      Сейчас играет: {selectedLesson.title}
                    </h2>
                    <LessonPlayer
                      videoId={selectedLesson.videoId}
                      autoPlay={false}
                    />
                  </div>
                )}

              {/* Кнопки автора / покупка */}
              {isAuthor ? (
  <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
    <Link
      to={`/courses/${course.id}/manage`}
      style={{
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        padding: '14px 24px',
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      📋 Управление уроками
    </Link>
    <button
      onClick={handleEdit}
      style={{
        background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
        border: 'none',
        color: 'white',
        padding: '14px 24px',
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer'
      }}
    >
      ✏️ Редактировать курс
    </button>
    <button
      onClick={handleDelete}
      style={{
        background: '#dc2626',
        border: 'none',
        color: 'white',
        padding: '14px 20px',
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer'
      }}
    >
      🗑 Удалить
    </button>
  </div>
) : (
  <button
    onClick={handlePurchase}
    style={{
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      border: 'none',
      color: 'white',
      padding: '16px 32px',
      borderRadius: 12,
      fontSize: 16,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 12px 30px rgba(34,197,94,0.4)'
    }}
  >
    {hasAccess ? 'Открыть курс' : 'Купить курс'}
  </button>
)}

              {/* Блок уроков: либо показываем список, либо заглушку о покупке */}
              {canViewLessons ? (
                sortedLessons.length > 0 ? (
                  <div style={{ marginTop: 40 }}>
                    <h2
                      style={{
                        fontSize: 24,
                        color: '#e5e7eb',
                        marginBottom: 20
                      }}
                    >
                      Уроки ({sortedLessons.length})
                    </h2>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12
                      }}
                    >
                      {sortedLessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          style={{
                            padding: 16,
                            background: '#020617',
                            borderRadius: 12,
                            borderLeft: '3px solid #38bdf8',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#1e293b';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#020617';
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                color: '#e5e7eb'
                              }}
                            >
                              {index + 1}. {lesson.title}
                            </span>
                            {lesson.durationMinutes &&
                              lesson.durationMinutes > 0 && (
                                <span
                                  style={{
                                    color: '#6b7280',
                                    fontSize: 12
                                  }}
                                >
                                  {lesson.durationMinutes} мин.
                                </span>
                              )}
                          </div>
                          <div
                            style={{
                              marginTop: 6,
                              fontSize: 12,
                              color:
                                selectedLesson &&
                                selectedLesson.id === lesson.id
                                  ? '#22c55e'
                                  : '#9ca3af'
                            }}
                          >
                            {selectedLesson &&
                            selectedLesson.id === lesson.id
                              ? '▶ Сейчас воспроизводится'
                              : 'Нажмите, чтобы воспроизвести'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 40,
                      padding: 24,
                      background: '#020617',
                      borderRadius: 12,
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ color: '#9ca3af', fontSize: 16 }}>
                      Уроки скоро появятся
                    </div>
                  </div>
                )
              ) : (
                <div
                  style={{
                    marginTop: 40,
                    padding: 24,
                    background: '#020617',
                    borderRadius: 12,
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      color: '#9ca3af',
                      fontSize: 16,
                      marginBottom: 8
                    }}
                  >
                    Уроки доступны только после покупки курса.
                  </div>
                  <div
                    style={{
                      color: '#6b7280',
                      fontSize: 14
                    }}
                  >
                    Посмотрите превью‑видео и описание, затем нажмите
                    «Купить курс».
                  </div>
                </div>
              )}
            </div>

            {/* Правая колонка: автор */}
            <div
              style={{
                background: '#020617',
                padding: 24,
                borderRadius: 16,
                border: '1px solid rgba(148,163,184,0.2)'
              }}
            >
              <h3
                style={{
                  color: '#e5e7eb',
                  marginBottom: 16
                }}
              >
                Автор
              </h3>
              {course.author ? (
                <>
                  <div
                    style={{
                      fontSize: 14,
                      color: '#9ca3af',
                      marginBottom: 8
                    }}
                  >
                    {course.author.fullName || course.author.email}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280'
                    }}
                  >
                    Инструктор
                  </div>
                </>
              ) : (
                <div style={{ color: '#6b7280' }}>
                  Информация скоро появится
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && !isAuthor && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            style={{
              background: '#020617',
              padding: '2rem',
              borderRadius: 16,
              maxWidth: 500,
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24
              }}
            >
              <h2
                style={{
                  color: '#e5e7eb',
                  fontSize: 24,
                  fontWeight: 700
                }}
              >
                Оплата: {course.title}
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  color: '#9ca3af',
                  fontSize: 24,
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none'
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#22c55e',
                marginBottom: 24
              }}
            >
              {course.price} ₽
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <button
                style={{
                  padding: 16,
                  background: '#f97316',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={handlePurchase}
              >
                🏦 Тинькофф (СБП/Карта)
              </button>

              <button
                style={{
                  padding: 16,
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={handlePurchase}
              >
                💳 QIWI Кошелёк
              </button>

              <button
                style={{
                  padding: 16,
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={handlePurchase}
              >
                💰 ЮMoney
              </button>

              <div
                style={{
                  paddingTop: 20,
                  borderTop: '1px solid #374151'
                }}
              >
                <h3
                  style={{
                    color: '#9ca3af',
                    fontSize: 16,
                    marginBottom: 12
                  }}
                >
                  🇺🇸 International
                </h3>
                <button
                  style={{
                    padding: 16,
                    background: '#6772e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  onClick={handlePurchase}
                >
                  💳 Stripe (Visa/MasterCard)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


function CreateCoursePage() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    coverImageUrl: '',
    previewVideoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.courseToEdit) {
      const course = location.state.courseToEdit;
      setFormData({
        title: course.title || '',
        description: course.description || '',
        price: course.price || '',
        coverImageUrl: course.coverImageUrl || '',
        previewVideoUrl: course.previewVideoUrl || ''
      });
      setIsEdit(true);
      setCourseId(course.id);
      document.title = `Редактировать: ${course.title}`;
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('jwtToken');
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit
        ? `${API_URL}/courses/${courseId}`
        : `${API_URL}/courses`;

      const body = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        coverImageUrl: formData.coverImageUrl || '',
        previewVideoUrl: formData.previewVideoUrl || ''
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        window.dispatchEvent(new CustomEvent('courseCreated'));
        navigate('/');
        alert(isEdit ? '✅ Курс обновлён!' : '✅ Курс создан!');
      } else {
        const errorText = await response.text();
        alert(
          `Ошибка ${response.status}: ${
            errorText || 'Доступ запрещён'
          }`
        );
      }
    } catch (error) {
      alert('Сервер недоступен');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '40px 20px',
        background: '#0f172a',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          margin: '0 auto',
          background: '#020617',
          padding: '2.5rem',
          borderRadius: 20,
          border: '1px solid rgba(148,163,184,0.2)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}
        >
          <h1
            style={{
              fontSize: '1.875rem',
              color: '#e5e7eb',
              fontWeight: 700,
              margin: 0
            }}
          >
            {isEdit ? 'Редактировать курс' : 'Новый курс'}
          </h1>
          <Link
            to="/"
            style={{
              color: '#9ca3af',
              fontSize: 24,
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            ×
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                color: '#9ca3af',
                fontSize: 14,
                marginBottom: 8
              }}
            >
              Название курса *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#0f172a',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: 12,
                color: '#e5e7eb',
                fontSize: 16
              }}
              onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'rgba(148,163,184,0.3)')
              }
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                color: '#9ca3af',
                fontSize: 14,
                marginBottom: 8
              }}
            >
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#0f172a',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: 12,
                color: '#e5e7eb',
                fontSize: 16,
                resize: 'vertical',
                minHeight: 100
              }}
              onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'rgba(148,163,184,0.3)')
              }
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                color: '#9ca3af',
                fontSize: 14,
                marginBottom: 8
              }}
            >
              Цена (₽)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              min="0"
              step="1"
              placeholder="999"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#0f172a',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: 12,
                color: '#22c55e',
                fontSize: 16,
                fontWeight: 600
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#22c55e';
                e.target.style.outline = 'none';
              }}
              onBlur={(e) =>
                (e.target.style.borderColor = 'rgba(148,163,184,0.3)')
              }
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                color: '#9ca3af',
                fontSize: 14,
                marginBottom: 8
              }}
            >
              Обложка (URL)
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.coverImageUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coverImageUrl: e.target.value
                })
              }
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#0f172a',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: 12,
                color: '#e5e7eb',
                fontSize: 16
              }}
              onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'rgba(148,163,184,0.3)')
              }
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                color: '#9ca3af',
                fontSize: 14,
                marginBottom: 8
              }}
            >
              YouTube видео (URL)
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.previewVideoUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  previewVideoUrl: e.target.value
                })
              }
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#0f172a',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: 12,
                color: '#e5e7eb',
                fontSize: 16
              }}
              onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'rgba(148,163,184,0.3)')
              }
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                background: loading
                  ? 'rgba(71,85,105,0.6)'
                  : 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: 'white',
                padding: 16,
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading
                ? 'Сохраняем...'
                : isEdit
                ? 'Сохранить изменения'
                : 'Создать курс'}
            </button>
            <Link
              to="/"
              style={{
                padding: '16px 20px',
                background: 'transparent',
                border: '1px solid rgba(148,163,184,0.4)',
                color: '#e5e7eb',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 500,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap'
              }}
            >
              Отмена
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSubscriptions, setUserSubscriptions] = useState([]);  // ← НОВОЕ!

  useEffect(() => {
    const loadCourses = () => {
      fetch(`${API_URL}/courses?page=0&size=20&sortBy=title`)
        .then((response) => response.json())
        .then((data) => {
          let loadedCourses = [];
          if (data.content) {
            loadedCourses = data.content;
          } else if (Array.isArray(data)) {
            loadedCourses = data;
          }
          setCourses(loadedCourses);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Ошибка загрузки курсов:', err);
          setLoading(false);
        });
    };

    loadCourses();

    // ← НОВЫЙ useEffect для подписок!
    const token = localStorage.getItem('jwtToken');
    if (token) {
      fetch(`${API_URL}/subscriptions/my`, { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      .then(res => res.json())
      .then(subs => {
        const ids = subs.map(s => s.course?.id || s.courseId);
        setUserSubscriptions(ids);
        console.log('📦 Загружены подписки:', ids);
      })
      .catch(err => console.error('Ошибка подписок:', err));
    }

    const handleCourseCreated = () => {
      setLoading(true);
      loadCourses();
    };

    window.addEventListener('courseCreated', handleCourseCreated);

    return () => {
      window.removeEventListener('courseCreated', handleCourseCreated);
    };
  }, []);

  return (
    <Router>
      <div
        style={{
          minHeight: '100vh',
          background: '#0f172a',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        <Header />
        <Routes>
          <Route path="/payment-success" element={
            <div style={{padding: '40px', textAlign: 'center', color: '#22c55e'}}>
              <h1>✅ Оплата успешна!</h1>
              <p>Подписка активирована. <Link to="/">Вернуться к курсам</Link></p>
            </div>
          } />

          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/courses/:id/manage" element={<CourseManagePage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* ← ЗДЕСЬ ИЗМЕНЕНИЕ! Добавили userSubscriptions */}
          <Route
            path="/"
            element={<Home courses={courses} userSubscriptions={userSubscriptions} loading={loading} />}
          />
          
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/create-course" element={<CreateCoursePage />} />
          <Route
            path="/about"
            element={
              <div style={{ padding: 40, color: 'white' }}>О нас</div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
