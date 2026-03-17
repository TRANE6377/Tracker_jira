import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { App } from './App'
import { AuthGuard } from '@/auth/auth.guard'
import { ROUTES } from '@/constants/routes'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { TasksPage } from '@/pages/TasksPage'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <Navigate to={ROUTES.tasks} replace /> },
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.register, element: <RegisterPage /> },
      {
        element: <AuthGuard />,
        children: [{ path: ROUTES.tasks, element: <TasksPage /> }],
      },
      { path: '*', element: <Navigate to={ROUTES.tasks} replace /> },
    ],
  },
])

