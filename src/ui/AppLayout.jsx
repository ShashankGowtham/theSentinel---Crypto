import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./Sidebar";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  background-color: var(--color-grey-50);
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const MainContent = styled.main`
  @media (max-width: 768px) {
    grid-column: 1;
    transition: transform 0.3s ease;
  }
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <SideBar />
      <MainContent>
        <Outlet />
      </MainContent>
    </StyledAppLayout>
  );
}

export default AppLayout;
