import { createClient } from '@supabase/supabase-js'

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL     || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// ─── Startup validation ───────────────────────────────────────────────────────
const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder') && supabaseAnonKey

if (!isConfigured) {
  console.warn(
    '%c[ThriftVault] Supabase not configured yet.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.\n' +
    'Find your project URL at: Supabase Dashboard → Project Settings → API',
    'color: #f59e0b; font-weight: bold;'
  )
}

// Supabase JS v2 supports the new sb_publishable_ key format automatically.
// The secret key (sb_secret_...) must NEVER be used here — backend/Edge Functions only.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_anon_key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

export const isSupabaseReady = () => isConfigured

// ─── Products ────────────────────────────────────────────────────────────────
export async function fetchProducts({ category, condition, minPrice, maxPrice, limit = 24, offset = 0 } = {}) {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category)   query = query.eq('category', category)
  if (condition)  query = query.eq('condition', condition)
  if (minPrice)   query = query.gte('price', minPrice)
  if (maxPrice)   query = query.lte('price', maxPrice)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// ─── Collections ─────────────────────────────────────────────────────────────
export async function fetchCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select('*, collection_products(product_id, products(*))')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export async function fetchBlogPosts({ limit = 12, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, category, published_at, author')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return data || []
}

export async function fetchBlogPostBySlug(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (error) throw error
  return data
}

// ─── Newsletter ───────────────────────────────────────────────────────────────
export async function subscribeNewsletter(email, firstName = '') {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email, first_name: firstName, subscribed_at: new Date().toISOString() })
  if (error) throw error
}

// ─── Affiliates ───────────────────────────────────────────────────────────────
export async function registerAffiliate(data) {
  const { error } = await supabase.from('affiliates').insert(data)
  if (error) throw error
}

export async function fetchAffiliateByEmail(email) {
  const { data, error } = await supabase
    .from('affiliates')
    .select('*')
    .eq('email', email)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const auth = supabase.auth
