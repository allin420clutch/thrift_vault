import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

let genAI = null
function getClient() {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY)
  }
  return genAI
}

// ─── Store system prompt ──────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are ThriftVault's AI shopping assistant — friendly, knowledgeable, and enthusiastic about vintage, repurposed, and new home & garden décor. 

Your capabilities:
1. SIMILARITY SEARCH: When asked to find similar items, analyze the description and suggest the most relevant matches from the store's inventory.
2. PRICE MATCHING: Compare prices with Amazon, Etsy, and other marketplaces to help customers understand value.
3. PRODUCT RECOMMENDATIONS: Suggest items based on style preferences and browsing history.
4. STORE EXPERTISE: Answer questions about conditions (New/Pre-loved/Repurposed), consignment, membership benefits, and shipping.

Store context:
- ThriftVault sells Home & Garden ornaments and interior decorations
- Products range from brand new to vintage/antique to lovingly repurposed
- Consignment fee is 20% for affiliate/seller listings
- Membership tiers: Free, Collector ($9.99/mo), Curator ($24.99/mo)
- Ships nationwide, free shipping on orders over $75

Always be helpful, warm, and concise. If you don't have specific inventory data, guide the user to browse by category or collection.`

// ─── Chat ─────────────────────────────────────────────────────────────────────
export async function sendChatMessage(messages, userMessage) {
  const client = getClient()
  if (!client) {
    return "⚠️ AI assistant is not configured yet. Please add your VITE_GEMINI_API_KEY to .env.local to enable this feature."
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      systemInstruction: SYSTEM_PROMPT,
    })

    const result = await chat.sendMessage(userMessage)
    return result.response.text()
  } catch (err) {
    console.error('Gemini chat error:', err)
    return "I'm having trouble connecting right now. Please try again in a moment! 🌿"
  }
}

// ─── Similarity Search ────────────────────────────────────────────────────────
export async function findSimilarItems(description, allProducts) {
  const client = getClient()
  if (!client || !allProducts?.length) return []

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const productList = allProducts
      .slice(0, 50)
      .map((p, i) => `${i + 1}. [ID:${p.id}] ${p.title} — ${p.category} — $${p.price} — ${p.condition}`)
      .join('\n')

    const prompt = `Given this product list:\n${productList}\n\nFind the top 4 most similar products to: "${description}"\n\nReturn ONLY a JSON array of product IDs like: [1,5,12,23]`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const match = text.match(/\[[\d,\s]+\]/)
    if (match) {
      const ids = JSON.parse(match[0])
      return allProducts.filter(p => ids.includes(p.id))
    }
    return []
  } catch (err) {
    console.error('Similarity search error:', err)
    return []
  }
}

// ─── Price Match Analysis ─────────────────────────────────────────────────────
export async function getPriceMatchInsight(product) {
  const client = getClient()
  if (!client) return null

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `Analyze the value of this thrift/vintage item:
Title: ${product.title}
Category: ${product.category}
Condition: ${product.condition}
Our Price: $${product.price}
Description: ${product.description || ''}

Provide a brief price comparison analysis (2-3 sentences) comparing to typical Amazon/Etsy market prices for similar items. Be specific about value. Format: {"analysis": "...", "verdict": "great deal"|"fair price"|"premium", "savings_est": "$X-Y"}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    return { analysis: text, verdict: 'fair price', savings_est: 'varies' }
  } catch (err) {
    console.error('Price match error:', err)
    return null
  }
}
