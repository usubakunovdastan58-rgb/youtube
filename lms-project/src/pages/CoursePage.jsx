export default function CoursePage({ course, onBack, onOpenLesson }) {
  if (!course) {
    return (
      <main className="page-content">
        <section className="page-panel empty-state">
          <h2>Курс ещё не выбран</h2>
          <p>Вернись к каталогу и открой нужный курс.</p>
        </section>
      </main>
    );
  }

  const firstLesson = course.lessons[0] || null;

  return (
    <main className="page-content">
      <section className="page-panel">
        <div className="section-heading">
          <p className="eyebrow">Курс</p>
          <h2>{course.title}</h2>
        </div>

        <p className="page-description">{course.description}</p>

        <div className="course-overview">
          <div>
            <span>Уровень</span>
            <strong>{course.level}</strong>
          </div>
          <div>
            <span>Длительность</span>
            <strong>{course.duration}</strong>
          </div>
          <div>
            <span>Уроков</span>
            <strong>{course.lessons.length}</strong>
          </div>
        </div>

        <div className="page-actions">
          <button type="button" className="secondary-button" onClick={onBack}>
            Назад к курсам
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => firstLesson && onOpenLesson(firstLesson.id)}
            disabled={!firstLesson}
          >
            Смотреть первый урок
          </button>
        </div>
      </section>

      <section className="page-panel">
        <div className="section-heading">
          <p className="eyebrow">Программа</p>
          <h2>Список уроков</h2>
        </div>

        <div className="lesson-list">
          {course.lessons.map((lesson, index) => (
            <article key={lesson.id} className="lesson-card">
              <div>
                <p className="lesson-card__index">Урок {index + 1}</p>
                <h3>{lesson.title}</h3>
                <p>{lesson.summary}</p>
              </div>

              <div className="lesson-card__meta">
                <span>{lesson.duration}</span>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => onOpenLesson(lesson.id)}
                >
                  Смотреть урок
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
