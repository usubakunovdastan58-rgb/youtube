import { startTransition, useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { isFirebaseConfigured, loadCourses } from "./firebase";
import CoursePage from "./pages/CoursePage";
import Home from "./pages/Home";
import LessonPage from "./pages/LessonPage";

export default function App() {
  const [activeView, setActiveView] = useState("home");
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState("loading");
  const [statusMessage, setStatusMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function hydrateCourses() {
      setIsLoading(true);
      const result = await loadCourses();

      if (isCancelled) {
        return;
      }

      startTransition(() => {
        setCourses(result.courses);
        setDataSource(result.source);
        setStatusMessage(result.message || "");
        setLoadError(result.error || "");
      });

      setIsLoading(false);
    }

    hydrateCourses();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!courses.length) {
      setSelectedCourseId(null);
      setSelectedLessonId(null);
      return;
    }

    setSelectedCourseId((currentCourseId) => {
      const hasCurrentCourse = courses.some(
        (course) => course.id === currentCourseId,
      );

      return hasCurrentCourse ? currentCourseId : courses[0].id;
    });
  }, [courses]);

  const selectedCourse =
    courses.find((course) => course.id === selectedCourseId) || courses[0] || null;

  useEffect(() => {
    if (!selectedCourse) {
      setSelectedLessonId(null);
      return;
    }

    setSelectedLessonId((currentLessonId) => {
      const hasCurrentLesson = selectedCourse.lessons.some(
        (lesson) => lesson.id === currentLessonId,
      );

      return hasCurrentLesson ? currentLessonId : selectedCourse.lessons[0]?.id || null;
    });
  }, [selectedCourse]);

  const selectedLesson = selectedCourse
    ? selectedCourse.lessons.find((lesson) => lesson.id === selectedLessonId) ||
      selectedCourse.lessons[0] ||
      null
    : null;

  const selectedLessonIndex = selectedCourse
    ? selectedCourse.lessons.findIndex((lesson) => lesson.id === selectedLesson?.id)
    : -1;

  const nextLesson =
    selectedCourse && selectedLessonIndex >= 0
      ? selectedCourse.lessons[selectedLessonIndex + 1] || null
      : null;

  function handleOpenCourse(courseId) {
    const course = courses.find((courseItem) => courseItem.id === courseId);

    if (!course) {
      return;
    }

    setSelectedCourseId(course.id);
    setSelectedLessonId(course.lessons[0]?.id || null);
    setActiveView("course");
  }

  function handleOpenLesson(lessonId, courseId = selectedCourse?.id) {
    if (!courseId) {
      return;
    }

    setSelectedCourseId(courseId);
    setSelectedLessonId(lessonId);
    setActiveView("lesson");
  }

  function handleOpenNextLesson() {
    if (!nextLesson || !selectedCourse) {
      return;
    }

    handleOpenLesson(nextLesson.id, selectedCourse.id);
  }

  return (
    <div className="app-shell">
      <Header
        activeView={activeView}
        onNavigateHome={() => setActiveView("home")}
        onOpenCourse={() => selectedCourse && setActiveView("course")}
        onOpenLesson={() => selectedLesson && setActiveView("lesson")}
      />

      {isLoading && (
        <main className="page-content">
          <section className="page-panel empty-state">
            <p className="eyebrow">Загрузка</p>
            <h2>Подключаем курсы и уроки</h2>
            <p>Проверяем Firebase и готовим YouTube-видео для просмотра.</p>
          </section>
        </main>
      )}

      {!isLoading && activeView === "home" && (
        <Home
          courses={courses}
          onOpenCourse={handleOpenCourse}
          dataSource={dataSource}
          statusMessage={
            dataSource === "demo" && !isFirebaseConfigured()
              ? `${statusMessage} Когда появятся ключи и коллекция courses, приложение начнет читать Firestore.`
              : statusMessage
          }
          loadError={loadError}
        />
      )}

      {!isLoading && activeView === "course" && (
        <CoursePage
          course={selectedCourse}
          onBack={() => setActiveView("home")}
          onOpenLesson={handleOpenLesson}
        />
      )}

      {!isLoading && activeView === "lesson" && (
        <LessonPage
          course={selectedCourse}
          lesson={selectedLesson}
          nextLesson={nextLesson}
          onBackToCourse={() => setActiveView("course")}
          onOpenLesson={(lessonId) => handleOpenLesson(lessonId, selectedCourse?.id)}
          onOpenNextLesson={handleOpenNextLesson}
        />
      )}

      <Footer />
    </div>
  );
}
