import VideoPlayer from "../components/VideoPlayer";

export default function LessonPage({
  course,
  lesson,
  nextLesson,
  onBackToCourse,
  onOpenLesson,
  onOpenNextLesson,
}) {
  if (!course || !lesson) {
    return (
      <main className="page-content">
        <section className="page-panel empty-state">
          <h2>Урок пока не выбран</h2>
          <p>Выбери курс и открой любой урок, чтобы увидеть видео.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-content">
      <section className="page-panel lesson-layout">
        <div className="lesson-layout__header">
          <div className="section-heading">
            <p className="eyebrow">Урок</p>
            <h2>{lesson.title}</h2>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={onBackToCourse}
          >
            Вернуться к программе
          </button>
        </div>

        <div className="lesson-browser">
          <div className="lesson-browser__video">
            <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} />
          </div>

          <aside className="lesson-sidebar" aria-label="Список уроков курса">
            <p className="eyebrow">Уроки курса</p>
            <div className="lesson-sidebar__list">
              {course.lessons.map((courseLesson, index) => (
                <button
                  key={courseLesson.id}
                  type="button"
                  className={`lesson-sidebar__item ${
                    courseLesson.id === lesson.id ? "is-active" : ""
                  }`}
                  onClick={() => onOpenLesson(courseLesson.id)}
                >
                  <span className="lesson-sidebar__item-index">
                    Урок {index + 1}
                  </span>
                  <strong>{courseLesson.title}</strong>
                  <span className="lesson-sidebar__item-duration">
                    {courseLesson.duration}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onBackToCourse}
          >
            Все уроки курса
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={onOpenNextLesson}
            disabled={!nextLesson}
          >
            {nextLesson ? "Следующий урок" : "Это последний урок"}
          </button>
        </div>
      </section>

      <section className="page-panel lesson-details">
        <div>
          <p className="eyebrow">Курс</p>
          <h3>{course.title}</h3>
          <p>{lesson.summary}</p>
        </div>

        <div className="lesson-note">
          <span>Длительность</span>
          <strong>{lesson.duration}</strong>
        </div>
      </section>
    </main>
  );
}
