import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Basics from './pages/Basics.jsx'
import Vocabulary from './pages/Vocabulary.jsx'
import Grammar from './pages/Grammar.jsx'
import Phrases from './pages/Phrases.jsx'
import Practice from './pages/Practice.jsx'
import Videos from './pages/Videos.jsx'
import Exam from './pages/Exam.jsx'
import LearnPreview from './pages/LearnPreview'
import CoursePreview from './pages/CoursePreview'
import UnitPreview from './pages/UnitPreview'
import LessonFlowPreview from './pages/LessonFlowPreview'
import NotFound from './pages/NotFound.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: Dashboard },
      { path: 'learn', Component: LearnPreview },
      { path: 'learn/a1', Component: CoursePreview },
      { path: 'learn/a1/unit/first-contact', Component: UnitPreview },
      { path: 'learn/a1/unit/first-contact/lesson/greetings', Component: LessonFlowPreview },
      { path: 'library/basics', Component: Basics },
      { path: 'library/vocabulary', Component: Vocabulary },
      { path: 'library/grammar', Component: Grammar },
      { path: 'library/phrases', Component: Phrases },
      { path: 'library/practice', Component: Practice },
      { path: 'library/videos', Component: Videos },
      { path: 'tef', Component: Exam },
      { path: '*', Component: NotFound },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
