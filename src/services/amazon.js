// ─── Amazon Associates Product Advertising API v5 ────────────────────────────
// Docs: https://webservices.amazon.com/paapi5/documentation/
// You need: Amazon Associates account + PA API 5.0 access

const ASSOCIATES_TAG = import.meta.env.VITE_AMAZON_ASSOCIATES_TAG || 'yourstore-20'

export function buildAmazonSearchUrl(keywords) {
  const encoded = encodeURIComponent(keywords)
  return `https://www.amazon.com/s?k=${encoded}&tag=${ASSOCIATES_TAG}`
}

export function buildAmazonProductUrl(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${ASSOCIATES_TAG}`
}

// Price match stub — in production, call PA API v5 via a secure backend proxy
export async function searchAmazonPrices(keywords) {
  console.info('[Amazon] Price search for:', keywords, '— configure PA API v5 in backend')
  return {
    source: 'Amazon',
    url: buildAmazonSearchUrl(keywords),
    note: 'Connect Amazon PA API v5 via your backend proxy for live pricing',
  }
}
