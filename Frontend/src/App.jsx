import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { clearSession, setSession, useGetMeQuery } from './app/store.js'
import AdminLayout from './components/AdminLayout.jsx'
import AppLayout from './components/AppLayout.jsx'
import AuthPage from './pages/AuthPage.jsx'
import BookingDetailPage from './pages/BookingDetailPage.jsx'
import BookingsPage from './pages/BookingsPage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import VehicleDetailPage from './pages/VehicleDetailPage.jsx'
import VehiclesPage from './pages/VehiclesPage.jsx'
import AdminBookingsPage from './pages/admin/AdminBookingsPage.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminFleetPage from './pages/admin/AdminFleetPage.jsx'
import AdminReportsPage from './pages/admin/AdminReportsPage.jsx'
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx'

function SessionSync() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const { data: user, error, isSuccess, isError } = useGetMeQuery(undefined, { skip: !token })
  useEffect(() => {
    if (isSuccess && user) dispatch(setSession({ token, user }))
    if (isError && [401, 403].includes(error?.status)) dispatch(clearSession())
  }, [dispatch, token, user, isSuccess, isError, error])
  return null
}

export default function App() {
  return <>
    <SessionSync />
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="vehicles/:id" element={<VehicleDetailPage />} />
        <Route path="login" element={<AuthPage />} />
        <Route path="register" element={<AuthPage mode="register" />} />
        <Route path="my-bookings" element={<BookingsPage />} />
        <Route path="bookings/:id" element={<BookingDetailPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="fleet" element={<AdminFleetPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </>
}
