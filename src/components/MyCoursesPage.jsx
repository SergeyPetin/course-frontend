import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';

const API_URL = 'https://bek-production-15ec.up.railway.app';

function MyCoursesPage() {
  const [allCourses, setAllCourses] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    
    // 1. Загружаем подписки
    if (token) {
      fetch(`${API_URL}/subscriptions/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(subs => {
        const ids = subs.map(s => s.course?.id || s.courseId);
        setUserSubscriptions(ids);
      })
      .catch(err => console.error('Subscriptions error:', err));
    }

    // 2. Загружаем все курсы
    fetch(`${API_URL}/courses?page=0&size=20`)
      .then(res => res.json())
      .then(data => {
        const coursesList = data.content || data;
        setAllCourses(coursesList);
        setLoading(false);
      })
      .catch(err => {
        console.error('Courses error:', err);
        setLoading(false);
      });
  }, []);

  // 3. Фильтруем свои курсы когда данные готовы
  useEffect(() => {
    if (allCourses.length > 0 && userSubscriptions.length > 0) {
      const filtered = allCourses.filter(course => 
        userSubscriptions.includes(course.id)
      );
      setMyCourses(filtered);
    }
  }, [allCourses, userSubscriptions]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
        Загрузка ваших курсов...
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', color: 'white', padding: '0 20px' }}>
        <h1 style={{ fontSize: 32, marginBottom: 24, textAlign: 'center' }}>
          Мои курсы
        </h1>

        {myCourses.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 40,
            color: '#9ca3af',
            background: '#020617',
            borderRadius: 16,
            maxWidth: 500,
            margin: '0 auto'
          }}>
            У вас пока нет купленных курсов.{' '}
            <Link to="/" style={{ color: '#38bdf8' }}>
              Посмотрите каталог
            </Link>
            !
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 24
          }}>
            {myCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                isPurchased={true}  // ← ВАЖНО!
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCoursesPage;
