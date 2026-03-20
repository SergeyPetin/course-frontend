// src/components/MyCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';

const API_URL = 'https://bek-production-15ec.up.railway.app';

function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // читаем купленные ID из localStorage
    const raw = localStorage.getItem('purchasedCourses');
    const purchasedIds = raw ? JSON.parse(raw) : [];

    // грузим все курсы
    fetch(`${API_URL}/courses?page=0&size=20`)
      .then((res) => res.json())
      .then((data) => {
        const allCourses = data.content || data;
        // оставляем только купленные
        const myCourses = allCourses.filter((course) =>
          purchasedIds.includes(course.id)
        );
        setCourses(myCourses);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: 'center',
          color: '#9ca3af'
        }}
      >
        Загрузка ваших курсов...
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          color: 'white',
          padding: '0 20px'
        }}
      >
        <h1 style={{ fontSize: 32, marginBottom: 24, textAlign: 'center' }}>
          Мои курсы
        </h1>

        {courses.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: '#9ca3af',
              background: '#020617',
              borderRadius: 16,
              maxWidth: 500,
              margin: '0 auto'
            }}
          >
            У вас пока нет купленных курсов.{' '}
            <Link to="/" style={{ color: '#38bdf8' }}>
              Посмотрите каталог
            </Link>
            !
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 24
            }}
          >
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCoursesPage;

//rjvvtyn
