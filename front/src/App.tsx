import { Route, Routes } from "react-router";
import HomeScreen from "@/screens/HomeScreen";
import "./main.css";
import CertificatesScreen from "./screens/CertificatesScreen";
import CreateCertificateScreen from "./screens/CreateCertificateScreen";
import CertificateDetailScreen from "./screens/CertificateDetailScreen";
import { RootLayout } from "./components/layout/RootLayout";
import EditCertificateScreen from "./screens/EditCertificateScreen";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomeScreen />} />
        <Route path="/certificates" element={<CertificatesScreen />} />
        <Route path="/certificates/:id" element={<CertificateDetailScreen />} />

        <Route
          path="/certificates/create"
          element={<CreateCertificateScreen />}
        />
        <Route
          path="/certificates/edit/:id"
          element={<EditCertificateScreen />}
        />
        <Route
          path="*"
          element={
            <div className="w-full h-screen flex items-center justify-center">
              404 not found
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
