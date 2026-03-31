export default function CourseCard({
  title,
  description,
  level,
  lessonsCount,
  duration,
  tags = [],
  onOpen,
}) {
  return (
    <article className="course-card">
      <div className="course-card__meta">
        <span>{level}</span>
        <span>{lessonsCount} урока</span>
        <span>{duration}</span>
      </div>

      <div className="course-card__content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="course-card__tags" aria-label="Теги курса">
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <button type="button" className="primary-button" onClick={onOpen}>
        Открыть курс
      </button>
    </article>
  );
}
