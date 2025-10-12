import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- Styled Components (Inspired by the Dashboard UI) ---

const PageContainer = styled.div`
  background-color: #f8faff;
  min-height: 100vh;
  padding: 40px;
  font-family: "Inter", sans-serif;
  color: #2d3748;
`;

const CoinHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
`;

const CoinLogo = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  padding: 8px; /* Add some padding around the logo */
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const CoinTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CoinName = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
`;

const CoinSymbol = styled.span`
  font-size: 18px;
  color: #718096;
  font-weight: 500;
`;

const SectionContainer = styled.div`
  margin-bottom: 40px;
`;

const SectionHeader = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 25px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #718096;
  margin-bottom: 8px;
`;

const Value = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #1a202c;
`;

const DescriptionCard = styled(Card)`
  line-height: 1.7;
  font-size: 16px;
  color: #4a5568;

  a {
    color: #6366f1;
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const MarketDataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Single column for market data */
  gap: 10px;
  padding-left: 10px;
`;

const MarketDataItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #edf2f7;
  &:last-child {
    border-bottom: none;
  }
`;

const MarketDataLabel = styled.span`
  color: #718096;
  font-size: 14px;
`;

const MarketDataValue = styled.span`
  font-weight: 500;
  color: #1a202c;
  font-size: 14px;
`;

const RecommendationText = styled.p`
  font-size: 15px;
  color: #4a5568;
`;

const NewsList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
`;

const NewsListItem = styled.li`
  margin-bottom: 8px;
  font-size: 15px;
  color: #4a5568;
  position: relative;
  padding-left: 15px;

  &:before {
    content: "•";
    color: #6366f1; /* Accent color for bullet points */
    position: absolute;
    left: 0;
    font-weight: bold;
    font-size: 1.2em;
    line-height: 1;
  }
`;

const ArticleText = styled.p`
  font-style: italic;
  font-size: 15px;
  color: #4a5568;
`;

const SocialAnalysisText = styled.p`
  font-size: 15px;
  color: #4a5568;
`;
const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
`;
const CardContent = styled.div`
  font-size: 15px;
  color: #4a5568;
  line-height: 1.6;
`;

const CardHeader = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// --- Helper functions ---
const formatPrice = (value) => {
  if (value === undefined || value === null) return "N/A";
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 8 : 2,
  })}`;
};

const formatLargeNumber = (value) => {
  if (value === undefined || value === null) return "N/A";
  return `$${value.toLocaleString("en-US")}`;
};

const formatChartData = (priceGraph, aiAnalysis) => {
  const historicalData = priceGraph.map((item) => ({
    timestamp: item.timestamp,
    date: new Date(item.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    actualPrice: item.price,
    predictedPrice: null,
  }));

  const predictedData =
    aiAnalysis?.predicted_prices?.map((item) => ({
      timestamp: item.timestamp,
      date: new Date(item.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      actualPrice: null,
      predictedPrice: item.price,
    })) || [];

  // Add the last historical point to predicted data for continuity
  if (historicalData.length > 0 && predictedData.length > 0) {
    const lastHistorical = historicalData[historicalData.length - 1];
    predictedData[0] = {
      ...predictedData[0],
      actualPrice: lastHistorical.actualPrice,
    };
  }

  return [...historicalData, ...predictedData];
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "10px",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#718096" }}>
          {payload[0].payload.date}
        </p>
        {payload.map(
          (entry, index) =>
            entry.value !== null && (
              <p
                key={index}
                style={{
                  margin: "0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: entry.color,
                }}
              >
                {entry.name}: ${entry.value.toFixed(8)}
              </p>
            )
        )}
      </div>
    );
  }
  return null;
};

// --- Main Component ---
function CoinDetails() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/coins/${id}`);
        if (!response.ok) throw new Error("Coin not found");
        const data = await response.json();
        setCoin(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [id]);

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (error) return <PageContainer>Error: {error}</PageContainer>;
  if (!coin) return <PageContainer>No data found</PageContainer>;

  const change24h = coin.market_data?.price_change_percentage_24h;
  const isPositiveChange = change24h >= 0;

  const chartData = formatChartData(coin.price_graph || [], coin.ai_analysis);

  return (
    <PageContainer>
      <CoinHeader>
        <CoinLogo
          src={coin.image?.large || coin.image?.thumb}
          alt={coin.name}
        />
        <CoinTitleWrapper>
          <CoinName>{coin.name}</CoinName>
          <CoinSymbol>{coin.symbol?.toUpperCase()}</CoinSymbol>
        </CoinTitleWrapper>
      </CoinHeader>

      <SectionContainer>
        <SectionHeader>Key Statistics</SectionHeader>
        <CardGrid>
          <Card>
            <Label>Current Price</Label>
            <Value>{formatPrice(coin.market_data?.current_price?.usd)}</Value>
          </Card>
          <Card>
            <Label>Market Cap</Label>
            <Value>
              {formatLargeNumber(coin.market_data?.market_cap?.usd)}
            </Value>
          </Card>
          <Card>
            <Label>24h Change</Label>
            <Value style={{ color: isPositiveChange ? "#10b981" : "#ef4444" }}>
              {change24h?.toFixed(2) ?? "N/A"}%
            </Value>
          </Card>
          <Card>
            <Label>Total Supply</Label>
            <Value>
              {coin.market_data?.total_supply?.toLocaleString() || "N/A"}
            </Value>
          </Card>
        </CardGrid>
      </SectionContainer>

      <SectionContainer>
        <SectionHeader>Price Chart (Historical & Predicted)</SectionHeader>
        <Card>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#718096"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#718096"
                tick={{ fontSize: 12 }}
                domain={["auto", "auto"]}
                tickFormatter={(value) => `$${value.toFixed(6)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="actualPrice"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                name="Actual Price"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="predictedPrice"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Predicted Price"
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </SectionContainer>

      <SectionContainer>
        <SectionHeader>About {coin.name}</SectionHeader>
        <DescriptionCard
          dangerouslySetInnerHTML={{
            __html: coin.description?.en || "No description available.",
          }}
        />
      </SectionContainer>
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Today's Best Product Recommendation</SectionTitle>
        </SectionHeader>
        <Card>
          <CardContent>
            Based on recent analysis,{" "}
            <strong style={{ color: "#6366f1" }}>Bitcoin</strong> shows strong
            market signals and increasing institutional interest.
          </CardContent>
        </Card>
      </SectionContainer>

      <SectionContainer>
        <CardGrid>
          <Card>
            <CardHeader>Top News Summary</CardHeader>
            <NewsList>
              <NewsListItem>Bitcoin hits new monthly high</NewsListItem>
              <NewsListItem>Ethereum staking volume increases</NewsListItem>
              <NewsListItem>Global regulation talks intensify</NewsListItem>
            </NewsList>
          </Card>

          <Card>
            <CardHeader>Articles We Chose for January</CardHeader>
            <ArticleText>
              Handpicked insights from the crypto world focusing on
              decentralized finance (DeFi) and Layer 2 scalability.
            </ArticleText>
          </Card>
        </CardGrid>
      </SectionContainer>

      <SectionContainer>
        <CardGrid>
          <Card>
            <CardHeader>Social Media Analysis</CardHeader>
            <SocialAnalysisText>
              Analyzing online discussions, 88% of users on Twitter and Reddit
              show positive outlooks on major cryptocurrencies.
            </SocialAnalysisText>
          </Card>

          <Card>
            <CardHeader>Top On-Chain Activity</CardHeader>
            <NewsList>
              <NewsListItem>Bitcoin - 1M daily transactions</NewsListItem>
              <NewsListItem>
                Ethereum - 900K smart contract interactions
              </NewsListItem>
              <NewsListItem>Solana - 700K active wallets</NewsListItem>
            </NewsList>
          </Card>
        </CardGrid>
      </SectionContainer>
    </PageContainer>
  );
}

export default CoinDetails;
