import { Link } from 'react-router-dom';

const CourseCard = ({ title, description, id }) => {
  return (
    <div style={{ border: '1px solid #444', padding: '15px', borderRadius: '10px', width: '250px' }}>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={`/lesson/${id}`}>
        <button style={{ cursor: 'pointer', padding: '10px' }}>Смотреть урок</button>
      </Link>
    </div>
  );
};

export default CourseCard;