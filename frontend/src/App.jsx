import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Admindashboard from "./admin/Admindashboard"
import AdminUploadBook from "./admin/AdminUploadBook";
import MyBooks from "./pages/MyBooks";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admindashboard" element={<Admindashboard />} />
        <Route path="/AdminUploadBook" element={<AdminUploadBook />} />

        <Route path="/" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/mybooks" element={<MyBooks />} />
      </Routes>
    </Router>
  )
}
