import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
const Container = styled.div`
  color: #333;
  max-width: 100%;
  overflow-x: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 100px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.div`
  font-weight: 700;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4f46e5;
`;

const Nav = styled.nav`
  display: flex;
  gap: 48px;
  align-items: center;
`;

const NavLink = styled.a`
  color: #666;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
  &:hover {
    color: #4f46e5;
  }
`;

const Button = styled.button`
  background: ${(props) =>
    props.primary
      ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
      : "transparent"};
  color: ${(props) => (props.primary ? "white" : "#4f46e5")};
  border: ${(props) => (props.primary ? "none" : "2px solid #4f46e5")};
  padding: 14px 36px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
    background: ${(props) =>
      props.primary
        ? "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)"
        : "rgba(99, 102, 241, 0.05)"};
  }
`;

const HeroSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60px 100px;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%);
  gap: 80px;
  min-height: 600px;
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 600px;
`;

const HeroTitle = styled.h1`
  font-size: 53px;
  font-weight: 750;
  line-height: 1.15;
  margin-bottom: 24px;
  color: #374151;
  letter-spacing: -0.02em;
`;

const HeroSubtitle = styled.p`
  font-size: 16px;
  color: #9ca3af;
  margin-bottom: 32px;
  line-height: 1.7;
  font-weight: 400;
  max-width: 480px;
`;

const HeroImage = styled.div`
  flex: 1;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const StatsBar = styled.div`
  display: flex;
  gap: 60px;
  margin-top: 48px;
`;

const StatItem = styled.div`
  text-align: left;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 720;
  color: #1a1a2e;
  margin-bottom: 8px;
  min-height: 45px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`;

const Section = styled.section`
  padding: 50px 100px;
  background: ${(props) => props.bg || "white"};
`;

const SectionTitle = styled.h2`
  font-size: 42px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
  color: #1a1a2e;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: #64748b;
  text-align: center;
  margin-bottom: 80px;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
  margin-top: 50px;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 48px 32px;
  border-radius: 16px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15);
  }
`;

const FeatureIcon = styled.div`
  width: 140px;
  height: 200px;
  margin: 0 auto 36px;

  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  font-size: 13px;
  font-weight: 500;
`;

const FeatureTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1a1a2e;
`;

const FeatureDescription = styled.p`
  font-size: 15px;
  color: #64748b;
  line-height: 1.7;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
`;

const TestimonialCard = styled.div`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  padding: 40px;
  border-radius: 20px;
  color: white;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 48px rgba(99, 102, 241, 0.4);
  }
`;

const TestimonialText = styled.p`
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 32px;
  opacity: 0.95;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AuthorAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
`;

const AuthorRole = styled.div`
  font-size: 13px;
  opacity: 0.85;
`;

const CTASection = styled.section`
  height: 300px;
  margin: 140px 100px;
  position: relative;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  padding: 80px 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  gap: 60px;
  border-radius: 30px;
  overflow: visible;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
    padding: 50px 24px;
  }
`;

const CTAContent = styled.div`
  flex: 1;
  max-width: 550px;
  z-index: 2;
`;

const SmallText = styled.p`
  font-size: 10px;
  font-weight: 400;
  opacity: 0.9;
  margin-bottom: 16px;
`;

const CTATitle = styled.h2`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 36px;
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (max-width: 900px) {
    font-size: 32px;
  }
`;

const CTAButton = styled.button`
  background: white;
  color: #ef4444;
  border: none;
  padding: 14px 28px;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
`;

const CTAImage = styled.div`
  flex: 1;
  position: relative;
  height: 380px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const StyledImg1 = styled.img`
  position: absolute;
  top: -60px; /* 👈 pops upward instead of downward */
  right: 20px;
  width: 90%;
  max-width: 380px;
  transform: scale(1.05);
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.25));
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.08);
  }

  @media (max-width: 900px) {
    position: static;
    width: 80%;
    transform: scale(1);
    top: 0;
  }
`;

const Footer = styled.footer`
  background: #0f172a;
  color: white;
  padding: 80px 100px 50px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
  gap: 80px;
  margin-bottom: 60px;
`;

const FooterColumn = styled.div``;

const FooterTitle = styled.h4`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 24px;
  color: white;
`;

const FooterLink = styled.a`
  display: block;
  color: #94a3b8;
  text-decoration: none;
  font-size: 15px;
  margin-bottom: 14px;
  cursor: pointer;
  transition: color 0.2s ease;
  &:hover {
    color: #6366f1;
  }
`;

const FooterBottom = styled.div`
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Copyright = styled.div`
  font-size: 14px;
  color: #64748b;
`;
export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Header section
export const HeaderSection = styled.div`
  margin-bottom: 60px;
`;

export const Subtitle = styled.p`
  color: #6366f1;
  font-size: 19px;
  font-weight: 720;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 12px;
`;

export const MainHeading = styled.h2`
  font-size: clamp(25px, 5vw, 40px);
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  line-height: 1.2;
`;

export const Description = styled.p`
  margin-left: 40px;
  color: #6b7280;
  font-size: 16px;
  max-width: 700px;
  line-height: 1.6;
  margin-top: 20px;
`;

// Grid layout
export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

// Photo card component
export const PhotoCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  padding-top: 20px;

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    transform: translateY(-8px);
  }
`;

export const ImageContainer = styled.div`
  aspect-ratio: 1;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  margin: 10px 40px 0 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(239, 68, 68, 0.05) 0%,
      transparent 100%
    );
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    margin: 10px 20px 0 20px;
    padding: 40px 20px;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  ${PhotoCard}:hover & {
    transform: scale(1.1);
  }
`;
const FakeSection = styled.section`
  background: #f3f4f6;
  padding: 50px;
`;

export const CardImage = styled.img`
  max-width: 70%;
  max-height: 90%;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
`;
export const CardContent = styled.div`
  padding: 32px 24px;
`;

export const CardHeading = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  line-height: 1.3;
`;

export const CardText = styled.p`
  color: #6b7280;
  font-size: 15px;
  line-height: 1.7;
`;

// Placeholder for missing images
export const ImagePlaceholder = styled.div`
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #fecaca 0%, #ef4444 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: white;
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
`;
const Styleddivuuu = styled.div`
  display: flex;
`;
const StyledDivu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function CryptoLandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    portfolio: 0,
    users: 0,
    transactions: 0,
  });

  const targetValues = {
    portfolio: 23456,
    users: 17869,
    transactions: 14000,
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setStats({
        portfolio: Math.floor(targetValues.portfolio * easeOutQuart),
        users: Math.floor(targetValues.users * easeOutQuart),
        transactions: Math.floor(targetValues.transactions * easeOutQuart),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targetValues);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <Container>
      <Header>
        <Logo>
          <span>🔷</span>
          The sentinal
        </Logo>
        <Nav>
          <NavLink href="#">About</NavLink>
          <NavLink href="#">Pricing</NavLink>
          <NavLink href="#">Contact</NavLink>
          <NavLink href="#">Buy NFTs</NavLink>
          <Button onClick={() => navigate(`/login`)}>Login</Button>
        </Nav>
      </Header>

      <HeroSection>
        <HeroContent>
          <HeroTitle>Unlock the Power of Cryptocurrency Today</HeroTitle>
          <HeroSubtitle>
            Discover the future of finance with our secure and easy-to-use
            cryptocurrency platform. Start your investment journey today.
          </HeroSubtitle>
          <Button primary>Get Started</Button>
          <StatsBar>
            <StatItem>
              <StatValue>${formatNumber(stats.portfolio)}</StatValue>
              <StatLabel>Portfolio Value</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{formatNumber(stats.users)}</StatValue>
              <StatLabel>Active Users</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{formatNumber(stats.transactions)}</StatValue>
              <StatLabel>Daily Transactions</StatLabel>
            </StatItem>
          </StatsBar>
        </HeroContent>
        <HeroImage>
          <StyledImg
            src="/images/crypto-banner.png"
            alt="Crypto landing banner"
          />
        </HeroImage>
      </HeroSection>

      <Section>
        <StyledDivu>
          <Subtitle>Why choose us?</Subtitle>
        </StyledDivu>

        <SectionTitle>Empower Your Crypto Journey </SectionTitle>
        <SectionTitle>with Smart Insights</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <StyledImg
                src="/images/ui-removebg-preview.png"
                alt="Crypto landing banner"
              />
            </FeatureIcon>
            <FeatureTitle>Sleek & Intuitive UI</FeatureTitle>
            <FeatureDescription>
              Experience a modern, minimal, and data-driven interface designed
              to make crypto insights visually clear and easy to understand
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <StyledImg
                src="/images/fake-removebg-preview.png"
                alt="Crypto landing banner"
              />
            </FeatureIcon>
            <FeatureTitle>Safe & Reliable Predictions</FeatureTitle>
            <FeatureDescription>
              Our AI-powered models analyze historical data, market sentiment,
              and blockchain activity to deliver secure, transparent, and
              trustworthy future price predictions
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <StyledImg
                src="/images/idea-removebg-preview.png"
                alt="Crypto landing banner"
              />
            </FeatureIcon>
            <FeatureTitle>Learn While You Trade</FeatureTitle>
            <FeatureDescription>
              Built for educational purposes, our platform helps you understand
              how crypto markets behave, teaching prediction techniques and
              market analysis through real-time visual insights.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </Section>

      <FakeSection>
        <ContentWrapper>
          <HeaderSection>
            <Subtitle>Our Key Features</Subtitle>
            <Styleddivuuu>
              <div>
                <MainHeading>The Tools You Need to</MainHeading>
                <MainHeading>Succeed in Crypto</MainHeading>
              </div>
              <Description>
                Our platform is packed with features designed to help you
                maximize your returns and make the most of your investments.
                Here are just a few of the tools you'll have at your fingertips:
              </Description>
            </Styleddivuuu>
          </HeaderSection>

          <CardsGrid>
            <PhotoCard>
              <ImageContainer>
                <ImageWrapper>
                  <CardImage
                    src="/images/graph-removebg-preview.png"
                    alt="Market analytics"
                  />
                </ImageWrapper>
              </ImageContainer>
              <CardContent>
                <CardHeading>Real-Time Market Data</CardHeading>
                <CardText>
                  Stay up to date on the latest market trends and price
                  movements with our real-time data feeds
                </CardText>
              </CardContent>
            </PhotoCard>

            <PhotoCard>
              <ImageContainer>
                <ImageWrapper>
                  <CardImage
                    src="/images/trade-removebg-preview.png"
                    alt="Trading tools"
                  />
                </ImageWrapper>
              </ImageContainer>
              <CardContent>
                <CardHeading>Advanced Trading Tools</CardHeading>
                <CardText>
                  Take advantage of advanced trading features like stop-loss
                  orders and margin trading to maximize your profits.
                </CardText>
              </CardContent>
            </PhotoCard>

            <PhotoCard>
              <ImageContainer>
                <ImageWrapper>
                  <ImagePlaceholder>📱</ImagePlaceholder>
                </ImageWrapper>
              </ImageContainer>
              <CardContent>
                <CardHeading>Mobile App</CardHeading>
                <CardText>
                  Manage your portfolio on the go with our convenient mobile
                  app.
                </CardText>
              </CardContent>
            </PhotoCard>
          </CardsGrid>
        </ContentWrapper>
      </FakeSection>

      <CTASection>
        <CTAContent>
          <CTATitle>Sign Up Now and Start Trading in Crypto</CTATitle>
          <Button
            style={{ background: "white", color: "#4f46e5" }}
            onClick={() => navigate(`/login`)}
          >
            Get Started
          </Button>
        </CTAContent>
        <CTAImage>
          <StyledImg1
            src="/images/crypto-banner.png"
            alt="Crypto landing banner"
          />
        </CTAImage>
      </CTASection>

      <Footer>
        <FooterGrid>
          <FooterColumn>
            <Logo style={{ color: "white", marginBottom: "20px" }}>
              <span>🔷</span>
              The Sentinal
            </Logo>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Company</FooterTitle>
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Careers</FooterLink>
            <FooterLink href="#">Press</FooterLink>
            <FooterLink href="#">News</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Services</FooterTitle>
            <FooterLink href="#">Trading</FooterLink>
            <FooterLink href="#">Wallet</FooterLink>
            <FooterLink href="#">Analytics</FooterLink>
            <FooterLink href="#">API</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Support</FooterTitle>
            <FooterLink href="#">Help Center</FooterLink>
            <FooterLink href="#">Contact Us</FooterLink>
            <FooterLink href="#">Status</FooterLink>
            <FooterLink href="#">FAQ</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Developers</FooterTitle>
            <FooterLink href="#">Documentation</FooterLink>
            <FooterLink href="#">API Reference</FooterLink>
            <FooterLink href="#">GitHub</FooterLink>
            <FooterLink href="#">Changelog</FooterLink>
          </FooterColumn>
        </FooterGrid>
        <FooterBottom>
          <Copyright>© 2024 Krypto. All rights reserved.</Copyright>
        </FooterBottom>
      </Footer>
    </Container>
  );
}
