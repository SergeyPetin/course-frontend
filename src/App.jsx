import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

function Header() {
  const [userRole, setUserRole] = useState(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // ✅ ДОБАВЛЕНО

  // Проверка токена при загрузке
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
        setEmail(payload.email || 'User'); // ✅ ПОКАЗЫВАЕМ EMAIL
      } catch (e) {
        console.log('Invalid token');
      }
    }
  }, []);

  const canCreateCourse = userRole === 'AUTHOR' || userRole === 'ADMIN';

  return (
    <header style={{
      background: 'rgba(15,23,42,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(148,163,184,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link to="/" style={{
          fontSize: 24,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none'
        }}>
          CourseHub
        </Link>
        
        <nav style={{ display: 'flex', gap: 32, fontSize: 14 }}>
          <Link to="/" style={{ color: '#e5e7eb', textDecoration: 'none' }}>Курсы</Link>
          <Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>О нас</Link>
        </nav>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {canCreateCourse && (
            <Link to="/create-course" style={{
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
            }}>
              + Создать курс
            </Link>
          )}
          
          {userRole ? (
            <span style={{ color: '#e5e7eb', fontSize: 14 }}>👤 {email}</span>
          ) : (
            <button 
              onClick={() => navigate('/auth')}  // ✅ ✅ ✅ ИЗМЕНЕНО!
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
    const API_URL = 'https://course-platform-production-1eb5.up.railway.app';
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { email, password } : { email, fullName, password };
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('jwtToken', data.token);
        navigate('/');  // ✅ РЕДИРЕКТ НА ГЛАВНУЮ
        alert('✅ Авторизация успешна!');
      } else {
        alert(data.error || 'Ошибка авторизации');
      }
    } catch (error) {
      alert('❌ Сервер недоступен');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '40px 20px',
      background: '#0f172a',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#020617',
        padding: '2.5rem',
        borderRadius: 20,
        border: '1px solid rgba(148,163,184,0.2)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.7)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.875rem',
            color: '#e5e7eb',
            fontWeight: 700,
            margin: 0
          }}>
            {isLogin ? 'Войти' : 'Регистрация'}
          </h1>
        </div>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
  placeholder="Email" 
  type="email"
  value={email} 
  onChange={e => setEmail(e.target.value)}
  required 
  style={{
   width: '100%', 
    padding: '16px 20px',
    margin: '0',
    border: 'none',
    borderRadius: 12, 
    background: '#1e293b', 
    color: 'white', 
    fontWeight: 600, 
    fontSize: 16,
    display: 'block'
  }}
/>

{!isLogin && (
  <input 
    placeholder="Полное имя" 
    value={fullName} 
    onChange={e => setFullName(e.target.value)}
    required 
    style={{
      width: '100%', 
    padding: '16px 20px',
    margin: '0',
    border: 'none',
    borderRadius: 12, 
    background: '#1e293b', 
    color: 'white', 
    fontWeight: 600, 
    fontSize: 16,
    display: 'block'
    }}
  />
)}

<input 
  type="password" 
  placeholder="Пароль" 
  value={password} 
  onChange={e => setPassword(e.target.value)}
  required 
  style={{
    width: '100%', 
    padding: '16px 20px',
    margin: '0',
    border: 'none',
    borderRadius: 12, 
    background: '#1e293b', 
    color: 'white', 
    fontWeight: 600, 
    fontSize: 16,
    display: 'block'
  }}
/>

<button 
  type="submit"
  disabled={loading}
  style={{
    width: '100%', 
    padding: '16px 20px',
    margin: '0',
    border: 'none',
    borderRadius: 12, 
    background: loading ? '#475569' : '#3b82f6', 
    color: 'white', 
    fontWeight: 600, 
    fontSize: 16,
    cursor: 'pointer'
  }}
>

            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <button 
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setEmail(''); setPassword(''); setFullName('');
          }}
          style={{
            width: '100%', padding: '12px', marginTop: '1rem',
            border: 'none', borderRadius: 12, background: 'transparent', 
            color: '#60a5fa', fontWeight: 500, cursor: 'pointer'
          }}
        >
          {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}

function Home({ courses, loading }) {
  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', color: 'white', padding: '0 20px' }}>
        <h1 style={{ fontSize: 32, marginBottom: 24, textAlign: 'center' }}>
          Курсы по программированию
        </h1>
        {loading && <div style={{ textAlign: 'center', padding: 40 }}>Загрузка курсов...</div>}
        {!loading && courses.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Нет доступных курсов</div>
        )}
        {!loading && courses.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // ✅ ЗДЕСЬ!



  useEffect(() => {
    fetch(`/courses/${id}`)
      .then(response => response.json())
      .then(data => {
        setCourse(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки курса', err);
        setLoading(false);
      });
  }, [id]);



  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Загрузка...</div>;
  if (!course) return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Курс не найден</div>;



  return (
    <>
      <div style={{ padding: '40px 0', background: '#0f172a', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', color: 'white', padding: '0 20px' }}>
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
         
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }}>
            <div>
              <h1 style={{ fontSize: 36, marginBottom: 16, color: '#e5e7eb' }}>{course.title}</h1>
              <div style={{ fontSize: 14, color: '#38bdf8', marginBottom: 24 }}>Новинка · Backend · 12 уроков</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e', marginBottom: 24 }}>
                {course.price} ₽
              </div>
              <p style={{ fontSize: 16, color: '#9ca3af', lineHeight: 1.7, marginBottom: 32 }}>
                {course.description || 'Подробное описание курса будет добавлено в ближайшее времени.'}
              </p>
             
              {/* ✅ КНОПКА С ОПЛАТОЙ */}
              <button
                onClick={() => setShowPaymentModal(true)}
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
                Купить курс
              </button>



              {/* ✅ УРОКИ */}
              {course.lessons && course.lessons.length > 0 && (
                <div style={{ marginTop: 40 }}>
                  <h2 style={{ fontSize: 24, color: '#e5e7eb', marginBottom: 20 }}>
                    Уроки ({course.lessons.length})
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {course.lessons.map((lesson, index) => (
                      <div key={lesson.id} style={{
                        padding: 16,
                        background: '#020617',
                        borderRadius: 12,
                        borderLeft: '3px solid #38bdf8'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: '#e5e7eb' }}>
                            {index + 1}. {lesson.title}
                          </span>
                          <span style={{ color: '#6b7280', fontSize: 12 }}>
                            {lesson.durationMinutes} мин.
                          </span>
                        </div>
                        {lesson.videoUrl && (
                          <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" style={{
                            color: '#38bdf8',
                            fontSize: 14,
                            marginTop: 4,
                            display: 'block'
                          }}>
                            ▶️ Смотреть урок
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}



              {/* Пустое состояние уроков */}
              {(!course.lessons || course.lessons.length === 0) && (
                <div style={{ marginTop: 40, padding: 24, background: '#020617', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ color: '#9ca3af', fontSize: 16 }}>Уроки скоро появятся</div>
                </div>
              )}
            </div>



            <div style={{
              background: '#020617',
              padding: 24,
              borderRadius: 16,
              border: '1px solid rgba(148,163,184,0.2)'
            }}>
              <h3 style={{ color: '#e5e7eb', marginBottom: 16 }}>Автор</h3>
              {course.author ? (
                <>
                  <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>
                    {course.author.fullName || course.author.email}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Инструктор</div>
                </>
              ) : (
                <div style={{ color: '#6b7280' }}>Информация скоро появится</div>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* ✅ MODAL ОПЛАТЫ */}
      {showPaymentModal && (
        <div style={{
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
          <div style={{
            background: '#020617',
            padding: '2rem',
            borderRadius: 16,
            maxWidth: 500,
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#e5e7eb', fontSize: 24, fontWeight: 700 }}>
                Оплата: {course.title}
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{ color: '#9ca3af', fontSize: 24, cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
           
            <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e', marginBottom: 24 }}>
              {course.price} ₽
            </div>



            <div style={{ display: 'grid', gap: 12 }}>
              {/* 🇷🇺 РОССИЯ */}
              <button style={{
                padding: '16px',
                background: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
                onClick={() => {
                  setShowPaymentModal(false);
                  window.open('https://www.tinkoff.ru/', '_blank');
                }}
              >
                🏦 Тинькофф (СБП/Карта)
              </button>



              <button style={{
                padding: '16px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
                onClick={() => {
                  setShowPaymentModal(false);
                  window.open('https://qiwi.com/', '_blank');
                }}
              >
                💳 QIWI Кошелёк
              </button>



              <button style={{
                padding: '16px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
                onClick={() => {
                  setShowPaymentModal(false);
                  window.open('https://yoomoney.ru/', '_blank');
                }}
              >
                💰 ЮMoney
              </button>



              {/* 🌍 МЕЖДУНАРОДНЫЙ */}
              <div style={{ paddingTop: 20, borderTop: '1px solid #374151' }}>
                <h3 style={{ color: '#9ca3af', fontSize: 16, marginBottom: 12 }}>🇺🇸 International</h3>
                <button style={{
                  padding: '16px',
                  background: '#6772e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                  onClick={() => {
                    setShowPaymentModal(false);
                    window.open('https://buy.stripe.com/', '_blank');
                  }}
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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    promoVideo: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) // конвертируем в число для backend
        })
      });


      if (response.ok) {
        navigate('/');
        window.dispatchEvent(new CustomEvent('courseCreated'));
      } else {
        const errorText = await response.text();
        console.error('🚨 Ошибка сервера:', response.status, errorText);
        alert(`Ошибка ${response.status}: ${errorText || 'Доступ запрещён'}`);
      }
    } catch (error) {
      console.error('🚨 Сетевая ошибка:', error);
      alert('Сервер недоступен');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{
      padding: '40px 20px',
      background: '#0f172a',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
  width: '100%',
  maxWidth: 480,
  margin: '0 auto',
  background: '#020617',
  padding: '2.5rem',
  borderRadius: 20,
  border: '1px solid rgba(148,163,184,0.2)',
  boxShadow: '0 40px 100px rgba(0,0,0,0.7)'
}}>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '1.875rem', // ✅ 30px
            color: '#e5e7eb',
            fontWeight: 700,
            margin: 0
          }}>
            Новый курс
          </h1>
          <Link to="/" style={{
            color: '#9ca3af',
            fontSize: 24,
            fontWeight: 700,
            textDecoration: 'none'
          }}>
            ×
          </Link>
        </div>


        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Название */}
          <div>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 14, marginBottom: 8 }}>
              Название курса *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
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
              onFocus={e => e.target.style.borderColor = '#38bdf8'}
              onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
            />
          </div>


          {/* Описание */}
          <div>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 14, marginBottom: 8 }}>
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              onFocus={e => e.target.style.borderColor = '#38bdf8'}
              onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
            />
          </div>


          {/* ЦЕНА — БЕЗ ШАГА! */}
          <div>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 14, marginBottom: 8 }}>
              Цена (₽)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              min="0"
              step="1" // ✅ ШАГ = 1₽ (любая сумма)
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
              onFocus={e => {
                e.target.style.borderColor = '#22c55e';
                e.target.style.outline = 'none';
              }}
              onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
            />
          </div>


          {/* Обложка */}
          <div>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 14, marginBottom: 8 }}>
              Обложка (URL)
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#0f172a',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: 12,
                color: '#e5e7eb',
                fontSize: 16
              }}
              onFocus={e => e.target.style.borderColor = '#38bdf8'}
              onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
            />
          </div>


          {/* Промо видео */}
          <div>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 14, marginBottom: 8 }}>
              YouTube видео (URL)
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.promoVideo}
              onChange={(e) => setFormData({...formData, promoVideo: e.target.value})}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#0f172a',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: 12,
                color: '#e5e7eb',
                fontSize: 16
              }}
              onFocus={e => e.target.style.borderColor = '#38bdf8'}
              onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
            />
          </div>


          {/* Кнопки */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                background: loading ? 'rgba(71,85,105,0.6)' : 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: 'white',
                padding: '16px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Создаём курс...' : 'Создать курс'}
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



  useEffect(() => {
    const loadCourses = () => {
      fetch('/courses?page=0&size=20&sortBy=title')
        .then(response => response.json())
        .then(data => {
          console.log('🔥 API DATA:', data);
         
          let courses = [];
          if (data.content) {
            courses = data.content;
          } else if (Array.isArray(data)) {
            courses = data;
          }
         
          console.log('📋 КУРСЫ:', courses.length);
          setCourses(courses);
          setLoading(false);
        })
        .catch(err => {
          console.error('Ошибка:', err);
          setLoading(false);
        });
    };



    loadCourses();



    const handleCourseCreated = () => {
      console.log('🆕 Новый курс создан! Обновляем список...');
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
      <div style={{
        minHeight: '100vh',
        background: '#0f172a',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}>
        <Header />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Home courses={courses} loading={loading} />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/create-course" element={<CreateCoursePage />} />
          <Route path="/about" element={<div style={{ padding: 40, color: 'white' }}>О нас</div>} />
        </Routes>
      </div>
    </Router>
  );
  
}
export default App;
