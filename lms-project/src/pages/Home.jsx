import CourseCard from "../components/CourseCard";

export default function Home({
  courses,
  onOpenCourse,
  dataSource,
  statusMessage,
  loadError,
}) {
  const totalLessons = courses.reduce(
    (total, course) => total + course.lessons.length,
    0,
  );

  return (
    <main className="page-content">
      <section className="hero-panel">
        <div className="hero-panel__copy">
          <p className="eyebrow">Онлайн-обучение</p>
          <h2>Изучи курс, открой программу и смотри уроки в одном интерфейсе</h2>
          <p className="hero-text">
            Приложение готово к схеме с курсами, уроками и полем `videoUrl`, где
            видео проигрываются прямо на странице урока через YouTube iframe.
          </p>
        </div>

        <div className="hero-panel__stats">
          <div>
            <strong>{courses.length}</strong>
            <span>курса в каталоге</span>
          </div>
          <div>
            <strong>{totalLessons}</strong>
            <span>уроков доступно</span>
          </div>
          <div>
            <strong>{dataSource === "firebase" ? "Firebase" : "Demo"}</strong>
            <span>
              {dataSource === "firebase"
                ? "данные загружены из Firestore"
                : "интерфейс работает на демонстрационных данных"}
            </span>
          </div>
        </div>
      </section>

      <section
        className={`status-banner ${
          dataSource === "firebase"
            ? "status-banner--success"
            : "status-banner--warning"
        }`}
      >
        <div>
          <p className="eyebrow">Статус загрузки</p>
          <h3>
            {dataSource === "firebase"
              ? "Курсы читаются из Firebase"
              : "Пока показаны демо-данные"}
          </h3>
          <p>{loadError || statusMessage}</p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Каталог</p>
          <h2>Доступные курсы</h2>
        </div>

        {courses.length ? (
          <div className="course-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description}
                level={course.level}
                lessonsCount={course.lessons.length}
                duration={course.duration}
                tags={course.tags}
                onOpen={() => onOpenCourse(course.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Курсы пока не найдены</h3>
            <p>Добавь документы в коллекцию `courses`, чтобы каталог появился здесь.</p>
          </div>
        )}
      </section>
    </main>
  );
}
