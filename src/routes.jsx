import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Movies from './pages/Movies'
import Theaters from './pages/Theaters'
import Screens from './pages/Screens'
import Showtimes from './pages/Showtimes'
import Seats from './pages/Seats'
import Bookings from './pages/Bookings'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

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
      { path: 'seats', element: <Seats /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
