import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FiSend } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

const ChatWrapper = styled.div`
  height: 90vh;
  display: flex;
  background: ${(props) => (props.isDark ? "#1a1d23" : "#f7f9fc")};
  width: 83vw;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;
  @media (max-width: 768px) {
    width: 100vw;
  }
`;

const MainChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${(props) => (props.isDark ? "#1a1d23" : "#f7f9fc")};
  min-width: 0;
  position: relative;
  width: 100%;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${(props) => (props.isDark ? "#4a5568" : "#e2e8f0")};
  background: ${(props) => (props.isDark ? "#2d3748" : "#ffffff")};

  .title {
    font-weight: 600;
    color: ${(props) => (props.isDark ? "#f7fafc" : "#1a202c")};
    font-size: 1.1rem;
  }
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1.5rem;
  }
`;

const WelcomeScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const WelcomeIcon = styled.div`
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  color: white;
  font-size: 2.5rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);

  @media (max-width: 768px) {
    width: 4rem;
    height: 4rem;
    font-size: 2rem;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: ${(props) => (props.isDark ? "#f7fafc" : "#1a202c")};
  margin-bottom: 1rem;
  text-align: center;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${(props) => (props.isDark ? "#a0aec0" : "#718096")};
  text-align: center;
  margin-bottom: 3rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

const SuggestionCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 600px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SuggestionCard = styled.div`
  padding: 2rem;
  background: ${(props) => (props.isDark ? "#2d3748" : "#ffffff")};
  border: 1px solid ${(props) => (props.isDark ? "#4a5568" : "#e2e8f0")};
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    border-color: #764ba2;
    box-shadow: 0 10px 40px
      rgba(0, 0, 0, ${(props) => (props.isDark ? "0.3" : "0.1")});
    transform: translateY(-5px);
  }

  .icon {
    font-size: 2rem;
    margin-bottom: 1rem;
    display: block;
  }

  .title {
    font-weight: 600;
    color: ${(props) => (props.isDark ? "#f7fafc" : "#1a202c")};
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .subtitle {
    font-size: 0.9rem;
    color: ${(props) => (props.isDark ? "#a0aec0" : "#718096")};
    line-height: 1.5;
  }
`;

const MessageBubble = styled.div`
  max-width: 85%;
  align-self: ${(props) => (props.from === "user" ? "flex-end" : "flex-start")};

  .bubble {
    padding: 1.25rem 1.5rem;
    border-radius: 20px;
    font-size: 1.1rem;
    line-height: 1.6;
    background: ${(props) =>
      props.from === "user"
        ? "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"
        : props.isDark
        ? "#2d3748"
        : "#ffffff"};
    color: ${(props) =>
      props.from === "user" ? "white" : props.isDark ? "#f7fafc" : "#1a202c"};
    box-shadow: 0 4px 20px
      rgba(0, 0, 0, ${(props) => (props.isDark ? "0.2" : "0.1")});
    white-space: pre-wrap;
    word-wrap: break-word;
    border: ${(props) =>
      props.from === "bot"
        ? props.isDark
          ? "1px solid #4a5568"
          : "1px solid #e2e8f0"
        : "none"};
  }

  pre {
    background: ${(props) =>
      props.from === "user"
        ? "rgba(255,255,255,0.15)"
        : props.isDark
        ? "#1a1d23"
        : "#f7fafc"};
    padding: 1rem;
    border-radius: 10px;
    overflow-x: auto;
    font-size: 0.9rem;
    margin: 0.75rem 0;
    border: 1px solid ${(props) => (props.isDark ? "#4a5568" : "#e2e8f0")};
  }

  code {
    background: ${(props) =>
      props.from === "user"
        ? "rgba(255,255,255,0.15)"
        : props.isDark
        ? "#1a1d23"
        : "#f7fafc"};
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 0.9rem;
    border: 1px solid ${(props) => (props.isDark ? "#4a5568" : "#e2e8f0")};
  }

  @media (max-width: 768px) {
    max-width: 95%;

    .bubble {
      padding: 1rem 1.25rem;
      font-size: 0.95rem;
    }
  }
`;

const InputArea = styled.div`
  border-top: 1px solid ${(props) => (props.isDark ? "#4a5568" : "#e2e8f0")};
  background: ${(props) => (props.isDark ? "#2d3748" : "#ffffff")};
  padding: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const InputContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  background: ${(props) => (props.isDark ? "#1a1d23" : "#f7fafc")};
  border: 2px solid ${(props) => (props.isDark ? "#4a5568" : "#e2e8f0")};
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 4px 20px
    rgba(0, 0, 0, ${(props) => (props.isDark ? "0.2" : "0.05")});
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 30px
      rgba(0, 0, 0, ${(props) => (props.isDark ? "0.3" : "0.1")});
  }

  &:focus-within {
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 768px) {
    gap: 0.75rem;
    padding: 0.875rem;
  }
`;

const ChatInput = styled.textarea`
  flex: 1;
  font-size: 1rem;
  border: none;
  outline: none;
  resize: none;
  overflow-y: auto;
  line-height: 1.6;
  padding: 0.5rem;
  min-height: 3rem;
  max-height: 10rem;
  background: transparent;
  color: ${(props) => (props.isDark ? "#f7fafc" : "#1a202c")};
  font-family: inherit;

  &::placeholder {
    color: ${(props) => (props.isDark ? "#a0aec0" : "#718096")};
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => (props.isDark ? "#718096" : "#cbd5e0")};
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    font-size: 16px; /* Prevents zoom on iOS */
    min-height: 2.5rem;
  }
`;

const SendButton = styled.button`
  background: ${(props) =>
    props.disabled
      ? props.isDark
        ? "#4a5568"
        : "#e2e8f0"
      : "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"};
  color: ${(props) =>
    props.disabled ? (props.isDark ? "#a0aec0" : "#a0aec0") : "white"};
  padding: 0.875rem;
  border-radius: 12px;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 1rem;
  }
`;

const InputHints = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: ${(props) => (props.isDark ? "#a0aec0" : "#718096")};

  .options {
    display: flex;
    gap: 1.5rem;

    @media (max-width: 768px) {
      gap: 1rem;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
`;

// Helper function to escape markdown special characters for ReactMarkdown.
// This is often needed when the AI returns plain text that might contain characters
// that ReactMarkdown would misinterpret (e.g., '*' for bold).
// For responses from Gemini, it's often better to let ReactMarkdown handle it directly,
// as Gemini typically outputs valid markdown. This function might be unnecessary or
// even detrimental if Gemini is already sending well-formed markdown.
// I've commented out the heavy escaping, assuming Gemini provides good markdown.
// If you encounter rendering issues, you might need to re-evaluate this.
function formatBotResponse(text) {
  // If Gemini is already sending markdown, no heavy escaping is needed.
  // Just ensure newlines are correctly represented.
  return text.replace(/\\n/g, "\n");
}

export default function ChatAI() {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hey there! I'm your Krypto AI assistant. Ask me anything about cryptocurrencies, market trends, or blockchain technology!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll to bottom whenever messages change

  const handleInputChange = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setInput(textarea.value);
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = { from: "user", text: messageText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    // Reset textarea height
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
    }

    try {
      // Retrieve JWT token from localStorage or your authentication context
      const token = localStorage.getItem("token"); // Assuming you store the token in localStorage

      if (!token) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            from: "bot",
            text: "You need to be logged in to use the chatbot. Please log in first.",
          },
        ]);
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("HTTP Error:", response.status, errorData);
        let errorMessage = "Server issue. Please try again later.";
        if (response.status === 401 || response.status === 403) {
          errorMessage =
            errorData.error || "Authentication failed. Please log in.";
        } else if (
          response.status === 503 &&
          errorData.error.includes("Gemini AI not initialized")
        ) {
          errorMessage =
            "Chatbot service is temporarily unavailable. Our AI is currently offline.";
        }
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: "bot", text: errorMessage },
        ]);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      // The backend now returns { response: "..." }
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "bot", text: formatBotResponse(data.response) },
      ]);
    } catch (error) {
      console.error("Network or Fetch Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          from: "bot",
          text: "Network error. Please check your internet connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      sendMessage(input);
    } else if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault(); // Prevent default Enter behavior (new line)
      sendMessage(input); // Send message on plain Enter
    }
  };

  const suggestionCards = [
    {
      icon: "₿",
      title: "What is Bitcoin?",
      subtitle: "Explain Bitcoin simply and its core principles.",
    },
    {
      icon: "🔗",
      title: "How does Blockchain work?",
      subtitle: "Demystify the underlying technology of cryptocurrencies.",
    },
    {
      icon: "💹",
      title: "Current Market Trends",
      subtitle: "Summarize the latest trends in the crypto market.",
    },
    {
      icon: "💡",
      title: "DeFi Explained",
      subtitle: "Give an overview of Decentralized Finance.",
    },
  ];

  const showWelcome =
    messages.length === 1 &&
    messages[0].from === "bot" &&
    messages[0].text.includes("Krypto AI assistant");

  return (
    <ChatWrapper>
      <MainChatArea>
        <ChatHeader>
          <div className="title">Krypto AI Assistant</div>
        </ChatHeader>

        {showWelcome ? (
          <WelcomeScreen>
            <WelcomeIcon>✨</WelcomeIcon>
            <WelcomeTitle>How can I help you today?</WelcomeTitle>
            <WelcomeSubtitle>
              Ask me anything about cryptocurrencies, market trends, or
              blockchain technology.
            </WelcomeSubtitle>

            <SuggestionCards>
              {suggestionCards.map((card, index) => (
                <SuggestionCard
                  key={index}
                  onClick={() => sendMessage(card.title)} // Send the suggestion as a message
                >
                  <div className="icon">{card.icon}</div>
                  <div className="title">{card.title}</div>
                  <div className="subtitle">{card.subtitle}</div>
                </SuggestionCard>
              ))}
            </SuggestionCards>
          </WelcomeScreen>
        ) : (
          <Messages>
            {messages.map((msg, index) => (
              <MessageBubble key={index} from={msg.from}>
                <div className="bubble">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </MessageBubble>
            ))}
            {isLoading && (
              <MessageBubble from="bot">
                <div className="bubble">
                  <div className="loading-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </div>
                </div>
              </MessageBubble>
            )}
            <div ref={messagesEndRef} /> {/* Scroll target */}
          </Messages>
        )}

        <InputArea>
          <InputContainer>
            <InputWrapper>
              <ChatInput
                placeholder={
                  isLoading ? "AI is typing..." : "Type your message here..."
                }
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <SendButton
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
              >
                <FiSend />
              </SendButton>
            </InputWrapper>
            <InputHints>
              <span>Press Enter to send, Shift+Enter for new line</span>
              {/* Removed other options as they are not implemented */}
            </InputHints>
          </InputContainer>
        </InputArea>
      </MainChatArea>
    </ChatWrapper>
  );
}
