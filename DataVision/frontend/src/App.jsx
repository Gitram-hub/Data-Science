import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Analysis from "./pages/Analysis"

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/"
  element={
    <><Home/><About/></>}/>

        <Route path="/analysis" element={<Analysis/>}/>

      </Routes>
    </BrowserRouter>
  )
}
