import GlobalStyles from "./styles/GlobalStyles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CryptoLanding from "./pages/CryptoLanding";
import AppLayout from "./ui/AppLayout";
import Dashboard from "./pages/Dashboard";
import Trending from "./pages/Trending";
import StableCoins from "./pages/StableCoins";
import MemeCoins from "./pages/MemeCoins";
import AllCoins from "./pages/AllCoins";
import CoinReport from "./pages/CoinReport";
import CoinDetails from "./pages/CoinDetails";
import Login from "./pages/Login";
import ChatAI from "./pages/ChatAI";
function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route index element={<CryptoLanding />} />
          <Route path="/login" element={<Login />} />
          {/* Protected/Layout routes */}
          <Route element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="trending" element={<Trending />} />
            <Route path="trending/stable-coins" element={<StableCoins />} />
            <Route path="trending/meme-coins" element={<MemeCoins />} />
            <Route path="trending/all-coins" element={<AllCoins />} />
            <Route path="/coin/:id" element={<CoinDetails />} />
            <Route path="/chat" element={<ChatAI />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
