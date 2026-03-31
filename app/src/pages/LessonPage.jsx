import VideoPlayer from '../components/VideoPlayer';
import { useParams, Link } from 'react-router-dom';

const LessonPage = () => {
  const { lessonId } = useParams(); // Получаем ID урока из адресной строки

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#646cff' }}>← Назад к курсам</Link>
      <h1>Просмотр урока: {lessonId}</h1>
      
      {/* Здесь мы передаем ссылку. Позже Акнур сделает так, чтобы она тянулась из базы */}
      <VideoPlayer videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
      
      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <h3>Описание урока</h3>
        <p>В этом видео мы разбираем основные требования к проекту LMS...</p>
      </div>
    </div>
  );
};

export default LessonPage;