import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 👈 import BrowserRouter
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/cryptocurrency"> {/* 👈 set basename */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
