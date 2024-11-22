import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { EthersProvider } from "@/context/EthersProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <EthersProvider>
        <App />
      </EthersProvider>
    </BrowserRouter>
  </StrictMode>
);
