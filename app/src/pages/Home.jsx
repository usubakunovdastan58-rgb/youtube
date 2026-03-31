import CourseCard from '../components/CourseCard';

const Home = () => {
  // В будущем эти данные придут из Firebase через Акнура
  const courses = [
    { id: 'react-01', title: 'React для новичков', description: 'Основы хуков и компонентов' },
    { id: 'firebase-02', title: 'Firebase + React', description: 'Учимся работать с БД Firestore' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Все курсы</h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {courses.map(course => (
          <CourseCard key={course.id} title={course.title} description={course.description} id={course.id} />
        ))}
      </div>
    </div>
  );
};

export default Home;