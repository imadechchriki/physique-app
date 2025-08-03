import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./Components/auth/Login";
import Signup from "./Components/auth/Signup";
import Home from "./Home";

export default function App() {
  return (
     <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
         </Routes>
      </Router>
        );
}