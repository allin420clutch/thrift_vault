// ─── Pinterest API v5 ─────────────────────────────────────────────────────────
// Docs: https://developers.pinterest.com/docs/api/v5/
// Requires: Pinterest developer account + OAuth app

const APP_ID = import.meta.env.VITE_PINTEREST_APP_ID || ''

export function buildPinItUrl({ url, media, description }) {
  const params = new URLSearchParams({
    url,
    media: media || '',
    description: description || '',
  })
  return `https://www.pinterest.com/pin/create/button/?${params.toString()}`
}

export function buildPinterestSearchUrl(keywords) {
  return `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(keywords)}`
}

// Auto-pin a new product to a board (requires OAuth token — backend only)
export async function pinProduct({ imageUrl, title, description, link, boardId, accessToken }) {
  if (!accessToken || !boardId) {
    console.info('[Pinterest] Provide OAuth access token and boardId to auto-pin products')
    return null
  }
  try {
    const res = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        link,
        board_id: boardId,
        media_source: { source_type: 'image_url', url: imageUrl },
      }),
    })
    return await res.json()
  } catch (err) {
    console.error('[Pinterest]', err)
    return null
  }
}
