import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Styled Components ---
const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
`;

const PageHeader = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 30px;
`;

const TableWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  border: 1px solid #e2e8f0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  color: #4a5568;

  th,
  td {
    padding: 16px 20px;
    text-align: left;
    white-space: nowrap;
  }

  th {
    background-color: #f7fafc;
    font-weight: 600;
    color: #718096;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e2e8f0;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease-in-out;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f7fafc;
  }
`;

const RankCell = styled.td`
  font-weight: 500;
  color: #4a5568;
  width: 50px;
`;

const CoinInfoCell = styled.td`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CoinLogo = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #edf2f7;
  overflow: hidden;

  img {
    width: 65%;
    height: 65%;
    object-fit: contain;
  }
`;

const CoinNamesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CoinName = styled.span`
  font-weight: 600;
  color: #1a202c;
  font-size: 15px;
`;

const CoinSymbol = styled.span`
  font-size: 13px;
  color: #718096;
`;

const MetricsCell = styled.td`
  min-width: 150px;
`;

const CurrentPrice = styled.div`
  font-weight: 600;
  color: #1a202c;
`;

const ChangeRate = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${(props) => (props.positive ? "#10b981" : "#ef4444")};
`;

const MarketCapCell = styled.td`
  font-weight: 500;
  color: #4a5568;
`;

const ActionsCell = styled.td`
  padding: 16px 10px !important;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FavoriteButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => (props.isFavorite ? "#ef4444" : "#cbd5e0")};
  background-color: ${(props) => (props.isFavorite ? "#fee2e2" : "#f7fafc")};
  border: 1px solid ${(props) => (props.isFavorite ? "#ef4444" : "#e2e8f0")};
  border-radius: 50%;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    transform: scale(1.1);
    color: #ef4444;
    background-color: #fee2e2;
    border-color: #ef4444;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ViewButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6366f1;
  background-color: #f0f2ff;
  border: 1px solid #e0e7ff;
  border-radius: 50%;
  transition: all 0.3s ease;
  padding: 0;
  font-weight: 600;
  font-size: 16px;

  &:hover {
    color: #ffffff;
    background-color: #6366f1;
    border-color: #6366f1;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  gap: 8px;
`;

const PaginationButton = styled.button`
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: ${(props) => (props.active ? "#6366f1" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#4a5568")};
  font-size: 14px;
  font-weight: 500;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.active ? "#5a5ceb" : "#f7fafc")};
  }
`;

// --- Helper functions ---
const formatMarketCap = (value) => {
  if (!value) return "-";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
};

const formatPrice = (value) => {
  if (!value && value !== 0) return "-";
  if (value >= 1000) return `$${value.toLocaleString()}`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(8)}`;
};

// --- Main Component ---
function StableCoins() {
  const navigate = useNavigate();

  const [coins, setCoins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState(new Set());
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCoins();
    fetchUserFavorites();
  }, []);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/coins/stablecoins");
      if (!response.ok) throw new Error("Failed to fetch coins");
      const data = await response.json();
      setCoins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const favSet = new Set(data.map((fav) => fav.coin_id));
        setFavorites(favSet);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const handleToggleFavorite = async (coin, e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add favorites");
      navigate("/login");
      return;
    }

    // Add to loading state
    setFavoriteLoading((prev) => new Set([...prev, coin.id]));

    try {
      const isFavorite = favorites.has(coin.id);

      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(
          `http://localhost:3000/api/favorites/${coin.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setFavorites((prev) => {
            const newSet = new Set(prev);
            newSet.delete(coin.id);
            return newSet;
          });
        }
      } else {
        // Add to favorites
        const response = await fetch("http://localhost:3000/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            coin_id: coin.id,
            coin_name: coin.name,
            coin_symbol: coin.symbol,
            coin_image: coin.image,
            current_price: coin.current_price,
          }),
        });

        if (response.ok) {
          setFavorites((prev) => new Set([...prev, coin.id]));
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorites");
    } finally {
      // Remove from loading state
      setFavoriteLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(coin.id);
        return newSet;
      });
    }
  };

  const totalPages = Math.ceil(coins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = coins.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (error) return <PageContainer>Error: {error}</PageContainer>;

  return (
    <PageContainer>
      <PageHeader>Stable Coins</PageHeader>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Coin</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>Market Cap</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((coin, index) => {
              const rank = startIndex + index + 1;
              const change = coin.price_change_percentage_24h?.toFixed(2);
              const isPositive = change >= 0;
              const isFavorite = favorites.has(coin.id);
              const isLoading = favoriteLoading.has(coin.id);

              return (
                <TableRow key={coin.id}>
                  <RankCell>#{rank}</RankCell>
                  <CoinInfoCell>
                    <CoinLogo>
                      <img src={coin.image} alt={coin.name} />
                    </CoinLogo>
                    <CoinNamesWrapper>
                      <CoinName>{coin.name}</CoinName>
                      <CoinSymbol>{coin.symbol?.toUpperCase()}</CoinSymbol>
                    </CoinNamesWrapper>
                  </CoinInfoCell>
                  <MetricsCell>
                    <CurrentPrice>
                      {formatPrice(coin.current_price)}
                    </CurrentPrice>
                  </MetricsCell>
                  <MetricsCell>
                    <ChangeRate positive={isPositive}>
                      {isPositive ? "+" : ""}
                      {change}%
                    </ChangeRate>
                  </MetricsCell>
                  <MarketCapCell>
                    {formatMarketCap(coin.market_cap)}
                  </MarketCapCell>
                  <ActionsCell>
                    <ActionButtons>
                      <FavoriteButton
                        isFavorite={isFavorite}
                        onClick={(e) => handleToggleFavorite(coin, e)}
                        disabled={isLoading}
                        title={
                          isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <Heart
                          size={18}
                          fill={isFavorite ? "#ef4444" : "none"}
                        />
                      </FavoriteButton>
                      <ViewButton
                        onClick={() => navigate(`/coin/${coin.id}`)}
                        title="View details"
                      >
                        →
                      </ViewButton>
                    </ActionButtons>
                  </ActionsCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>

      {/* Pagination */}
      <PaginationContainer>
        <PaginationButton
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} /> Prev
        </PaginationButton>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationButton
            key={page}
            active={currentPage === page}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </PaginationButton>
        ))}

        <PaginationButton
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight size={16} />
        </PaginationButton>
      </PaginationContainer>
    </PageContainer>
  );
}

export default StableCoins;
