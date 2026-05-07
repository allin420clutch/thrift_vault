// ─── Shopify Storefront API (GraphQL) ─────────────────────────────────────────
// Docs: https://shopify.dev/docs/api/storefront
// Requires: Shopify store + Storefront API access token

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || ''
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || ''

const ENDPOINT = SHOPIFY_DOMAIN
  ? `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`
  : null

async function shopifyFetch(query, variables = {}) {
  if (!ENDPOINT || !STOREFRONT_TOKEN) {
    console.info('[Shopify] Configure VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN')
    return null
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

export async function fetchShopifyProducts(first = 12) {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id title handle
            priceRange { minVariantPrice { amount currencyCode } }
            images(first: 1) { edges { node { url altText } } }
          }
        }
      }
    }
  `
  const data = await shopifyFetch(query, { first })
  return data?.products?.edges?.map(e => e.node) || []
}

export function buildShopifyProductUrl(handle) {
  return SHOPIFY_DOMAIN ? `https://${SHOPIFY_DOMAIN}/products/${handle}` : '#'
}
