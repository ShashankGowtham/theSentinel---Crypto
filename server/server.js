import express from "express";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pg from "pg";

// --- CONFIGURATION ---
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Krypto",
  password: "123",
  port: 5432,
});

db.connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err));

// --- JWT SECRET ---
const JWT_SECRET = "your-secret-key-change-this-in-production";
const JWT_EXPIRES_IN = "7d";

// --- HARDCODED API KEYS ---
const GEMINI_API_KEY = "";
const GNEWS_API_KEY = "";
const COVALENT_API_KEY = "";
const TAAPI_API_KEY =
  "";

// --- GEMINI INITIALIZATION ---
let geminiModel;
if (GEMINI_API_KEY) {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Changed to gemini-1.5-flash for broader availability
    console.log("✅ Gemini AI initialized successfully.");
  } catch (error) {
    console.error("⚠ Could not initialize Gemini AI.", error.message);
    geminiModel = null;
  }
} else {
  console.warn(
    "⚠ GEMINI_API_KEY not found. Gemini AI features will be unavailable."
  );
  geminiModel = null;
}

// --- MIDDLEWARE: Verify JWT Token ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// --- COIN CONFIGURATION ---
const COIN_MAPPING = {
  bitcoin: {
    coingecko_id: "bitcoin",
    gnews_query: "Bitcoin cryptocurrency",
    covalent_chain: "btc-mainnet",
    covalent_address: null,
    taapi_symbol: "BTC/USDT",
  },
  ethereum: {
    coingecko_id: "ethereum",
    gnews_query: "Ethereum OR ETH",
    covalent_chain: "eth-mainnet",
    covalent_address: null,
    taapi_symbol: "ETH/USDT",
  },
  solana: {
    coingecko_id: "solana",
    gnews_query: "Solana crypto",
    covalent_chain: "solana-mainnet",
    covalent_address: null,
    taapi_symbol: "SOL/USDT",
  },
  chainlink: {
    coingecko_id: "chainlink",
    gnews_query: "Chainlink crypto LINK",
    covalent_chain: "eth-mainnet",
    covalent_address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    taapi_symbol: "LINK/USDT",
  },
};

// --- IN-MEMORY CACHE & RETRY FUNCTION ---
const apiCache = {};
const finalResponseCache = {};
const RETRY_LIMIT = 3;
const RETRY_DELAY = 1000;
const CACHE_TTL = 5 * 60 * 1000;

async function fetchWithRetryAndCache(url, options = {}) {
  const now = Date.now();
  const cacheKey =
    options.method === "POST" ? `${url}-${JSON.stringify(options.data)}` : url;
  const cached = apiCache[cacheKey];

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  let attempts = 0;
  while (attempts < RETRY_LIMIT) {
    try {
      const response = await axios({ url, ...options });
      apiCache[cacheKey] = { data: response.data, timestamp: now };
      return response.data;
    } catch (error) {
      attempts++;
      console.warn(`Attempt ${attempts} failed for ${url}`);
      if (attempts >= RETRY_LIMIT) throw error;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

// --- AUTH ENDPOINTS ---

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Verify Token
app.get("/api/auth/verify", authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// --- FAVORITES ENDPOINTS ---

// Add to favorites
app.post("/api/favorites", authenticateToken, async (req, res) => {
  try {
    const { coin_id, coin_name, coin_symbol, coin_image, current_price } =
      req.body;
    const userId = req.user.id;

    const result = await db.query(
      `INSERT INTO favorites (user_id, coin_id, coin_name, coin_symbol, coin_image, current_price) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (user_id, coin_id) DO NOTHING
       RETURNING *`,
      [userId, coin_id, coin_name, coin_symbol, coin_image, current_price]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "Already in favorites" });
    }

    res.status(201).json({
      message: "Added to favorites",
      favorite: result.rows[0],
    });
  } catch (error) {
    console.error("Add favorite error:", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// Get user favorites
app.get("/api/favorites", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      "SELECT * FROM favorites WHERE user_id = $1 ORDER BY added_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ error: "Failed to get favorites" });
  }
});

// Remove from favorites
app.delete("/api/favorites/:coinId", authenticateToken, async (req, res) => {
  try {
    const { coinId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      "DELETE FROM favorites WHERE user_id = $1 AND coin_id = $2 RETURNING *",
      [userId, coinId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

// Check if coin is favorited
app.get("/api/favorites/check/:coinId", authenticateToken, async (req, res) => {
  try {
    const { coinId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      "SELECT * FROM favorites WHERE user_id = $1 AND coin_id = $2",
      [userId, coinId]
    );

    res.json({ isFavorite: result.rows.length > 0 });
  } catch (error) {
    console.error("Check favorite error:", error);
    res.status(500).json({ error: "Failed to check favorite" });
  }
});

// --- NEW CHATBOT ENDPOINT ---
app.post("/api/chatbot", authenticateToken, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  if (!geminiModel) {
    return res.status(503).json({
      error:
        "Chatbot service is currently unavailable. Gemini AI not initialized.",
    });
  }

  try {
    const chat = geminiModel.startChat({
      history: [
        // You can pre-seed the chat history here if needed for context
        // Example: { role: "user", parts: "Hello, I want to learn about crypto." },
        // { role: "model", parts: "Sure, what would you like to know?" },
      ],
      generationConfig: {
        maxOutputTokens: 500, // Limit the response length
      },
    });

    const prompt = `You are a helpful and knowledgeable cryptocurrency expert. Answer the following user query in a concise and informative way. If the query is not directly related to cryptocurrency, politely state that you can only answer crypto-related questions.

    User: "${message}"`;

    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error("❌ Chatbot Gemini API error:", error);
    res.status(500).json({
      error:
        "Failed to get a response from the chatbot. Please try again later.",
      details: error.message, // Include error details for debugging
    });
  }
});

// --- EXISTING API FUNCTIONS (NO CHANGES) ---
async function getCoinGeckoData(coinId) {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true`;
  try {
    const data = await fetchWithRetryAndCache(url);
    return {
      name: data.name,
      symbol: data.symbol,
      description: data.description.en.split(". ")[0] + ".",
      market_cap_rank: data.market_cap_rank,
      market_data: {
        current_price_usd: data.market_data.current_price.usd,
        market_cap_usd: data.market_data.market_cap.usd,
        total_volume_usd: data.market_data.total_volume.usd,
        price_change_percentage_24h:
          data.market_data.price_change_percentage_24h,
        price_change_percentage_7d: data.market_data.price_change_percentage_7d,
        price_change_percentage_30d:
          data.market_data.price_change_percentage_30d,
      },
      community_score: data.community_score,
      developer_score: data.developer_score,
    };
  } catch (error) {
    console.error(`❌ Unable to fetch CoinGecko data: ${error.message}`);
    return { error: error.message };
  }
}

async function getCoinsByCategory(categoryId) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=${categoryId}&order=market_cap_desc&per_page=100&page=1`;
  try {
    return await fetchWithRetryAndCache(url);
  } catch (error) {
    return { error: error.message };
  }
}

async function getAllCoinsList() {
  const url = `https://api.coingecko.com/api/v3/coins/list`;
  try {
    return await fetchWithRetryAndCache(url);
  } catch (error) {
    return { error: error.message };
  }
}

async function getGNewsData(query) {
  if (!GNEWS_API_KEY) return { error: "GNews API key not configured." };
  const url = `https://gnews.io/api/v4/search?q="${query}"&lang=en&max=5&token=${GNEWS_API_KEY}`;
  try {
    const data = await fetchWithRetryAndCache(url);
    return data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      source: article.source.name,
    }));
  } catch (error) {
    return { error: error.message };
  }
}

async function getCovalentData(chainName, tokenAddress) {
  if (!COVALENT_API_KEY) return { error: "Covalent API key not configured." };
  if (!tokenAddress) return { info: "Native coin, no token holders." };

  const url = `https://api.covalenthq.com/v1/${chainName}/tokens/${tokenAddress}/token_holders_v2/?key=${COVALENT_API_KEY}`;
  try {
    const data = await fetchWithRetryAndCache(url);
    return {
      total_holders: data.data.pagination.total_count,
      top_holders: data.data.items.slice(0, 3).map((holder) => ({
        address: holder.address,
        balance: (holder.balance / 10 ** holder.contract_decimals).toFixed(2),
      })),
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function getTaapiData(symbol) {
  if (!TAAPI_API_KEY) return { error: "Taapi.io API key not configured." };

  const url = `https://api.taapi.io/bulk?secret=${TAAPI_API_KEY}`;
  const payload = {
    construct: { exchange: "binance", symbol, interval: "1d" },
    indicators: [
      { indicator: "rsi" },
      { indicator: "macd" },
      { indicator: "pattern", pattern: "all" },
    ],
  };

  try {
    const response = await fetchWithRetryAndCache(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: payload,
    });
    const results = {};
    response.data.forEach((item) => {
      if (item.id === "rsi") results.rsi = item.result;
      if (item.id === "macd") results.macd = item.result;
      if (item.id === "pattern") {
        results.candlestick_pattern = {
          name: item.result.pattern,
          type: item.result.type,
        };
      }
    });
    return results;
  } catch (error) {
    return { error: error.message };
  }
}

async function getSocialMediaData(coinName) {
  return { error: "Social media data placeholder." };
}

// --- EXISTING ENDPOINTS (NO CHANGES) ---
app.get("/analyze/:coinName", async (req, res) => {
  const { coinName } = req.params;
  const { query } = req.query;
  const coinConfig = COIN_MAPPING[coinName.toLowerCase()];
  if (!coinConfig)
    return res.status(404).json({ error: "Coin not supported." });

  const [coingeckoData, gnewsData, covalentData, taapiData, socialMediaData] =
    await Promise.all([
      getCoinGeckoData(coinConfig.coingecko_id),
      getGNewsData(coinConfig.gnews_query),
      getCovalentData(coinConfig.covalent_chain, coinConfig.covalent_address),
      getTaapiData(coinConfig.taapi_symbol),
      getSocialMediaData(coinName),
    ]);

  const aggregatedData = {
    market_data: coingeckoData,
    news_sentiment: gnewsData,
    on_chain_activity: covalentData,
    technical_analysis: taapiData,
    social_media_sentiment: socialMediaData,
  };

  let geminiAnalysis = {
    summary: "Unavailable.",
    query_response: "Unavailable.",
  };
  if (geminiModel) {
    try {
      const prompt = `
        You are a senior crypto analyst. Summarize ${coinName}.
        Data: ${JSON.stringify(aggregatedData, null, 2)}
        Output JSON: {"summary": "...", "query_response": "..."}
      `;
      const result = await geminiModel.generateContent(prompt);
      const cleaned = result.response
        .text()
        .replace(/```json|```/g, "")
        .trim();
      geminiAnalysis = JSON.parse(cleaned);
    } catch (error) {
      geminiAnalysis = {
        summary: "Could not generate summary.",
        query_response: `Error: ${error.message}`,
      };
    }
  }

  res.json({
    coin: coinName.toUpperCase(),
    analysis: geminiAnalysis,
    raw_data: aggregatedData,
  });
});

app.get("/coins/all", async (_, res) => {
  const data = await getAllCoinsList();
  res.json(data);
});

app.get("/coins/stablecoins", async (_, res) => {
  const data = await getCoinsByCategory("stablecoins");
  res.json(data);
});

app.get("/coins/memecoins", async (_, res) => {
  const data = await getCoinsByCategory("meme-token");
  res.json(data);
});

app.get("/coins/:id", async (req, res) => {
  const { id } = req.params;
  const now = Date.now();

  const cachedResponse = finalResponseCache[id];
  if (cachedResponse && now - cachedResponse.timestamp < CACHE_TTL) {
    console.log(`✅ Serving cached response for ${id}`);
    return res.json(cachedResponse.data);
  }

  try {
    console.log(`🔥 Fetching new data for ${id}`);
    const coinData = await fetchWithRetryAndCache(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );
    const marketChartData = await fetchWithRetryAndCache(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`
    );

    const historicalPrices = marketChartData.prices.map(
      ([timestamp, price]) => ({
        timestamp,
        price,
      })
    );

    let aiAnalysis = {
      predicted_prices: [],
      recommendation: "AI analysis is currently unavailable.",
      news_summary: ["Data unavailable."],
      social_media_analysis: "Data unavailable.",
      on_chain_activity: ["Data unavailable."],
    };

    if (geminiModel) {
      try {
        const lastKnownTimestamp =
          historicalPrices[historicalPrices.length - 1].timestamp;

        const promptData = {
          coin_name: coinData.name,
          symbol: coinData.symbol,
          description:
            coinData.description.en.split(". ").slice(0, 2).join(". ") + ".",
          market_data: {
            current_price_usd: coinData.market_data.current_price.usd,
            market_cap_usd: coinData.market_data.market_cap.usd,
            price_change_percentage_24h:
              coinData.market_data.price_change_percentage_24h,
          },
          historical_prices_last_30_days: historicalPrices.slice(-30),
        };

        const prompt = `
        You are a predictive crypto analyst AI. Based on the provided data for ${
          promptData.coin_name
        }, generate a detailed analysis.
        The last known timestamp is ${lastKnownTimestamp}.

        Input Data:
        ${JSON.stringify(promptData, null, 2)}

        Your task is to generate a JSON object with the following structure:
        1.  "predicted_prices": An array of 15 objects for the next 15 days. Each object must have a "timestamp" (incrementing daily by 86400000ms from the last known timestamp) and a "price" (your prediction, showing realistic, gradual changes).
        2.  "recommendation": A concise "Today's Best Product Recommendation" string for this coin.
        3.  "news_summary": An array of 3 strings summarizing recent hypothetical news.
        4.  "social_media_analysis": A short string summarizing the current social media sentiment.
        5.  "on_chain_activity": An array of 3 strings summarizing key on-chain metrics.
        
        Return ONLY the raw JSON object, without any markdown formatting or explanations.
        `;

        const result = await geminiModel.generateContent(prompt);
        const cleaned = result.response
          .text()
          .replace(/```json|```/g, "")
          .trim();
        aiAnalysis = JSON.parse(cleaned);
      } catch (error) {
        console.error(`❌ Gemini analysis failed for ${id}:`, error.message);
      }
    }

    const finalResponse = {
      ...coinData,
      price_graph: historicalPrices,
      ai_analysis: aiAnalysis,
    };

    finalResponseCache[id] = { data: finalResponse, timestamp: now };
    res.json(finalResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("Available Endpoints:");
  console.log("  - POST /api/auth/register");
  console.log("  - POST /api/auth/login");
  console.log("  - GET /api/auth/verify");
  console.log("  - POST /api/favorites");
  console.log("  - GET /api/favorites");
  console.log("  - DELETE /api/favorites/:coinId");
  console.log("  - GET /api/favorites/check/:coinId");
  console.log("  - POST /api/chatbot (NEW)");
  console.log("  - GET /analyze/:coinName");
  console.log("  - GET /coins/all");
  console.log("  - GET /coins/stablecoins");
  console.log("  - GET /coins/memecoins");
  console.log("  - GET /coins/:id");
});
