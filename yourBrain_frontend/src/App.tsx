import { Signin } from './pages/Signin'; 
import { Signup } from "./pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { Dashboard } from './pages/dashboard'; 
import { SharePage } from './pages/SharePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/signin" element={<Signin />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/share/:id" element={<SharePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 