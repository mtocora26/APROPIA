import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { COURSES } from '../content/courses/index.js'
import PlayerBadge from '../features/gamification/PlayerBadge.jsx'
import { usePlayerStats } from '../hooks/usePlayerStats.js'
import { appEvents } from './appEvents.js'
import { studentRepository } from './progressRepository.js'
import StudentProvider from '../features/students/StudentProvider.jsx'
import StudentSwitcher from '../features/students/StudentSwitcher.jsx'
import StudentsPage from '../features/students/StudentsPage.jsx'
import { useProgressRepository } from '../features/students/studentContext.js'
import CoursePage from '../features/course/CoursePage.jsx'
import DemoExercisePage from '../features/exercises/demo/DemoExercisePage.jsx'
import LessonPage from '../features/lessons/LessonPage.jsx'
import FlashcardReviewPage from '../features/flashcards/FlashcardReviewPage.jsx'
import FlashcardsPage from '../features/flashcards/FlashcardsPage.jsx'
import HomePage from './HomePage.jsx'
import '../features/gamification/gamification.css'
import '../features/students/students.css'
import './App.css'

function AppShell() {
  const progressRepository = useProgressRepository()
  const stats = usePlayerStats({
    repository: progressRepository,
    courses: COURSES,
    events: appEvents,
  })

  return (
    <BrowserRouter>
      <header className="app-header">
        <Link to="/" className="app-brand">
          Tukola
        </Link>
        <div className="app-header__right">
          <StudentSwitcher />
          <PlayerBadge stats={stats} />
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage stats={stats} />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/flashcards/:deckId" element={<FlashcardReviewPage />} />
          <Route path="/estudiantes" element={<StudentsPage />} />
          <Route path="/practica/demo" element={<DemoExercisePage />} />
          <Route path="/curso/:courseId" element={<CoursePage />} />
          <Route
            path="/curso/:courseId/leccion/:lessonId"
            element={<LessonPage />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

function App() {
  return (
    <StudentProvider studentRepository={studentRepository}>
      <AppShell />
    </StudentProvider>
  )
}

export default App
