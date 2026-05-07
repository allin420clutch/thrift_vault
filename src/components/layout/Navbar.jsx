import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import {
  FiShoppingCart, FiHeart, FiMenu, FiX, FiSearch,
  FiUser, FiChevronDown
} from 'react-icons/fi'

const NAV_LINKS = [
  { label: 'Shop',        href: '/products' },
  { label: 'Collections', href: '/collections' },
  { label: 'Blog',        href: '/blog' },
  { label: 'Memberships', href: '/memberships' },
  { label: 'Sell With Us', href: '/affiliates' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { cart, wishlist, mobileMenuOpen, setMobileMenuOpen, setCartOpen } = useStore()
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false) }, [location.pathname])

  return (
    <>
      {/* Ticker Tape */}
      <div className="bg-tv-green text-tv-black py-1 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-inner font-mono text-xs font-semibold">
            {Array(3).fill('✦ FREE SHIPPING on orders over $75  ✦  NEW ARRIVALS every Tuesday  ✦  20% Consignment for Sellers  ✦  AI-Powered Similarity Search  ✦  Join as Curator for 15% Consignment  ').join('')}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-tv-border shadow-card'
            : 'bg-tv-black/95 border-b border-tv-border/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" id="nav-logo">
              <div className="w-8 h-8 rounded-lg bg-tv-green flex items-center justify-center group-hover:animate-pulse-green transition-all">
                <span className="text-tv-black font-mono font-bold text-sm">TV</span>
              </div>
              <span className="font-mono font-bold text-lg text-tv-text tracking-tight">
                Thrift<span className="text-tv-green">Vault</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 ${
                      isActive
                        ? 'text-tv-green bg-tv-green/10'
                        : 'text-tv-subtle hover:text-tv-text hover:bg-tv-card'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                id="nav-search"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-tv-subtle hover:text-tv-green hover:bg-tv-card transition-all"
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>

              {/* Wishlist */}
              <Link
                to="/products"
                id="nav-wishlist"
                className="relative p-2 rounded-lg text-tv-subtle hover:text-tv-rose hover:bg-tv-card transition-all"
                aria-label="Wishlist"
              >
                <FiHeart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-tv-rose text-white text-[10px] rounded-full flex items-center justify-center font-mono">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                id="nav-cart"
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-lg text-tv-subtle hover:text-tv-green hover:bg-tv-card transition-all"
                aria-label="Cart"
              >
                <FiShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-tv-green text-tv-black text-[10px] rounded-full flex items-center justify-center font-mono font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account */}
              <Link
                to="/memberships"
                id="nav-account"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-tv-border text-tv-subtle hover:border-tv-green hover:text-tv-green transition-all font-mono text-sm"
              >
                <FiUser size={14} />
                <span>Account</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                id="nav-mobile-menu"
                className="md:hidden p-2 rounded-lg text-tv-subtle hover:text-tv-text hover:bg-tv-card transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar (expandable) */}
          {searchOpen && (
            <div className="pb-3 animate-fade-in">
              <form onSubmit={e => { e.preventDefault(); window.location.href = `/products?q=${searchQuery}` }}>
                <input
                  id="nav-search-input"
                  autoFocus
                  type="text"
                  placeholder="Search vintage décor, garden ornaments..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-dark"
                />
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-tv-border animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg font-mono text-sm transition-all ${
                      isActive
                        ? 'text-tv-green bg-tv-green/10'
                        : 'text-tv-subtle hover:text-tv-text hover:bg-tv-card'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
