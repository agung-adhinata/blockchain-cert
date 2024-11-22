import { Route, Routes } from "react-router";
import HomeScreen from "@/screens/HomeScreen";
import "./main.css";
import CertificatesScreen from "./screens/CertificatesScreen";
import CreateCertificateScreen from "./screens/CreateCertificateScreen";

function App() {
  return (
    <Routes>
      <Route index element={<HomeScreen />} />
      <Route path="/certificates" element={<CertificatesScreen />} />
      <Route
        path="/certificates/create"
        element={<CreateCertificateScreen />}
      />
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
