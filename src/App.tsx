<<<<<<< HEAD
import CampusPage from "./Campus/CampusPage";
=======
import CampusPage from "./components/CampusPage";
>>>>>>> 87e4fae1d57893fb48bd547abb54780f8bfd22d5
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