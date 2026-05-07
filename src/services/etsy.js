// ─── Etsy Open API v3 ─────────────────────────────────────────────────────────
// Docs: https://developers.etsy.com/documentation/
// Requires: Etsy developer account + API key

const ETSY_API_KEY = import.meta.env.VITE_ETSY_API_KEY || ''
const BASE_URL = 'https://openapi.etsy.com/v3'

export function buildEtsyShopUrl(shopName) {
  return `https://www.etsy.com/shop/${shopName}`
}

export function buildEtsySearchUrl(keywords) {
  return `https://www.etsy.com/search?q=${encodeURIComponent(keywords)}`
}

// Search Etsy for similar listings (price comparison)
export async function searchEtsyListings(keywords, limit = 5) {
  if (!ETSY_API_KEY) {
    return { source: 'Etsy', url: buildEtsySearchUrl(keywords), listings: [] }
  }
  try {
    const res = await fetch(
      `${BASE_URL}/public/resources/listings/active?keywords=${encodeURIComponent(keywords)}&limit=${limit}`,
      { headers: { 'x-api-key': ETSY_API_KEY } }
    )
    const data = await res.json()
    return {
      source: 'Etsy',
      url: buildEtsySearchUrl(keywords),
      listings: data.results || [],
    }
  } catch (err) {
    console.error('[Etsy]', err)
    return { source: 'Etsy', url: buildEtsySearchUrl(keywords), listings: [] }
  }
}
