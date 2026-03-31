import { getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const demoCourses = [
  {
    id: "react-firebase",
    title: "React + Firebase LMS",
    description:
      "Демо-курс для проверки интерфейса, пока Firebase не подключен к реальному проекту.",
    level: "Beginner",
    duration: "3 недели",
    tags: ["React", "Firebase", "YouTube"],
    order: 1,
    lessons: [
      {
        id: "firebase-structure",
        title: "Структура курса в Firestore",
        duration: "11 минут",
        summary:
          "Смотрим, как хранить курсы, уроки и поле videoUrl в базе данных.",
        videoUrl: "https://www.youtube.com/watch?v=34rp6KVGIEM",
        order: 1,
      },
      {
        id: "youtube-embed",
        title: "Встраивание YouTube через iframe",
        duration: "9 минут",
        summary:
          "Учимся превращать обычную ссылку YouTube в embed-плеер на странице урока.",
        videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
        order: 2,
      },
      {
        id: "lesson-page",
        title: "Страница урока и список тем",
        duration: "14 минут",
        summary:
          "Добавляем боковой список уроков и подсветку текущего видео в интерфейсе LMS.",
        videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
        order: 3,
      },
    ],
  },
  {
    id: "frontend-layout",
    title: "Frontend Layout for Courses",
    description:
      "Второй курс с тем же форматом данных, чтобы можно было проверить каталог и переключение между уроками.",
    level: "Intermediate",
    duration: "2 недели",
    tags: ["UI", "Components", "Video"],
    order: 2,
    lessons: [
      {
        id: "catalog-ui",
        title: "Каталог курсов",
        duration: "8 минут",
        summary:
          "Собираем главную страницу, карточки курсов и краткие метрики платформы.",
        videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
        order: 1,
      },
      {
        id: "responsive-video",
        title: "Адаптивный видеоплеер",
        duration: "13 минут",
        summary:
          "Делаем YouTube iframe адаптивным, чтобы уроки корректно смотрелись на телефоне и ноутбуке.",
        videoUrl: "https://www.youtube.com/watch?v=srvUrASNj0s",
        order: 2,
      },
    ],
  },
];

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function hasFirebaseConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

function getFirebaseApp() {
  if (!hasFirebaseConfig()) {
    return null;
  }

  return getApps()[0] || initializeApp(firebaseConfig);
}

function getDatabase() {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}

function normalizeText(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeTags(tags) {
  return Array.isArray(tags)
    ? tags.filter((tag) => typeof tag === "string" && tag.trim())
    : [];
}

function sortByOrder(items) {
  return [...items].sort((left, right) => {
    const leftOrder = normalizeNumber(left.order, Number.MAX_SAFE_INTEGER);
    const rightOrder = normalizeNumber(right.order, Number.MAX_SAFE_INTEGER);

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.title.localeCompare(right.title, "ru");
  });
}

function normalizeLesson(id, lesson = {}, index = 0) {
  return {
    id,
    title: normalizeText(lesson.title, `Урок ${index + 1}`),
    duration: normalizeText(lesson.duration, "Без длительности"),
    summary: normalizeText(
      lesson.summary,
      "Описание урока пока не добавлено в базе данных.",
    ),
    videoUrl: normalizeText(lesson.videoUrl, ""),
    order: normalizeNumber(lesson.order, index + 1),
  };
}

function normalizeLessons(lessons = []) {
  return sortByOrder(
    lessons.map((lesson, index) =>
      normalizeLesson(lesson.id || `lesson-${index + 1}`, lesson, index),
    ),
  );
}

function normalizeCourse(id, course = {}, lessons = [], index = 0) {
  return {
    id,
    title: normalizeText(course.title, `Курс ${index + 1}`),
    description: normalizeText(
      course.description,
      "Описание курса пока не добавлено в Firebase.",
    ),
    level: normalizeText(course.level, "Не указан"),
    duration: normalizeText(course.duration, "Без срока"),
    tags: normalizeTags(course.tags),
    order: normalizeNumber(course.order, index + 1),
    lessons: normalizeLessons(lessons),
  };
}

async function fetchLessonsFromSubcollection(courseRef) {
  const lessonsSnapshot = await getDocs(collection(courseRef, "lessons"));

  if (lessonsSnapshot.empty) {
    return [];
  }

  return lessonsSnapshot.docs.map((lessonDoc, index) =>
    normalizeLesson(lessonDoc.id, lessonDoc.data(), index),
  );
}

export function isFirebaseConfigured() {
  return hasFirebaseConfig();
}

export async function loadCourses() {
  const db = getDatabase();

  if (!db) {
    return {
      courses: demoCourses,
      source: "demo",
      message:
        "Firebase пока не настроен через VITE_FIREBASE_* переменные, поэтому сейчас показаны демо-данные.",
    };
  }

  try {
    const courseSnapshot = await getDocs(collection(db, "courses"));

    const courses = await Promise.all(
      courseSnapshot.docs.map(async (courseDoc, index) => {
        const courseData = courseDoc.data();

        let lessons = Array.isArray(courseData.lessons)
          ? normalizeLessons(courseData.lessons)
          : [];

        const nestedLessons = await fetchLessonsFromSubcollection(courseDoc.ref);
        if (nestedLessons.length) {
          lessons = nestedLessons;
        }

        return normalizeCourse(courseDoc.id, courseData, lessons, index);
      }),
    );

    const normalizedCourses = sortByOrder(courses);

    return {
      courses: normalizedCourses,
      source: "firebase",
      message:
        normalizedCourses.length > 0
          ? "Курсы и уроки загружены из Firebase."
          : "Firebase подключен, но в коллекции courses пока нет данных.",
    };
  } catch (error) {
    console.error("Failed to load courses from Firebase", error);

    return {
      courses: demoCourses,
      source: "demo",
      message:
        "Не удалось прочитать данные из Firebase. Для проверки интерфейса показаны демо-данные.",
      error: error instanceof Error ? error.message : "Unknown Firebase error",
    };
  }
}
