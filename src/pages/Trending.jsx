import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Styled Components
const Container = styled.div`
  /* Removed fixed width for better responsiveness and flow */
  padding: 24px;
  max-width: 1200px; /* Optional: Add a max-width to the overall content area */
  margin: 0 auto; /* Center the container if max-width is applied */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const Section = styled.div`
  margin-bottom: 48px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const SectionViewMore = styled.a`
  font-size: 14px;
  font-weight: 600;
  color: #6366f1;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap; /* Prevent "View more" from wrapping */
  margin-right: 16px; /* Space between View more and nav buttons */
  &:hover {
    text-decoration: underline;
  }
`;

const NavigationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* Gap between buttons */
`;

const NavControlButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f7fafc;
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  /* Ensure the container has a defined width so overflow can be hidden */
  /* This ensures the carousel content doesn't push beyond its parent */
  overflow: hidden;
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: 20px;
  /* Use index directly for transform for simpler calculation */
  transform: ${(props) => `translateX(-${props.offset}px)`};
  transition: transform 0.5s ease-in-out;
  /* Prevent shrinking of cards in flex container */
  flex-shrink: 0;
`;

const Card = styled.div`
  min-width: 280px; /* Fixed width for card */
  flex-shrink: 0; /* Important: Prevents cards from shrinking in flex container */
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const Icon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const CoinInfo = styled.div`
  flex: 1;
`;

const CoinName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
`;

const CoinSymbol = styled.div`
  font-size: 14px;
  color: #718096;
`;

const CardBody = styled.div`
  flex-grow: 1;
`;

const Price = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
`;

const Change = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.positive ? "#10b981" : "#ef4444")};
`;

const CardViewMoreButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  background-color: #f0f2ff;
  color: #6366f1;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #e4e6ff;
  }
`;

// Main Component
function Trending() {
  const navigate = useNavigate();
  const [stableCoins, setStableCoins] = useState([]);
  const [memeCoins, setMemeCoins] = useState([]);

  const [stableIndex, setStableIndex] = useState(0);
  const [memeIndex, setMemeIndex] = useState(0);

  const carouselRef = useRef(null);
  const [cardsPerView, setCardsPerView] = useState(4);
  const cardWidth = 280 + 20; // card width + gap

  // ✅ Fetch coins from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stableRes, memeRes] = await Promise.all([
          fetch("http://localhost:3000/coins/stablecoins"),
          fetch("http://localhost:3000/coins/memecoins"),
        ]);

        const stableData = await stableRes.json();
        const memeData = await memeRes.json();

        // Limit to top 10

        setStableCoins(stableData.slice(0, 10));
        setMemeCoins(memeData.slice(0, 10));
      } catch (err) {
        console.error("Error fetching coin data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle responsive cards per view
  useEffect(() => {
    const calculateCardsPerView = () => {
      if (carouselRef.current) {
        const wrapperWidth = carouselRef.current.offsetWidth;
        setCardsPerView(Math.max(1, Math.floor(wrapperWidth / cardWidth)));
      }
    };

    calculateCardsPerView();
    window.addEventListener("resize", calculateCardsPerView);
    return () => window.removeEventListener("resize", calculateCardsPerView);
  }, [cardWidth]);

  // ✅ Navigation handlers
  const handlePrev = (current, setter) => {
    setter(Math.max(0, current - 1));
  };

  const handleNext = (current, setter, maxLength) => {
    const maxIndex = Math.max(0, maxLength - cardsPerView);
    setter(Math.min(maxIndex, current + 1));
  };

  // ✅ Render carousel
  const renderCarousel = (coins, index, setter) => (
    <CarouselContainer ref={carouselRef}>
      <CarouselTrack offset={index * cardWidth}>
        {coins.map((coin) => (
          <Card key={coin.id}>
            <div>
              <CardHeader>
                <Icon>
                  <img src={coin.image} alt={coin.name} />
                </Icon>
                <CoinInfo>
                  <CoinName>{coin.name}</CoinName>
                  <CoinSymbol>{coin.symbol}</CoinSymbol>
                </CoinInfo>
              </CardHeader>
              <CardBody>
                <Price>${coin.current_price}</Price>
                <Change positive={coin.price_change_24h >= 0}>
                  {coin.change >= 0
                    ? `+${coin.price_change_24h}%`
                    : `${coin.price_change_24h}%`}
                </Change>
              </CardBody>
            </div>
            <CardViewMoreButton onClick={() => navigate(`/coin/${coin.id}`)}>
              View More
            </CardViewMoreButton>
          </Card>
        ))}
      </CarouselTrack>
    </CarouselContainer>
  );

  return (
    <Container>
      <Header>
        <Title>Trending Coins</Title>
      </Header>

      <Section>
        <SectionHeader>
          <SectionTitle>Stable Coins</SectionTitle>
          <NavigationControls>
            <SectionViewMore onClick={() => navigate(`/trending/stable-coins`)}>
              View more
            </SectionViewMore>
            <NavControlButton
              onClick={() => handlePrev(stableIndex, setStableIndex)}
              disabled={stableIndex === 0}
            >
              <ChevronLeft size={18} />
            </NavControlButton>
            <NavControlButton
              onClick={() =>
                handleNext(stableIndex, setStableIndex, stableCoins.length)
              }
              disabled={stableIndex >= stableCoins.length - cardsPerView}
            >
              <ChevronRight size={18} />
            </NavControlButton>
          </NavigationControls>
        </SectionHeader>
        {renderCarousel(stableCoins, stableIndex, setStableIndex)}
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Meme Coins</SectionTitle>
          <NavigationControls>
            <SectionViewMore onClick={() => navigate(`/trending/meme-coins`)}>
              View more
            </SectionViewMore>
            <NavControlButton
              onClick={() => handlePrev(memeIndex, setMemeIndex)}
              disabled={memeIndex === 0}
            >
              <ChevronLeft size={18} />
            </NavControlButton>
            <NavControlButton
              onClick={() =>
                handleNext(memeIndex, setMemeIndex, memeCoins.length)
              }
              disabled={memeIndex >= memeCoins.length - cardsPerView}
            >
              <ChevronRight size={18} />
            </NavControlButton>
          </NavigationControls>
        </SectionHeader>
        {renderCarousel(memeCoins, memeIndex, setMemeIndex)}
      </Section>
    </Container>
  );
}
export default Trending;
