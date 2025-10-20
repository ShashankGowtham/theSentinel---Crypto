🧠 Overview

A web platform that combines real-time cryptocurrency tracking, AI-powered explanations, and performance prediction — helping users understand the “why” behind market moves.

We fetch live data from the CoinGecko API every 5 minutes, store and update it efficiently to reduce server overhead, and use OpenAI APIs to generate plain-language insights and forecasts for the next 7 days of any selected coin.

💡 Key Features

Live Market Data: Real-time crypto prices, volume, and trends powered by CoinGecko API.

AI Explanations: OpenAI-powered chatbot that explains sudden price shifts in simple terms.

7-Day Prediction: Predicts short-term performance of selected coins using recent data patterns.

Smart Efficiency: Limited API calls (every 5 mins) to optimize performance and reduce load.

Interactive Visuals: Dynamic charts built with Chart.js or Recharts for easy analysis.

Custom Watchlist: Track selected coins and monitor market movements at a glance.

🛠️ Tech Stack

Frontend: React, HTML, CSS, Bootstrap, JavaScript
Backend: Node.js, Express
Database: PostgreSQL (for watchlists, preferences, and cached data)
APIs: CoinGecko API (data) & OpenAI API (AI explanations, chatbot)
Charts: Chart.js / Recharts

⚙️ Working

Data is fetched from CoinGecko every 5 minutes and stored in the database.

AI models analyze price trends and generate easy-to-understand explanations.

Users view live prices, charts, and short-term predictions in a single dashboard.

📈 Example Query

“Why did Bitcoin drop today?”
→ The AI responds with: “Bitcoin fell 5% due to profit booking and a decline in trading volume following ETF news.”

👨‍💻 Developed By

Team Bhadrakali
A group of innovators.
