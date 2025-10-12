import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Heart, TrendingUp, TrendingDown, Star, LogOut } from "lucide-react";

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
`;

const WelcomeText = styled.p`
  font-size: 16px;
  color: #718096;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: linear-gradient(
    135deg,
    ${(props) => props.gradient || "#667eea 0%, #764ba2 100%"}
  );
  padding: 24px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1a202c;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatChange = styled.div`
  font-size: 13px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const CoinCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    border-color: #667eea;
  }
`;

const CoinHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CoinLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 70%;
    height: 70%;
    object-fit: contain;
  }
`;

const CoinNames = styled.div``;

const CoinName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
`;

const CoinSymbol = styled.div`
  font-size: 13px;
  color: #718096;
  text-transform: uppercase;
`;

const FavoriteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #ef4444;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const CoinPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
`;

const CoinChange = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.positive ? "#10b981" : "#ef4444")};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #718096;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #718096;
`;

function Dashboard() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalFavorites: 0,
    totalValue: 0,
    avgChange: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchFavorites(token);
  }, [navigate]);

  const fetchFavorites = async (token) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }

      const data = await response.json();

      // Fetch updated prices for each favorite
      const updatedFavorites = await Promise.all(
        data.map(async (fav) => {
          try {
            const coinResponse = await fetch(
              `http://localhost:3000/coins/${fav.coin_id}`
            );
            if (coinResponse.ok) {
              const coinData = await coinResponse.json();
              return {
                ...fav,
                current_price:
                  coinData.market_data?.current_price?.usd || fav.current_price,
                price_change_percentage_24h:
                  coinData.market_data?.price_change_percentage_24h || 0,
              };
            }
            return fav;
          } catch {
            return fav;
          }
        })
      );

      setFavorites(updatedFavorites);

      // Calculate stats
      const totalValue = updatedFavorites.reduce(
        (sum, coin) => sum + (parseFloat(coin.current_price) || 0),
        0
      );
      const avgChange =
        updatedFavorites.length > 0
          ? updatedFavorites.reduce(
              (sum, coin) => sum + (coin.price_change_percentage_24h || 0),
              0
            ) / updatedFavorites.length
          : 0;

      setStats({
        totalFavorites: updatedFavorites.length,
        totalValue,
        avgChange,
      });
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (coinId, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/api/favorites/${coinId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setFavorites((prev) => prev.filter((fav) => fav.coin_id !== coinId));
        setStats((prev) => ({
          ...prev,
          totalFavorites: prev.totalFavorites - 1,
        }));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatPrice = (value) => {
    if (!value && value !== 0) return "$0.00";
    if (value >= 1000) return `$${value.toLocaleString()}`;
    if (value >= 1) return `$${value.toFixed(2)}`;
    if (value >= 0.01) return `$${value.toFixed(4)}`;
    return `$${value.toFixed(8)}`;
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>Loading your dashboard...</LoadingState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <PageTitle>Dashboard</PageTitle>
          <WelcomeText>
            Welcome back, {user?.username || "User"}! 👋
          </WelcomeText>
        </HeaderLeft>
      </Header>

      <StatsGrid>
        <StatCard gradient="#ffffff 0%, #ffffff 100%">
          <StatLabel>Total Favorites</StatLabel>
          <StatValue style={{ color: "#000" }}>
            {stats.totalFavorites}
          </StatValue>
          <StatChange style={{ color: "#000" }}>
            <Star size={16} color="#000" />
            Coins tracked
          </StatChange>
        </StatCard>

        <StatCard gradient="#ffffff 0%, #ffffff 100%">
          <StatLabel>Combined Value</StatLabel>
          <StatValue style={{ color: "#000" }}>
            {formatPrice(stats.totalValue)}
          </StatValue>
          <StatChange style={{ color: "#000" }}>
            <TrendingUp size={16} color="#000" />
            Portfolio value
          </StatChange>
        </StatCard>

        <StatCard gradient="#ffffff 0%, #ffffff 100%">
          <StatLabel>Average 24h Change</StatLabel>
          <StatValue style={{ color: "#000" }}>
            {stats.avgChange >= 0 ? "+" : ""}
            {stats.avgChange.toFixed(2)}%
          </StatValue>
          <StatChange style={{ color: "#000" }}>
            {stats.avgChange >= 0 ? (
              <TrendingUp size={16} color="#000" />
            ) : (
              <TrendingDown size={16} color="#000" />
            )}
            Across all favorites
          </StatChange>
        </StatCard>
      </StatsGrid>

      <SectionTitle>
        <Heart size={24} fill="#ef4444" color="#ef4444" />
        Your Favorite Coins
      </SectionTitle>

      {favorites.length === 0 ? (
        <EmptyState>
          <EmptyIcon>💎</EmptyIcon>
          <EmptyTitle>No favorites yet</EmptyTitle>
          <EmptyText>
            Start adding coins to your favorites to track them here!
          </EmptyText>
        </EmptyState>
      ) : (
        <FavoritesGrid>
          {favorites.map((coin) => {
            const change = coin.price_change_percentage_24h || 0;
            const isPositive = change >= 0;

            return (
              <CoinCard
                key={coin.coin_id}
                onClick={() => navigate(`/coin/${coin.coin_id}`)}
              >
                <CoinHeader>
                  <CoinInfo>
                    <CoinLogo>
                      <img src={coin.coin_image} alt={coin.coin_name} />
                    </CoinLogo>
                    <CoinNames>
                      <CoinName>{coin.coin_name}</CoinName>
                      <CoinSymbol>{coin.coin_symbol}</CoinSymbol>
                    </CoinNames>
                  </CoinInfo>
                  <FavoriteButton
                    onClick={(e) => handleRemoveFavorite(coin.coin_id, e)}
                  >
                    <Heart size={20} fill="#ef4444" />
                  </FavoriteButton>
                </CoinHeader>

                <CoinPrice>{formatPrice(coin.current_price)}</CoinPrice>
                <CoinChange positive={isPositive}>
                  {isPositive ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {isPositive ? "+" : ""}
                  {change.toFixed(2)}% (24h)
                </CoinChange>
              </CoinCard>
            );
          })}
        </FavoritesGrid>
      )}
    </PageContainer>
  );
}

export default Dashboard;
