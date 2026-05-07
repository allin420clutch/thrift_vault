import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProductCard from '../components/products/ProductCard'
import { MOCK_PRODUCTS, MOCK_COLLECTIONS, MOCK_BLOG_POSTS } from '../data/mockData'
import { subscribeNewsletter } from '../services/supabase'
import toast from 'react-hot-toast'
import {
  FiArrowRight, FiStar, FiPackage, FiRefreshCw, FiShoppingBag,
  FiTrendingUp, FiHeart
} from 'react-icons/fi'
import { SiEtsy, SiPinterest, SiShopify } from "react-icons/si";
import { FaAmazon } from "react-icons/fa";
//, SiEtsy, SiPinterest, SiShopify } from 'react-icons/si'

const HERO_STATS = [
  { label: 'Unique Items',    value: '2,400+', icon: FiPackage },
  { label: 'Happy Buyers',   value: '8,100+', icon: FiHeart },
  { label: 'Repurposed Pieces', value: '950+', icon: FiRefreshCw },
  { label: 'Active Sellers', value: '120+',   icon: FiTrendingUp },
]

const MARKETPLACE_PARTNERS = [
  { icon: FaAmazon,   label: 'Amazon', color: '#FF9900' },
  { icon: SiEtsy,     label: 'Etsy',   color: '#F1641E' },
  { icon: SiPinterest,label: 'Pinterest', color: '#E60023' },
  { icon: SiShopify,  label: 'Shopify', color: '#96bf48' },
]

export default function Home() {
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const featuredProducts = MOCK_PRODUCTS.slice(0, 8)
  const newArrivals = MOCK_PRODUCTS.filter(p => p.condition === 'New').slice(0, 4)
  const repurposed  = MOCK_PRODUCTS.filter(p => p.condition === 'Repurposed').slice(0, 4)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setSubscribing(true)
    try {
      await subscribeNewsletter(email)
      toast.success('Welcome to ThriftVault! 🌿')
      setEmail('')
    } catch {
      toast.success('Thanks — see you soon! 🌿')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="hero-section relative min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full py-20">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 glass-green rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-tv-green rounded-full animate-glow-pulse" />
              <span className="font-mono text-xs text-tv-green">AI-Powered Thrift Shopping</span>
            </div>

            <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl font-black leading-none mb-6">
              Discover
              <span className="gradient-text block">Hidden Treasures</span>
              <span className="text-tv-text">for Your Home</span>
            </h1>

            <p className="font-mono text-tv-subtle text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Vintage, repurposed & new home décor curated with love. From garden ornaments to interior gems — every piece tells a story.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products" id="hero-shop-btn" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                <FiShoppingBag size={18} />
                Shop the Vault
                <FiArrowRight size={18} />
              </Link>
              <Link to="/collections" id="hero-collections-btn" className="btn-outline flex items-center gap-2 text-base px-8 py-4">
                View Collections
              </Link>
            </div>
          </div>
        </div>

        {/* Floating decorative cards */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 space-y-4 animate-float">
          {[MOCK_PRODUCTS[3], MOCK_PRODUCTS[7]].map((p, i) => (
            <div key={p.id} className="glass-green rounded-xl p-3 w-52 border border-tv-green/20" style={{ animationDelay: `${i * 0.5}s` }}>
              <img src={p.images[0]} alt={p.title} className="w-full h-28 object-cover rounded-lg mb-2" />
              <p className="font-mono text-xs text-tv-subtle">{p.category}</p>
              <p className="font-sans text-sm font-semibold text-tv-text truncate">{p.title}</p>
              <p className="font-mono text-tv-green font-bold">${p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section className="border-y border-tv-border bg-tv-surface py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HERO_STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-2 text-tv-green" size={24} />
                <div className="font-mono font-black text-3xl text-tv-text mb-1">{stat.value}</div>
                <div className="font-mono text-xs text-tv-subtle">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Curated <span className="text-tv-green">Collections</span></h2>
            <p className="section-subtitle">Thematic groups for every style</p>
          </div>
          <Link to="/collections" className="btn-ghost flex items-center gap-1">
            View all <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_COLLECTIONS.slice(0, 3).map(col => (
            <Link
              key={col.id}
              to={`/collections`}
              id={`collection-${col.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] block"
            >
              <img
                src={col.cover_image}
                alt={col.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <div
                  className="inline-block w-3 h-3 rounded-full mb-2"
                  style={{ backgroundColor: col.color }}
                />
                <h3 className="font-sans font-bold text-xl text-white mb-1">{col.name}</h3>
                <p className="font-mono text-xs text-white/70">{col.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ──────────────────────────────── */}
      <section className="bg-tv-surface border-y border-tv-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title">Featured <span className="text-tv-green">Finds</span></h2>
              <p className="section-subtitle">Handpicked by our curators this week</p>
            </div>
            <Link to="/products" className="btn-ghost flex items-center gap-1">
              Shop all <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="masonry-grid">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS vs REPURPOSED ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* New */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="badge-new text-sm px-3 py-1">NEW</span>
              <h2 className="section-title mb-0">New Arrivals</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
          {/* Repurposed */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="badge-repurposed text-sm px-3 py-1">REPURPOSED</span>
              <h2 className="section-title mb-0">Repurposed Gems</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {repurposed.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARKETPLACE PARTNERS ───────────────────────────── */}
      <section className="border-y border-tv-border py-12 bg-tv-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-xs text-tv-subtle uppercase tracking-widest mb-6">
            Also Available On
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {MARKETPLACE_PARTNERS.map(mp => (
              <div
                key={mp.label}
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-tv-card border border-tv-border hover:border-tv-muted transition-all"
              >
                <mp.icon size={22} style={{ color: mp.color }} />
                <span className="font-mono text-sm text-tv-subtle">{mp.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">From the <span className="text-tv-green">Vault Blog</span></h2>
            <p className="section-subtitle">Tips, trends, and thrift stories</p>
          </div>
          <Link to="/blog" className="btn-ghost flex items-center gap-1">
            All posts <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_BLOG_POSTS.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              id={`blog-preview-${post.id}`}
              className="group bg-tv-card border border-tv-border rounded-xl overflow-hidden hover:border-tv-muted transition-all"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge-new text-xs">{post.category}</span>
                  <span className="font-mono text-xs text-tv-subtle">{post.reading_time} min read</span>
                </div>
                <h3 className="font-sans font-semibold text-tv-text text-base leading-snug mb-2 group-hover:text-tv-green transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="font-mono text-xs text-tv-subtle line-clamp-2">{post.excerpt}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-xs text-tv-subtle">by {post.author}</span>
                  <span className="font-mono text-xs text-tv-subtle">{post.published_at}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AFFILIATES CTA ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-2xl overflow-hidden border border-tv-green/20 bg-hero-gradient p-12 text-center">
          <div className="absolute inset-0 bg-green-glow pointer-events-none" />
          <FiStar className="mx-auto mb-4 text-tv-green animate-float" size={40} />
          <h2 className="font-sans font-black text-4xl text-tv-text mb-3">
            Have items to sell?
          </h2>
          <p className="font-mono text-tv-subtle max-w-xl mx-auto mb-8 leading-relaxed">
            Join as a consignment seller and list your vintage, repurposed, or new items. Just 20% commission — you keep 80%.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/affiliates" id="home-affiliate-cta" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
              Start Selling
              <FiArrowRight size={18} />
            </Link>
            <Link to="/memberships" id="home-curator-cta" className="btn-outline text-base px-8 py-4">
              Curator Plan — 15% fee
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ─────────────────────────────────────── */}
      <section className="bg-tv-surface border-t border-tv-border py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-sans font-black text-3xl text-tv-text mb-2">
            Never Miss a <span className="text-tv-green">Treasure</span>
          </h2>
          <p className="font-mono text-tv-subtle mb-8">
            Weekly new arrivals, décor inspiration, and exclusive subscriber-only deals.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto" id="home-newsletter">
            <input
              id="home-newsletter-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-dark flex-1"
              required
            />
            <button
              type="submit"
              id="home-newsletter-submit"
              disabled={subscribing}
              className="btn-primary whitespace-nowrap"
            >
              {subscribing ? 'Joining...' : 'Join Free'}
            </button>
          </form>
          <p className="font-mono text-xs text-tv-muted mt-3">
            No spam. Unsubscribe anytime. 🌿
          </p>
        </div>
      </section>
    </div>
  )
}
