import CampusPage from "./components/CampusPage";
import LoginPage from "./components/LoginPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainDeshboard from "./components/MainDeshboard";


export default function App() {

  return (
    // <MainDeshboard />
    // <LoginPage />
    // <CampusPage />
 <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Campus" element={<CampusPage />} />
        <Route path="/MainDeshboard" element={<MainDeshboard />} />
      </Routes>
    </BrowserRouter>

  );
}