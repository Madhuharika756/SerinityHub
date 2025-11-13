import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout"
import Register from "./components/Register";
import Login from "./components/Login";
import About from "./components/About";
import Chat from "./components/Chat";
import { UserContextProvider } from './UserContext';
import MoodTrackerPage from "./components/MoodTrackerPage";
import RecommendationPage from "./components/RecommendationPage";

const App = () => {
  return (
    <>
      <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/moodTrackerPage" element={<MoodTrackerPage/>} />
            <Route path="/recommendations" element={<RecommendationPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
      </UserContextProvider>
    </>
  )
}

export default App;