import GlobalStyles from "./styles/GlobalStyles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CryptoLanding from "./pages/CryptoLanding";
import AppLayout from "./ui/AppLayout";
import Dashboard from "./pages/Dashboard";
import Trending from "./pages/Trending";
import StableCoins from "./pages/StableCoins";
import MemeCoins from "./pages/MemeCoins";
import AllCoins from "./pages/AllCoins";
import CoinReport from "./pages/CoinReport"; // Note: This route isn't used, consider removing if not needed.
import CoinDetails from "./pages/CoinDetails";
import Login from "./pages/Login";
import ChatAI from "./pages/ChatAI";
import ProtectedRoute from "./ui/ProtectedRoute"; // Import the ProtectedRoute

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route index element={<CryptoLanding />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes wrapped with AppLayout */}
          <Route element={<AppLayout />}>
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="trending"
              element={
                <ProtectedRoute>
                  <Trending />
                </ProtectedRoute>
              }
            />
            <Route
              path="trending/stable-coins"
              element={
                <ProtectedRoute>
                  <StableCoins />
                </ProtectedRoute>
              }
            />
            <Route
              path="trending/meme-coins"
              element={
                <ProtectedRoute>
                  <MemeCoins />
                </ProtectedRoute>
              }
            />
            <Route
              path="trending/all-coins"
              element={
                <ProtectedRoute>
                  <AllCoins />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coin/:id"
              element={
                <ProtectedRoute>
                  <CoinDetails />
                </ProtectedRoute>
              }
            />
            {/* The ChatAI route is now protected */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatAI />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
