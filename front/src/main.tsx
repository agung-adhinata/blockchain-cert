import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import '@fontsource-variable/inter/index.css';
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { EthersProvider } from "@/context/EthersProvider.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <EthersProvider>
        <App />
        <Toaster/>
      </EthersProvider>
    </BrowserRouter>
  </StrictMode>
);
