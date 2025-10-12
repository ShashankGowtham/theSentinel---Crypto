import React, { useState } from "react";
import styled from "styled-components";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRight as MoreIcon,
} from "lucide-react"; // Renamed for clarity

// --- 1. Data: StableCoins Data ---
const stableCoinsData = [
  {
    id: 1,
    name: "Tether",
    symbol: "USDT",
    price: 1.0002,
    change: "+0.01%",
    iconUrl: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=024",
  },
  {
    id: 2,
    name: "USD Coin",
    symbol: "USDC",
    price: 0.9998,
    change: "-0.01%",
    iconUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=024",
  },
  {
    id: 3,
    name: "DAI",
    symbol: "DAI",
    price: 0.9999,
    change: "+0.00%",
    iconUrl:
      "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=024",
  },
  {
    id: 4,
    name: "Binance USD",
    symbol: "BUSD",
    price: 1.0001,
    change: "+0.00%",
    iconUrl: "https://cryptologos.cc/logos/binance-usd-busd-logo.svg?v=024",
  },
  {
    id: 5,
    name: "TrueUSD",
    symbol: "TUSD",
    price: 1.0,
    change: "+0.01%",
    iconUrl: "https://cryptologos.cc/logos/trueusd-tusd-logo.svg?v=024",
  },
  {
    id: 6,
    name: "Pax Dollar",
    symbol: "USDP",
    price: 1.0003,
    change: "+0.02%",
    iconUrl: "https://cryptologos.cc/logos/paxos-standard-pax-logo.svg?v=024",
  },
  {
    id: 7,
    name: "Gemini Dollar",
    symbol: "GUSD",
    price: 0.9997,
    change: "-0.02%",
    iconUrl: "https://cryptologos.cc/logos/gemini-dollar-gusd-logo.svg?v=024",
  },
  {
    id: 8,
    name: "FRAX",
    symbol: "FRAX",
    price: 1.0005,
    change: "+0.03%",
    iconUrl: "https://cryptologos.cc/logos/frax-frax-logo.svg?v=024",
  },
  {
    id: 9,
    name: "Liquidity USD",
    symbol: "LUSD",
    price: 0.9996,
    change: "-0.03%",
    iconUrl: "https://cryptologos.cc/logos/liquity-usd-lusd-logo.svg?v=024",
  },
  {
    id: 10,
    name: "Neutrino USD",
    symbol: "USDN",
    price: 1.0004,
    change: "+0.02%",
    iconUrl: "https://cryptologos.cc/logos/neutrino-usd-usdn-logo.svg?v=024",
  },
  {
    id: 11,
    name: "TerraClassicUSD",
    symbol: "USTC",
    price: 0.025,
    change: "-1.23%",
    iconUrl: "https://cryptologos.cc/logos/terrausd-ust-logo.svg?v=024",
  },
  {
    id: 12,
    name: "e-Money EUR",
    symbol: "EEUR",
    price: 1.08,
    change: "+0.05%",
    iconUrl: "https://cryptologos.cc/logos/e-money-eur-eeur-logo.svg?v=024",
  },
  {
    id: 13,
    name: "Euro Coin",
    symbol: "EUROC",
    price: 1.07,
    change: "+0.03%",
    iconUrl: "https://cryptologos.cc/logos/euro-coin-euroc-logo.svg?v=024",
  },
  {
    id: 14,
    name: "Celo Dollar",
    symbol: "cUSD",
    price: 1.0001,
    change: "+0.00%",
    iconUrl: "https://cryptologos.cc/logos/celo-dollar-cusd-logo.svg?v=024",
  },
  {
    id: 15,
    name: "Magic Internet Money",
    symbol: "MIM",
    price: 0.9995,
    change: "-0.01%",
    iconUrl:
      "https://cryptologos.cc/logos/magic-internet-money-mim-logo.svg?v=024",
  },
  {
    id: 16,
    name: "Dei",
    symbol: "DEI",
    price: 0.85,
    change: "-0.50%",
    iconUrl: "https://cryptologos.cc/logos/dei-dei-logo.svg?v=024",
  },
  {
    id: 17,
    name: "sUSD",
    symbol: "SUSD",
    price: 1.0,
    change: "+0.00%",
    iconUrl: "https://cryptologos.cc/logos/synthetic-usd-susd-logo.svg?v=024",
  },
  {
    id: 18,
    name: "Alchemix USD",
    symbol: "ALUSD",
    price: 1.0002,
    change: "+0.01%",
    iconUrl: "https://cryptologos.cc/logos/alchemix-usd-alusd-logo.svg?v=024",
  },
  {
    id: 19,
    name: "FEI",
    symbol: "FEI",
    price: 0.9989,
    change: "-0.02%",
    iconUrl: "https://cryptologos.cc/logos/fei-protocol-fei-logo.svg?v=024",
  },
  {
    id: 20,
    name: "Litecoin Cash",
    symbol: "LCC",
    price: 0.003,
    change: "+0.10%",
    iconUrl: "https://cryptologos.cc/logos/litecoin-cash-lcc-logo.svg?v=024",
  },
  {
    id: 21,
    name: "Wrapped UST",
    symbol: "WUST",
    price: 0.025,
    change: "-1.23%",
    iconUrl:
      "https://cryptologos.cc/logos/wrapped-terrausd-wust-logo.svg?v=024",
  },
  {
    id: 22,
    name: "USDX",
    symbol: "USDX",
    price: 0.999,
    change: "-0.01%",
    iconUrl: "https://cryptologos.cc/logos/usdx-usdx-logo.svg?v=024",
  },
  {
    id: 23,
    name: "Empty Set Dollar",
    symbol: "ESD",
    price: 0.00005,
    change: "+0.05%",
    iconUrl: "https://cryptologos.cc/logos/empty-set-dollar-esd-logo.svg?v=024",
  },
  {
    id: 24,
    name: "BitCanna",
    symbol: "BCNA",
    price: 0.03,
    change: "-0.01%",
    iconUrl: "https://cryptologos.cc/logos/bitcanna-bcna-logo.svg?v=024",
  },
  {
    id: 25,
    name: "FlexUSD",
    symbol: "FLEXUSD",
    price: 1.0001,
    change: "+0.00%",
    iconUrl: "https://cryptologos.cc/logos/flexusd-flexusd-logo.svg?v=024",
  },
  {
    id: 26,
    name: "Iron Titanium Token",
    symbol: "TITAN",
    price: 0.0000001,
    change: "+0.00%",
    iconUrl:
      "https://cryptologos.cc/logos/iron-titanium-token-titan-logo.svg?v=024",
  },
  {
    id: 27,
    name: "HUSD",
    symbol: "HUSD",
    price: 0.9998,
    change: "-0.01%",
    iconUrl: "https://cryptologos.cc/logos/husd-husd-logo.svg?v=024",
  },
  {
    id: 28,
    name: "RSV",
    symbol: "RSV",
    price: 1.0003,
    change: "+0.02%",
    iconUrl: "https://cryptologos.cc/logos/reserve-token-rsv-logo.svg?v=024",
  },
  {
    id: 29,
    name: "DefiDollar",
    symbol: "DFD",
    price: 0.9996,
    change: "-0.01%",
    iconUrl: "https://cryptologos.cc/logos/defidollar-dfd-logo.svg?v=024",
  },
  {
    id: 30,
    name: "Sperax USD",
    symbol: "USDS",
    price: 1.0,
    change: "+0.00%",
    iconUrl: "https://cryptologos.cc/logos/sperax-usd-usds-logo.svg?v=024",
  },
];

// --- 2. Styled Components ---
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

  ${(props) =>
    props.rank === 1 &&
    `
    background: linear-gradient(90deg, rgba(251, 191, 36, 0.05) 0%, rgba(252, 211, 77, 0.02) 100%);
    border-left: 3px solid #fbbf24;
    
    &:hover {
      background: linear-gradient(90deg, rgba(251, 191, 36, 0.08) 0%, rgba(252, 211, 77, 0.04) 100%);
    }
  `}

  ${(props) =>
    props.rank === 2 &&
    `
    background: linear-gradient(90deg, rgba(156, 163, 175, 0.05) 0%, rgba(209, 213, 219, 0.02) 100%);
    border-left: 3px solid #9ca3af;
    
    &:hover {
      background: linear-gradient(90deg, rgba(156, 163, 175, 0.08) 0%, rgba(209, 213, 219, 0.04) 100%);
    }
  `}
  
  ${(props) =>
    props.rank === 3 &&
    `
    background: linear-gradient(90deg, rgba(146, 64, 14, 0.05) 0%, rgba(180, 83, 9, 0.02) 100%);
    border-left: 3px solid #92400e;
    
    &:hover {
      background: linear-gradient(90deg, rgba(146, 64, 14, 0.08) 0%, rgba(180, 83, 9, 0.04) 100%);
    }
  `}
`;

const RankCell = styled.td`
  font-weight: 500;
  color: #4a5568;
  width: 50px;
  ${(props) =>
    props.rank === 1 &&
    `
    font-weight: 700;
    color: #fbbf24;
    text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
  `}
  ${(props) =>
    props.rank === 2 &&
    `
    font-weight: 700;
    color: #9ca3af;
    text-shadow: 0 0 10px rgba(156, 163, 175, 0.3);
  `}
  ${(props) =>
    props.rank === 3 &&
    `
    font-weight: 700;
    color: #92400e;
    text-shadow: 0 0 10px rgba(146, 64, 14, 0.3);
  `}
`;

const CoinInfoCell = styled.td`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
`;

const CoinLogo = styled.div`
  width: 32px;
  height: 32px;
  min-width: 32px;
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
  justify-content: center;
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
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.positive ? "#10b981" : "#ef4444")};
`;

const ActionsCell = styled.td`
  width: 40px;
  text-align: right;
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6366f1;
  background-color: #f0f2ff;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
  border: none;

  &:hover {
    color: #ffffff;
    background-color: #6366f1;
    transform: scale(1.1);
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
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.active ? "#5a5ceb" : "#f7fafc")};
  }
`;

// Helper function to format price
const formatPrice = (value) => {
  if (!value && value !== 0) return "-";
  if (value >= 1000)
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(8)}`;
};

// --- 3. Main Page Component ---

function AllCoins() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(stableCoinsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = stableCoinsData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((coin, index) => {
              const globalRank = startIndex + index + 1;
              const isPositiveChange = coin.change?.startsWith("+");

              return (
                <TableRow key={coin.id} rank={globalRank}>
                  <RankCell rank={globalRank}>#{globalRank}</RankCell>
                  <CoinInfoCell>
                    <CoinLogo>
                      <img
                        src={coin.iconUrl || ""}
                        alt={`${coin.name || "Unknown"} logo`}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </CoinLogo>
                    <CoinNamesWrapper>
                      <CoinName>{coin.name || "-"}</CoinName>
                      <CoinSymbol>{coin.symbol || "-"}</CoinSymbol>
                    </CoinNamesWrapper>
                  </CoinInfoCell>
                  <MetricsCell>
                    <CurrentPrice>{formatPrice(coin.price)}</CurrentPrice>
                  </MetricsCell>
                  <MetricsCell>
                    <ChangeRate positive={isPositiveChange}>
                      {coin.change || "-"}
                    </ChangeRate>
                  </MetricsCell>
                  <ActionsCell>
                    <ActionButton>
                      <MoreIcon size={20} />
                    </ActionButton>
                  </ActionsCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>

      <PaginationContainer>
        <PaginationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} /> Previous
        </PaginationButton>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationButton
            key={page}
            active={currentPage === page}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PaginationButton>
        ))}

        <PaginationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight size={16} />
        </PaginationButton>
      </PaginationContainer>
    </PageContainer>
  );
}

export default AllCoins;
