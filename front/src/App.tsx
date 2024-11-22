import { Route, Routes } from "react-router";
import HomeScreen from "@/screens/HomeScreen";
import "./main.css";
import CertificatesScreen from "./screens/CertificatesScreen";

function App() {
  return (
    <Routes>
      <Route index element={<HomeScreen />} />
      <Route path="/certificate" element={<CertificatesScreen />} />
      <Route
        path="*"
        element={
          <div className="w-full h-screen flex items-center justify-center">
            404 not found
          </div>
        }
      />
    </Routes>
  );
}

export default App;
