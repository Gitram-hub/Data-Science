import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Analysis from "./pages/Analysis"
import Login from "./pages/Login"
import Signup from "./pages/signup"
import Logout from "./pages/Logout"
export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/"
  element={
    <><Home/><About/></>}/>

        <Route path="/analysis" element={<Analysis/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/logout" element={<Logout/>}/>

      </Routes>
    </BrowserRouter>
  )
}
