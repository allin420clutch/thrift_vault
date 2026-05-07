# ThriftVault — Thrift Store E-Commerce Platform

A full-featured dark-mode thrift/vintage store web app built with **React + Vite + Tailwind CSS**, backed by **Supabase** and powered by **Google Gemini AI**.

## ✨ Features

| Feature | Status |
|---|---|
| 🏠 Landing Page | ✅ Hero, stats, collections, featured, blog strip, newsletter |
| 📦 Products Inventory | ✅ Filter sidebar, search, sort, masonry grid |
| 🗂️ Collections | ✅ Tabbed collection explorer with hero banner |
| 🛍 Product Detail | ✅ Gallery, AI price match, similar items, Pinterest share |
| 📝 Blog | ✅ Featured post, category tabs, blog index |
| 📄 Blog Post | ✅ Full article renderer, share, tags |
| 💳 Memberships | ✅ 3 tiers + billing toggle + feature table + FAQ |
| 🤝 Affiliates | ✅ How it works, earnings calculator, application form |
| 🤖 AI Chatbot | ✅ Gemini 1.5 Flash, quick prompts, floating widget |
| 🛒 Amazon/Etsy/Pinterest/Shopify | ✅ Service stubs + UI badges |

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your real API keys

# 3. Start dev server
npm run dev
```

## ⚙️ Environment Variables

Copy `.env.example` → `.env.local` and fill in:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_GEMINI_API_KEY` | Google Gemini API key (for AI chatbot) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe public key (memberships) |
| `VITE_AMAZON_ASSOCIATES_TAG` | Amazon Associates tag |
| `VITE_ETSY_API_KEY` | Etsy Open API v3 key |
| `VITE_PINTEREST_APP_ID` | Pinterest API app ID |
| `VITE_SHOPIFY_DOMAIN` | Your `*.myshopify.com` domain |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | Shopify Storefront API token |

## 🗄 Database Setup

1. Create a [Supabase](https://supabase.com) project
2. Go to **SQL Editor**
3. Run the contents of `supabase_schema.sql`
4. Create a storage bucket called `product-images` (public)

## 🤖 AI Chatbot

The VaultBot chatbot uses **Google Gemini 1.5 Flash** and supports:
- **Similarity search** — finds items in inventory matching a description
- **Price matching** — compares against Amazon and Etsy market prices
- **FAQ** — answers questions about the store, shipping, consignment

Requires `VITE_GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/).

## 🏪 Marketplace Integrations

| Platform | Integration | Setup |
|---|---|---|
| Amazon | Associates affiliate links + PA API v5 stub | Register at Amazon Associates |
| Etsy | Open API v3 price search | Create Etsy developer account |
| Pinterest | Pin-It buttons + API v5 auto-pin | Create Pinterest developer app |
| Shopify | Storefront API GraphQL | Create private app in Shopify |

## 💳 Memberships & Payments

Stripe integration is scaffolded in `src/services/stripe.js`. To activate:
1. Create a [Stripe](https://stripe.com) account
2. Add price IDs to the plans in `src/data/mockData.js`
3. Set `VITE_STRIPE_PUBLISHABLE_KEY` in `.env.local`

## 📁 Project Structure

```
src/
├── pages/          # Route pages
├── components/     # Reusable UI components
│   ├── layout/     # Navbar, Footer
│   ├── products/   # ProductCard, grids
│   └── ai/         # ChatBot widget
├── services/       # API integrations
├── store/          # Zustand global state
└── data/           # Mock data (replace with Supabase)
```

## 🎨 Design System

- **Background:** `#0a0a0a` (near-black)
- **Accent:** `#00ff41` (ThriftVault green)
- **Font:** JetBrains Mono (code/prices) + Inter (body)
- **Style:** Glassmorphism, glow effects, micro-animations
