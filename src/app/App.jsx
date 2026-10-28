import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useMatch, useNavigate } from 'react-router-dom'
import { COURSES } from '../content/courses/index.js'
import { usePlayerStats } from '../hooks/usePlayerStats.js'
import { appEvents } from './appEvents.js'
import AppHeader from './AppHeader.jsx'
import {
  asksForDemoMode,
  DEMO_FORCED,
  DEMO_HOME,
  DEMO_OFF_PATH,
  DEMO_ON_PATH,
  isDemoMode,
  isDemoPath,
  locksOnVisit,
  markOrganizerDevice,
  setDemoMode,
} from './demoMode.js'
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
        <Route element={<DemoGate />}>
        <Route path={DEMO_ON_PATH} element={<DemoSwitch on />} />
        <Route path={DEMO_OFF_PATH} element={<DemoSwitch on={false} />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

/**
 * In modo feria, anything outside the demo sends the visitor to the Reto.
 * Opening `/feria` (the printed QR) turns it on, except on the organizer's device.
 */
function DemoGate() {
  const { pathname, search } = useLocation()
  const asked = asksForDemoMode(search) || locksOnVisit(pathname)

  useEffect(() => {
    if (asked) setDemoMode(true)
  }, [asked])

  if ((asked || isDemoMode()) && !isDemoPath(pathname)) return <Navigate to={DEMO_HOME} replace />
  return <Outlet />
}

function DemoSwitch({ on }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (DEMO_FORCED) return
    setDemoMode(on)
    // Whoever turns it off is the organizer: /feria stops locking this device.
    if (!on) markOrganizerDevice()
    navigate(on ? DEMO_HOME : '/inicio', { replace: true })
  }, [on, navigate])

  if (DEMO_FORCED) {
    return <p role="status">Esta versión de APROPIA siempre está en modo feria.</p>
  }
  return <p role="status">{on ? 'Activando el modo feria…' : 'Saliendo del modo feria. Este equipo queda como organizador…'}</p>
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
      <AppHeader stats={stats} immersive={immersive} demo={isDemoMode()} />

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
