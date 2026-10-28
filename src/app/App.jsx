import { lazy, Suspense } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useMatch } from 'react-router-dom'
import { COURSES } from '../content/courses/index.js'
import { usePlayerStats } from '../hooks/usePlayerStats.js'
import { appEvents } from './appEvents.js'
import AppHeader from './AppHeader.jsx'
import { studentRepository } from './progressRepository.js'
import StudentProvider from '../features/students/StudentProvider.jsx'
import { useProgressRepository } from '../features/students/studentContext.js'
import LandingPage from '../features/landing/LandingPage.jsx'
import FeriaPage from '../features/feria/FeriaPage.jsx'
const CoursePage = lazy(() => import('../features/course/CoursePage.jsx'))
const LabPage = lazy(() => import('../features/sandbox/LabPage.jsx'))
const DemoExercisePage = lazy(() => import('../features/exercises/demo/DemoExercisePage.jsx'))
const LessonPage = lazy(() => import('../features/lessons/LessonPage.jsx'))
const FlashcardReviewPage = lazy(() => import('../features/flashcards/FlashcardReviewPage.jsx'))
const StudiedPage = lazy(() => import('../features/english/StudiedPage.jsx'))
const PracticePage = lazy(() => import('../features/practice/PracticePage.jsx'))
const VerbsPage = lazy(() => import('../features/verbs/VerbsPage.jsx'))
const FlashcardsPage = lazy(() => import('../features/flashcards/FlashcardsPage.jsx'))
const EndSessionPage = lazy(() => import('../features/tutoring/EndSessionPage.jsx'))
const RecapPage = lazy(() => import('../features/tutoring/RecapPage.jsx'))
const ClassModePage = lazy(() => import('../features/lessons/ClassModePage.jsx'))
const StudentsPage = lazy(() => import('../features/students/StudentsPage.jsx'))
const HomePage = lazy(() => import('./HomePage.jsx'))
const NotesUploadPage = lazy(() => import('../features/routes/NotesUploadPage.jsx'))
const RoutePlanPage = lazy(() => import('../features/routes/RoutePlanPage.jsx'))
const ChallengeHomePage = lazy(() => import('../features/challenge/ChallengeHomePage.jsx'))
const ChallengePlayPage = lazy(() => import('../features/challenge/ChallengePlayPage.jsx'))
const ChallengeBoardPage = lazy(() => import('../features/challenge/ChallengeBoardPage.jsx'))

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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feria" element={<FeriaPage />} />
        <Route
          path="/reto/ranking"
          element={
            <Suspense fallback={<p role="status">Cargando…</p>}>
              <ChallengeBoardPage />
            </Suspense>
          }
        />
        <Route element={<AppLayout stats={stats} />}>
          <Route path="/inicio" element={<HomePage stats={stats} />} />
          <Route path="/apuntes" element={<NotesUploadPage />} />
          <Route path="/ruta/:courseId" element={<RoutePlanPage />} />
          <Route path="/reto" element={<ChallengeHomePage />} />
          <Route path="/reto/jugar/:topicId" element={<ChallengePlayPage />} />
          <Route path="/clase/:courseId/:lessonId" element={<ClassModePage />} />
          <Route path="/laboratorio" element={<LabPage />} />
          <Route path="/recap" element={<RecapPage />} />
          <Route path="/tutoria" element={<EndSessionPage />} />
          <Route path="/ingles/estudiado" element={<StudiedPage />} />
          <Route path="/practica" element={<PracticePage />} />
          <Route path="/verbos" element={<VerbsPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/flashcards/:deckId" element={<FlashcardReviewPage />} />
          <Route path="/estudiantes" element={<StudentsPage />} />
          <Route path="/practica/demo" element={<DemoExercisePage />} />
          <Route path="/curso/:courseId" element={<CoursePage />} />
          <Route path="/curso/:courseId/leccion/:lessonId" element={<LessonPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function AppLayout({ stats }) {
  const onLesson = useMatch('/curso/:courseId/leccion/:lessonId')
  const onDeck = useMatch('/flashcards/:deckId')
  const onChallenge = useMatch('/reto/jugar/:topicId')
  const immersive = Boolean(onLesson || onDeck || onChallenge)

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <AppHeader stats={stats} immersive={immersive} />

      <main className="app-main" id="contenido" tabIndex={-1}>
        <Suspense fallback={<p role="status">Cargando…</p>}>
          <Outlet />
        </Suspense>
      </main>
    </>
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
