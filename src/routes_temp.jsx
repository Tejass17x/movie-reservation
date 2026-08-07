import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Movies from './pages/Movies'
import Theaters from './pages/Theaters'
import Screens from './pages/Screens'
import Showtimes from './pages/Showtimes'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'movies', element: <Movies /> },
      { path: 'theaters', element: <Theaters /> },
      { path: 'screens', element: <Screens /> },
      { path: 'showtimes', element: <Showtimes /> },
      { path: 'seats', element: <Dashboard /> },
      { path: 'bookings', element: <Dashboard /> },
      { path: 'analytics', element: <Dashboard /> },
      { path: 'settings', element: <Dashboard /> },
    ],
  },
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
