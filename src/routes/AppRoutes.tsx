import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import BikeUsers from '../pages/Main/BikeUsers'
import CarUsers from '../pages/Main/CarUsers'
import Generate from '../pages/Main/Generate'
import Home from '../pages/Main/Home'
import Overview from '../pages/Main/Overview'
import People from '../pages/Main/People'
import Vendors from '../pages/Main/Vendors'
import AdminAdd from '../pages/AdminAddition/AdminAdd'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route element={<Home />}>
        <Route path="/overview" element={<Overview />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/bike-users" element={<BikeUsers />} />
        <Route path="/car-users" element={<CarUsers />} />
        <Route path="/people" element={<People />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/add-admin" element={<AdminAdd />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
