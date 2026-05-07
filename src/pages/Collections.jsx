import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/products/ProductCard'
import { MOCK_COLLECTIONS, MOCK_PRODUCTS } from '../data/mockData'
import { FiArrowRight } from 'react-icons/fi'

export default function Collections() {
  const [activeCol, setActiveCol] = useState(null)

  const displayCollection = activeCol || MOCK_COLLECTIONS[0]
  const colProducts = MOCK_PRODUCTS.filter(p =>
    displayCollection.product_ids?.includes(p.id)
  )

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={displayCollection.cover_image}
          alt={displayCollection.name}
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tv-black via-tv-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">
          <span className="font-mono text-xs text-tv-green uppercase tracking-widest mb-2 block">
            Collection
          </span>
          <h1 className="font-sans font-black text-5xl text-white mb-2">{displayCollection.name}</h1>
          <p className="font-mono text-white/70 max-w-lg">{displayCollection.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Collection Tabs */}
        <div className="flex gap-3 flex-wrap mb-10">
          {MOCK_COLLECTIONS.map(col => (
            <button
              key={col.id}
              id={`collection-tab-${col.slug}`}
              onClick={() => setActiveCol(col)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm transition-all border ${
                (activeCol?.id === col.id || (!activeCol && col.id === MOCK_COLLECTIONS[0].id))
                  ? 'border-tv-green text-tv-green bg-tv-green/10'
                  : 'border-tv-border text-tv-subtle hover:border-tv-muted'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: col.color }}
              />
              {col.name}
            </button>
          ))}
        </div>

        {/* Products in Collection */}
        {colProducts.length > 0 ? (
          <div className="masonry-grid">
            {colProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-tv-subtle font-mono">
            Coming soon — this collection is being curated 🌿
          </div>
        )}

        {/* CTA to all products */}
        <div className="mt-14 text-center">
          <p className="font-mono text-tv-subtle mb-4">
            Looking for something specific? Browse the full inventory.
          </p>
          <Link to="/products" id="collections-shop-all" className="btn-primary inline-flex items-center gap-2">
            Browse All Items <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
