import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineHome, HiChevronDown } from "react-icons/hi2";
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { useState, useEffect } from "react";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  color: ${(props) => (props.$toggle ? "white" : "#374151")};

  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    color: ${(props) => (props.$toggle ? "white" : "var(--color-grey-600)")};
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
    text-decoration: none;
  }

  &:hover,
  &:active {
    color: ${(props) => (props.$toggle ? "#f3f4f6" : "var(--color-grey-800)")};
    background-color: ${(props) =>
      props.$toggle ? "#111827" : "var(--color-grey-50)"};
    border-radius: var(--border-radius-sm);
  }

  &.active {
    color: ${(props) => (props.$toggle ? "#f3f4f6" : "var(--color-grey-800)")};
    background-color: ${(props) =>
      props.$toggle ? "#111827" : "var(--color-grey-50)"};
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg {
    color: var(--color-brand-600);
  }

  &.active svg {
    color: var(--color-brand-600);
  }

  ${(props) =>
    props.$type === "small" &&
    `
      &:link,
      &:visited {
        padding: 0.6rem 1.2rem;
        font-size: 1.4rem;
        font-weight: 400;
        width: 80%;
        margin-left: 3.1rem;
      }
      
      &.active {
        background-color: var(--color-brand-100);
        color: var(--color-brand-700);
      }
      
      @media (max-width: 768px) {
        &:link,
        &:visited {
          font-size: 1.4rem;
          padding: 1rem 1.5rem;
          width: 80%;
          margin-left: 2rem;
        }
      }
    `}

  @media (max-width: 768px) {
    &:link,
    &:visited {
      padding: 1.5rem 2rem;
      font-size: 1.6rem;
    }

    & svg {
      width: 2.2rem;
      height: 2.2rem;
    }
  }
`;

const TrendingButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  color: ${(props) => (props.$toggle ? "white" : "var(--color-grey-600)")};
  font-size: 1.6rem;
  font-weight: 500;
  padding: 1.2rem 2.4rem;
  transition: all 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;

  ${(props) =>
    props.$isActive &&
    `
    color: ${props.$toggle ? "#f3f4f6" : "var(--color-grey-800)"};
    background-color: ${props.$toggle ? "#111827" : "var(--color-grey-50)"};
    border-radius: var(--border-radius-sm);
    
    & svg {
      color: var(--color-brand-600);
    }
  `}

  &:hover {
    color: ${(props) => (props.$toggle ? "#f3f4f6" : "var(--color-grey-800)")};
    background-color: ${(props) =>
      props.$toggle ? "#111827" : "var(--color-grey-50)"};
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg {
    color: var(--color-brand-600);
  }

  @media (max-width: 768px) {
    padding: 1.5rem 2rem;
    font-size: 1.6rem;

    & svg {
      width: 2.2rem;
      height: 2.2rem;
    }
  }
`;

const TrendingContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
`;

const ChevronIcon = styled(HiChevronDown)`
  transition: transform 0.3s;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
`;

const SubNav = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.4rem;
  overflow: hidden;
  max-height: ${(props) => (props.$isOpen ? "300px" : "0")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  transition: all 0.3s ease-in-out;
`;

function MainNav() {
  const location = useLocation();
  const [isTrendingOpen, setIsTrendingOpen] = useState(false);

  // Check if current path is a trending route
  const isTrendingActive = location.pathname.startsWith("/trending");

  // Auto-open dropdown if on a trending page
  useEffect(() => {
    if (isTrendingActive) {
      setIsTrendingOpen(true);
    }
  }, [isTrendingActive]);

  const handleNavClick = () => {
    // Close mobile nav when a link is clicked
  };

  const toggleTrending = () => {
    setIsTrendingOpen(!isTrendingOpen);
  };

  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard" onClick={handleNavClick}>
            <HiOutlineHome />
            <span>Home</span>
          </StyledNavLink>
        </li>
        <li>
          <TrendingButton onClick={toggleTrending} $isActive={isTrendingActive}>
            <TrendingContent>
              <MdOutlineLocalFireDepartment />
              <span>Trending</span>
            </TrendingContent>
            <ChevronIcon $isOpen={isTrendingOpen} />
          </TrendingButton>
          <SubNav $isOpen={isTrendingOpen}>
            <li>
              <StyledNavLink
                to="/trending"
                $type="small"
                onClick={handleNavClick}
                end
              >
                <span>All Trending</span>
              </StyledNavLink>
            </li>
            <li>
              <StyledNavLink
                to="/trending/stable-coins"
                $type="small"
                onClick={handleNavClick}
              >
                <span>Stable Coins</span>
              </StyledNavLink>
            </li>
            <li>
              <StyledNavLink
                to="/trending/meme-coins"
                $type="small"
                onClick={handleNavClick}
              >
                <span>Meme Coins</span>
              </StyledNavLink>
            </li>
          </SubNav>
        </li>
        <li>
          <StyledNavLink to="/chat" onClick={handleNavClick}>
            <HiOutlineHome />
            <span>Chat with AI</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;
