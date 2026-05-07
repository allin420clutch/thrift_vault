-- ════════════════════════════════════════════════════════════════════════════
-- ThriftVault — Clean Schema Reset + Rebuild
-- Project: thrift_vault (jwehiyuklrfgzhnxedth.supabase.co)
--
-- INSTRUCTIONS: Paste this ENTIRE file into the Supabase SQL Editor and Run.
-- It drops any broken partial tables first, then rebuilds cleanly.
-- ════════════════════════════════════════════════════════════════════════════

-- ─── Step 1: Drop everything in reverse dependency order ────────────────────
DROP TABLE IF EXISTS chat_sessions         CASCADE;
DROP TABLE IF EXISTS members               CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS blog_posts            CASCADE;
DROP TABLE IF EXISTS collection_products   CASCADE;
DROP TABLE IF EXISTS collections           CASCADE;
DROP TABLE IF EXISTS products              CASCADE;
DROP TABLE IF EXISTS affiliates            CASCADE;

-- ─── Step 2: Affiliates (must exist before products) ────────────────────────
CREATE TABLE affiliates (
  id               BIGSERIAL PRIMARY KEY,
  first_name       TEXT NOT NULL,
  last_name        TEXT NOT NULL,
  email            TEXT UNIQUE NOT NULL,
  phone            TEXT,
  business_name    TEXT,
  item_types       TEXT,
  experience       TEXT,
  message          TEXT,
  status           TEXT        DEFAULT 'pending'
                   CHECK (status IN ('pending','approved','rejected','suspended')),
  consignment_rate NUMERIC(5,2)  DEFAULT 20.00,
  total_sales      NUMERIC(10,2) DEFAULT 0,
  created_at       TIMESTAMPTZ   DEFAULT NOW()
);

-- ─── Step 3: Products ────────────────────────────────────────────────────────
CREATE TABLE products (
  id                BIGSERIAL PRIMARY KEY,
  title             TEXT          NOT NULL,
  description       TEXT,
  price             NUMERIC(10,2) NOT NULL,
  original_price    NUMERIC(10,2),
  category          TEXT          NOT NULL DEFAULT 'Garden Ornaments',
  condition         TEXT          NOT NULL DEFAULT 'Pre-loved'
                    CHECK (condition IN ('New','Pre-loved','Repurposed')),
  images            TEXT[]        DEFAULT '{}',
  tags              TEXT[]        DEFAULT '{}',
  seller            TEXT          DEFAULT 'ThriftVault',
  affiliate_id      BIGINT        REFERENCES affiliates(id) ON DELETE SET NULL,
  in_stock          BOOLEAN       DEFAULT TRUE,
  rating            NUMERIC(3,1),
  reviews           INT           DEFAULT 0,
  marketplace_links JSONB         DEFAULT '{}',
  created_at        TIMESTAMPTZ   DEFAULT NOW()
);

-- ─── Step 4: Collections ─────────────────────────────────────────────────────
CREATE TABLE collections (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT UNIQUE NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  color       TEXT        DEFAULT '#00ff41',
  sort_order  INT         DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE collection_products (
  collection_id BIGINT REFERENCES collections(id) ON DELETE CASCADE,
  product_id    BIGINT REFERENCES products(id)    ON DELETE CASCADE,
  PRIMARY KEY (collection_id, product_id)
);

-- ─── Step 5: Blog Posts ──────────────────────────────────────────────────────
CREATE TABLE blog_posts (
  id           BIGSERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  cover_image  TEXT,
  category     TEXT        DEFAULT 'General',
  author       TEXT        DEFAULT 'ThriftVault Team',
  published    BOOLEAN     DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  reading_time INT         DEFAULT 5,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Step 6: Newsletter Subscribers ─────────────────────────────────────────
CREATE TABLE newsletter_subscribers (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  first_name    TEXT,
  subscribed    BOOLEAN     DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Step 7: Members (linked to Supabase Auth) ───────────────────────────────
CREATE TABLE members (
  id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email              TEXT,
  tier               TEXT DEFAULT 'free'
                     CHECK (tier IN ('free','collector','curator')),
  stripe_customer_id TEXT,
  stripe_sub_id      TEXT,
  sub_status         TEXT DEFAULT 'inactive',
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Step 8: Chat Sessions ───────────────────────────────────────────────────
CREATE TABLE chat_sessions (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  messages   JSONB       DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════════════════════════════════════
ALTER TABLE products               ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections            ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates             ENABLE ROW LEVEL SECURITY;
ALTER TABLE members                ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions          ENABLE ROW LEVEL SECURITY;

-- Public: read all products
CREATE POLICY "public_read_products"
  ON products FOR SELECT USING (TRUE);

-- Public: read all collections
CREATE POLICY "public_read_collections"
  ON collections FOR SELECT USING (TRUE);

-- Public: read collection→product links
CREATE POLICY "public_read_collection_products"
  ON collection_products FOR SELECT USING (TRUE);

-- Public: read published blog posts only
CREATE POLICY "public_read_blog_posts"
  ON blog_posts FOR SELECT USING (published = TRUE);

-- Newsletter: anyone can subscribe (INSERT only)
CREATE POLICY "public_insert_newsletter"
  ON newsletter_subscribers FOR INSERT WITH CHECK (TRUE);

-- Affiliates: anyone can apply (INSERT only)
CREATE POLICY "public_insert_affiliate"
  ON affiliates FOR INSERT WITH CHECK (TRUE);

-- Members: each user manages their own row
CREATE POLICY "members_own_select"
  ON members FOR SELECT USING (auth.uid() = id);
CREATE POLICY "members_own_update"
  ON members FOR UPDATE USING (auth.uid() = id);

-- Chat sessions: each user sees only their own
CREATE POLICY "chat_own_all"
  ON chat_sessions FOR ALL USING (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════════════════════
-- Seed Data — Collections
-- ════════════════════════════════════════════════════════════════════════════
INSERT INTO collections (name, slug, description, color, sort_order) VALUES
  ('Boho Garden',        'boho-garden',        'Free-spirited garden pieces with earthy textures',      '#d97706', 1),
  ('Vintage Farmhouse',  'vintage-farmhouse',   'Rustic, warm countryside warmth for your home',         '#78716c', 2),
  ('Art Deco Revival',   'art-deco-revival',    'Golden-age glamour — geometry and brass elegance',      '#b45309', 3),
  ('Zen Garden',         'zen-garden',          'Tranquil meditative sculptures for peaceful spaces',    '#059669', 4),
  ('Coastal & Driftwood','coastal-driftwood',   'Sun-bleached shoreline treasures from the coastline',  '#0891b2', 5);

-- ════════════════════════════════════════════════════════════════════════════
-- DONE ✓  (8 tables · RLS policies · 5 seed collections)
-- Next: Storage → New Bucket → name: product-images → Public ON
-- ════════════════════════════════════════════════════════════════════════════