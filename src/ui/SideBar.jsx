import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";

const StyledSidebar = styled.aside`
  background-color: ${(props) =>
    props.$toggle ? "#18212f" : "var(--color-grey-50)"};
  padding: 3.2rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  grid-row: 1/-1;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 28rem;
    z-index: 999;
    transform: ${(props) =>
      props.$mobileNavOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.3s ease;
    box-shadow: ${(props) =>
      props.$mobileNavOpen ? "2px 0 10px rgba(0,0,0,0.1)" : "none"};
  }

  @media (max-width: 480px) {
    width: 26rem;
    padding: 2rem 1.5rem;
  }
`;

const CloseButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: ${(props) => (props.$toggle ? "white" : "var(--color-grey-600)")};
    padding: 0.5rem;
  }
`;

function SideBar() {
  return (
    <StyledSidebar>
      <Logo />
      <CloseButton>×</CloseButton>

      <MainNav />
    </StyledSidebar>
  );
}

export default SideBar;
