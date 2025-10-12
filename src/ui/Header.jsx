import styled from "styled-components";
import { MdOutlineDarkMode } from "react-icons/md";
import { HiOutlineBars3 } from "react-icons/hi2";
import { useState, useEffect } from "react";

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.2%;
  background-color: ${(props) =>
    props.$darkMode ? "#18212f" : "var(--color-grey-50)"};
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  color: ${(props) => (props.$darkMode ? "white" : "#374151")};

  @media (max-width: 768px) {
    padding: 1.2rem 2rem;
    justify-content: space-between;
  }
`;

const LeftSection = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const MobileNavToggle = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    width: 2.4rem;
    height: 2.4rem;
    color: ${(props) => (props.$darkMode ? "white" : "var(--color-grey-600)")};
  }
`;

const StyledImg = styled.img`
  height: 4rem;
  width: 4rem;

  @media (max-width: 768px) {
    height: 3.5rem;
    width: 3.5rem;
  }

  @media (max-width: 480px) {
    height: 3rem;
    width: 3rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.3rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const UserText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  p {
    margin: 0;
    font-size: 1.4rem;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }

  h4 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 600;

    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.4rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.$darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"};
  }

  @media (max-width: 768px) {
    padding: 0.4rem;
  }
`;

const DarkModeIcon = styled(MdOutlineDarkMode)`
  font-size: 24px;
  color: ${(props) => (props.$darkMode ? "white" : "#374151")};

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  return (
    <StyledHeader $darkMode={darkMode}>
      <LeftSection>
        <MobileNavToggle $darkMode={darkMode} aria-label="Toggle navigation">
          <HiOutlineBars3 />
        </MobileNavToggle>
      </LeftSection>

      <RightSection>
        <StyledImg src="/default-user.jpg" alt="User profile" />
        <UserInfo>
          <UserText>
            <p>Hello,</p>
            <h4>{user?.username || "Guest"}</h4>
          </UserText>
        </UserInfo>
        <IconButton $darkMode={darkMode} onClick={toggleDarkMode}>
          <DarkModeIcon $darkMode={darkMode} />
        </IconButton>
      </RightSection>
    </StyledHeader>
  );
}

export default Header;
