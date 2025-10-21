import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout"
import Login from "./components/Login";
import About from "./components/About";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App;