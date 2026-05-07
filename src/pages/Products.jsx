import { useState, useMemo } from 'react'
import ProductCard from '../components/products/ProductCard'
import { MOCK_PRODUCTS } from '../data/mockData'
import { FiFilter, FiX, FiSearch, FiChevronDown } from 'react-icons/fi'

const CATEGORIES   = ['All', 'Garden Ornaments', 'Interior Decorations']
const CONDITIONS   = ['All', 'New', 'Pre-loved', 'Repurposed']
const SORT_OPTIONS = [
  { label: 'Newest First',     value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Top Rated',        value: 'rating' },
]

export default function Products() {
  const [category,    setCategory]    = useState('All')
  const [condition,   setCondition]   = useState('All')
  const [priceRange,  setPriceRange]  = useState([0, 200])
  const [sort,        setSort]        = useState('newest')
  const [search,      setSearch]      = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = useMemo(() => {
    let items = [...MOCK_PRODUCTS]
    if (category  !== 'All') items = items.filter(p => p.category  === category)
    if (condition !== 'All') items = items.filter(p => p.condition === condition)
    items = items.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tags?.some(t => t.includes(q)) ||
        p.description?.toLowerCase().includes(q)
      )
    }
    switch (sort) {
      case 'price_asc':  return items.sort((a, b) => a.price - b.price)
      case 'price_desc': return items.sort((a, b) => b.price - a.price)
      case 'rating':     return items.sort((a, b) => (b.rating||0) - (a.rating||0))
      default:           return items.sort((a, b) => b.id - a.id)
    }
  }, [category, condition, priceRange, sort, search])

  const activeFilters = [
    category  !== 'All' && category,
    condition !== 'All' && condition,
  ].filter(Boolean)

  const FilterPanel = () => (
    <aside className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-mono font-semibold text-tv-text text-sm mb-3">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`w-full text-left px-3 py-2 rounded-lg font-mono text-sm transition-all ${
                category === c
                  ? 'bg-tv-green/10 text-tv-green border border-tv-green/30'
                  : 'text-tv-subtle hover:text-tv-text hover:bg-tv-card'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="font-mono font-semibold text-tv-text text-sm mb-3">Condition</h3>
        <div className="space-y-1">
          {CONDITIONS.map(c => (
            <button
              key={c}
              onClick={() => setCondition(c)}
              className={`w-full text-left px-3 py-2 rounded-lg font-mono text-sm transition-all ${
                condition === c
                  ? 'bg-tv-green/10 text-tv-green border border-tv-green/30'
                  : 'text-tv-subtle hover:text-tv-text hover:bg-tv-card'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-mono font-semibold text-tv-text text-sm mb-3">
          Price: ${priceRange[0]} — ${priceRange[1]}
        </h3>
        <input
          type="range"
          min={0}
          max={200}
          value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-tv-green"
        />
        <div className="flex justify-between font-mono text-xs text-tv-subtle mt-1">
          <span>$0</span>
          <span>$200+</span>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => { setCategory('All'); setCondition('All'); setPriceRange([0, 200]); setSearch('') }}
        className="w-full btn-ghost text-tv-rose hover:text-tv-rose border border-tv-rose/30 hover:bg-tv-rose/10 flex items-center gap-2 justify-center"
      >
        <FiX size={14} /> Clear Filters
      </button>
    </aside>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-sans font-black text-4xl text-tv-text mb-2">
          The <span className="text-tv-green">Vault</span>
        </h1>
        <p className="font-mono text-tv-subtle">
          {filtered.length} unique {filtered.length === 1 ? 'item' : 'items'} — vintage, repurposed & new
        </p>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(f => (
            <span key={f} className="flex items-center gap-1 glass-green rounded-full px-3 py-1 font-mono text-xs text-tv-green border border-tv-green/20">
              {f}
              <button onClick={() => { f === category ? setCategory('All') : setCondition('All') }}>
                <FiX size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <FilterPanel />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-tv-subtle" size={15} />
              <input
                id="products-search"
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-dark pl-9 py-2 text-sm"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                id="products-sort"
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="input-dark py-2 text-sm pr-8 appearance-none cursor-pointer min-w-44"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-tv-subtle pointer-events-none" size={14} />
            </div>

            {/* Mobile filter toggle */}
            <button
              id="products-filter-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden btn-outline flex items-center gap-2 py-2"
            >
              <FiFilter size={15} /> Filters
              {activeFilters.length > 0 && (
                <span className="w-5 h-5 bg-tv-green text-tv-black rounded-full font-mono text-xs font-bold flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Filter Panel */}
          {sidebarOpen && (
            <div className="lg:hidden mb-6 p-4 bg-tv-card border border-tv-border rounded-xl animate-fade-in">
              <FilterPanel />
            </div>
          )}

          {/* Products Grid */}
          {filtered.length > 0 ? (
            <div className="masonry-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏺</div>
              <h3 className="font-sans font-bold text-xl text-tv-text mb-2">No items found</h3>
              <p className="font-mono text-tv-subtle">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
