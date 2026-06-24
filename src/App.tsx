// App.tsx
import CampusPage from "./Campus/CampusPage";
import LoginPage from "./components/LoginPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainDeshboard from "./components/MainDeshboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Campus" element={<CampusPage />} />
        <Route path="/MainDeshboard" element={<MainDeshboard />} />
        <Route path="/sections/:classId" element={<MainDeshboard />} />
      </Routes>
    </BrowserRouter>
  );
}