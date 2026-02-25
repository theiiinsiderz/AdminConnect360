import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import Generate from '../pages/Main/Generate'
import Home from '../pages/Main/Home'
import Overview from '../pages/Main/Overview'
import Vendors from '../pages/Main/Vendors'
import AdminAdd from '../pages/AdminAddition/AdminAdd'
import TagManager from '../pages/Main/Tags/TagManager'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route element={<Home />}>
        <Route path="/overview" element={<Overview />} />
        <Route path="/generate" element={<Generate />} />
        {/* Tag Management Routes */}
        <Route path="/tags/car" element={<TagManager type="CAR" />} />
        <Route path="/tags/bike" element={<TagManager type="BIKE" />} />
        <Route path="/tags/pet" element={<TagManager type="PET" />} />
        <Route path="/tags/kid" element={<TagManager type="KID" />} />

        <Route path="/vendors" element={<Vendors />} />
        <Route path="/add-admin" element={<AdminAdd />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
