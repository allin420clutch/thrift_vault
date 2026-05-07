import { Link } from 'react-router-dom'
import { useState } from 'react'
import { subscribeNewsletter } from '../../services/supabase'
import toast from 'react-hot-toast'
import {
  FiInstagram, FiTwitter, FiYoutube, FiFacebook,
  FiArrowRight, FiMail
} from 'react-icons/fi'
import { SiPinterest, SiEtsy, SiShopify } from 'react-icons/si'

const FOOTER_LINKS = {
  Shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Collections', href: '/collections' },
    { label: 'New Arrivals', href: '/products?condition=New' },
    { label: 'Pre-loved', href: '/products?condition=Pre-loved' },
    { label: 'Repurposed', href: '/products?condition=Repurposed' },
  ],
  Company: [
    { label: 'Blog', href: '/blog' },
    { label: 'About ThriftVault', href: '/#about' },
    { label: 'Sustainability', href: '/#sustainability' },
    { label: 'Press', href: '/#press' },
  ],
  Sellers: [
    { label: 'Sell With Us', href: '/affiliates' },
    { label: 'Consignment Info', href: '/affiliates#consignment' },
    { label: 'Memberships', href: '/memberships' },
    { label: 'Seller FAQs', href: '/affiliates#faq' },
  ],
  Support: [
    { label: 'Shipping Policy', href: '/#shipping' },
    { label: 'Returns', href: '/#returns' },
    { label: 'Contact Us', href: '/#contact' },
    { label: 'Privacy Policy', href: '/#privacy' },
  ],
}

const SOCIAL_LINKS = [
  { icon: FiInstagram, href: '#', label: 'Instagram' },
  { icon: SiPinterest, href: '#', label: 'Pinterest' },
  { icon: FiFacebook, href: '#', label: 'Facebook' },
  { icon: FiTwitter, href: '#', label: 'Twitter / X' },
  { icon: FiYoutube, href: '#', label: 'YouTube' },
]

const MARKETPLACE_BADGES = [
  { icon: SiEtsy, label: 'Etsy Shop', href: '#', color: '#F1641E' },
  { icon: SiShopify, label: 'Shopify', href: '#', color: '#96bf48' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await subscribeNewsletter(email)
      toast.success('Subscribed! Welcome to the ThriftVault community 🌿')
      setEmail('')
    } catch {
      toast.success('Thanks! We\'ll be in touch soon.') // graceful fallback
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-tv-surface border-t border-tv-border mt-20">
      {/* Newsletter Strip */}
      <div className="border-b border-tv-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-sans font-bold text-tv-text mb-1">
                Join the <span className="text-tv-green">Vault</span>
              </h2>
              <p className="text-tv-subtle font-mono text-sm">
                Get early access to new arrivals, styling tips, and exclusive member deals.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto" id="footer-newsletter">
              <div className="relative flex-1 md:w-72">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-tv-subtle" size={16} />
                <input
                  id="footer-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-dark pl-9"
                  required
                />
              </div>
              <button
                type="submit"
                id="footer-subscribe-btn"
                disabled={loading}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? 'Joining...' : 'Subscribe'}
                <FiArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-tv-green flex items-center justify-center">
                <span className="text-tv-black font-mono font-bold text-sm">TV</span>
              </div>
              <span className="font-mono font-bold text-tv-text">
                Thrift<span className="text-tv-green">Vault</span>
              </span>
            </Link>
            <p className="text-tv-subtle font-mono text-xs leading-relaxed mb-4">
              Curated vintage, repurposed & new home décor. Every item has a story — find yours.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 flex-wrap">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="p-2 rounded-lg bg-tv-card border border-tv-border text-tv-subtle hover:text-tv-green hover:border-tv-green transition-all"
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-mono font-semibold text-tv-text text-sm mb-3">{section}</h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="font-mono text-xs text-tv-subtle hover:text-tv-green transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-tv-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-tv-subtle">
            © {new Date().getFullYear()} ThriftVault. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-tv-subtle">Also find us on:</span>
            {MARKETPLACE_BADGES.map(b => (
              <a
                key={b.label}
                href={b.href}
                aria-label={b.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tv-card border border-tv-border hover:border-tv-muted transition-all"
              >
                <b.icon size={14} style={{ color: b.color }} />
                <span className="font-mono text-xs text-tv-subtle">{b.label}</span>
              </a>
            ))}
            <a
              href="#"
              className="font-mono text-xs px-3 py-1.5 rounded-lg bg-tv-card border border-tv-border text-tv-subtle hover:border-tv-muted transition-all"
            >
              🛍 Amazon Store
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
