export default function Header({
  activeView,
  onNavigateHome,
  onOpenCourse,
  onOpenLesson,
}) {
  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">Learning Management System</p>
        <h1 className="site-title">LMS Project</h1>
      </div>

      <nav className="nav-pills" aria-label="Навигация по приложению">
        <button
          type="button"
          className={activeView === "home" ? "is-active" : ""}
          onClick={onNavigateHome}
        >
          Курсы
        </button>
        <button
          type="button"
          className={activeView === "course" ? "is-active" : ""}
          onClick={onOpenCourse}
        >
          Программа
        </button>
        <button
          type="button"
          className={activeView === "lesson" ? "is-active" : ""}
          onClick={onOpenLesson}
        >
          Урок
        </button>
      </nav>
    </header>
  );
}
