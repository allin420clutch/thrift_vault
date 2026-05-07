import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MOCK_PRODUCTS } from '../data/mockData'
import { useStore } from '../store/useStore'
import { getPriceMatchInsight, findSimilarItems } from '../services/gemini'
import { buildAmazonSearchUrl } from '../services/amazon'
import { buildEtsySearchUrl } from '../services/etsy'
import { buildPinItUrl } from '../services/pinterest'
import ProductCard from '../components/products/ProductCard'
import toast from 'react-hot-toast'
import {
  FiShoppingCart, FiHeart, FiShare2, FiStar, FiPackage,
  FiRefreshCw, FiExternalLink, FiZap, FiArrowLeft
} from 'react-icons/fi'
import { SiEtsy, SiPinterest } from 'react-icons/si'
import { FaAmazon } from 'react-icons/fa'

const CONDITION_BADGE = {
  'New':        'badge-new',
  'Pre-loved':  'badge-used',
  'Repurposed': 'badge-repurposed',
}

export default function ProductDetail() {
  const { id } = useParams()
  const product = MOCK_PRODUCTS.find(p => p.id === Number(id))
  const { addToCart, toggleWishlist, isWishlisted } = useStore()

  const [activeImg,    setActiveImg]    = useState(0)
  const [qty,          setQty]          = useState(1)
  const [priceMatch,   setPriceMatch]   = useState(null)
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [similarItems, setSimilarItems] = useState([])
  const [loadingSimilar, setLoadingSimilar] = useState(false)
  const wishlisted = product ? isWishlisted(product.id) : false

  useEffect(() => {
    if (!product) return
    // Load similar items
    setLoadingSimilar(true)
    findSimilarItems(product.title + ' ' + product.description, MOCK_PRODUCTS)
      .then(items => setSimilarItems(items.filter(i => i.id !== product.id).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoadingSimilar(false))
  }, [product?.id])

  const handlePriceMatch = async () => {
    if (priceMatch || !product) return
    setLoadingPrice(true)
    try {
      const insight = await getPriceMatchInsight(product)
      setPriceMatch(insight)
    } catch {
      toast.error('Could not load price comparison')
    } finally {
      setLoadingPrice(false)
    }
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🏺</div>
        <h2 className="font-sans font-bold text-2xl text-tv-text mb-2">Item not found</h2>
        <Link to="/products" className="btn-outline">← Back to Shop</Link>
      </div>
    )
  }

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-xs text-tv-subtle mb-8">
        <Link to="/products" className="flex items-center gap-1 hover:text-tv-green transition-colors">
          <FiArrowLeft size={12} /> Products
        </Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-tv-text truncate max-w-xs">{product.title}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* ── Image Gallery ── */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-tv-card border border-tv-border mb-3">
            <img
              src={product.images?.[activeImg]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImg === i ? 'border-tv-green' : 'border-tv-border'
                  }`}
                >
                  <img src={img} alt={`View ${i+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div>
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className={CONDITION_BADGE[product.condition] || 'badge-new'}>
              {product.condition}
            </span>
            {discount && (
              <span className="bg-tv-rose text-white text-xs font-mono font-bold px-2 py-0.5 rounded">
                -{discount}% OFF
              </span>
            )}
            {!product.in_stock && (
              <span className="bg-tv-muted text-tv-subtle text-xs font-mono font-bold px-2 py-0.5 rounded">
                SOLD OUT
              </span>
            )}
          </div>

          <span className="font-mono text-xs text-tv-subtle block mb-2">{product.category}</span>
          <h1 className="font-sans font-black text-3xl text-tv-text leading-tight mb-4">
            {product.title}
          </h1>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <FiStar
                    key={s}
                    size={16}
                    className={s <= Math.round(product.rating) ? 'text-tv-amber fill-tv-amber' : 'text-tv-muted'}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-tv-subtle">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-mono font-black text-4xl text-tv-green">
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && (
              <span className="font-mono text-lg text-tv-subtle line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="font-mono text-tv-subtle text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map(tag => (
                <span key={tag} className="px-2 py-1 rounded-full bg-tv-card border border-tv-border font-mono text-xs text-tv-subtle">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Seller */}
          {product.seller && (
            <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-tv-card border border-tv-border">
              <div className="w-8 h-8 rounded-full bg-tv-green/20 flex items-center justify-center font-mono font-bold text-tv-green text-sm">
                {product.seller[0]}
              </div>
              <div>
                <p className="font-mono text-xs text-tv-subtle">Sold by</p>
                <p className="font-mono text-sm font-semibold text-tv-text">{product.seller}</p>
              </div>
            </div>
          )}

          {/* Qty + Cart */}
          <div className="flex gap-3 mb-4">
            <div className="flex items-center border border-tv-border rounded-lg overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-3 text-tv-subtle hover:text-tv-text hover:bg-tv-card transition-all font-mono"
              >−</button>
              <span className="px-4 py-3 font-mono text-tv-text border-x border-tv-border">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-3 text-tv-subtle hover:text-tv-text hover:bg-tv-card transition-all font-mono"
              >+</button>
            </div>
            <button
              id="product-add-cart"
              disabled={!product.in_stock}
              onClick={() => {
                for (let i = 0; i < qty; i++) addToCart(product)
                toast.success('Added to cart!')
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg font-mono font-bold transition-all ${
                product.in_stock
                  ? 'btn-primary'
                  : 'bg-tv-muted text-tv-subtle cursor-not-allowed px-6 py-3'
              }`}
            >
              <FiShoppingCart size={18} />
              {product.in_stock ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>

          {/* Wishlist + Share */}
          <div className="flex gap-3 mb-8">
            <button
              id="product-wishlist"
              onClick={() => { toggleWishlist(product); toast(wishlisted ? 'Removed from wishlist' : '❤️ Saved!') }}
              className={`flex-1 btn-outline flex items-center justify-center gap-2 ${wishlisted ? 'text-tv-rose border-tv-rose' : ''}`}
            >
              <FiHeart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
              {wishlisted ? 'Saved' : 'Save'}
            </button>
            <a
              id="product-pin"
              href={buildPinItUrl({ url: window.location.href, media: product.images?.[0], description: product.title })}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-tv-border text-tv-subtle hover:text-[#E60023] hover:border-[#E60023] transition-all"
              aria-label="Pin to Pinterest"
            >
              <SiPinterest size={18} />
            </a>
          </div>

          {/* ── Price Match ── */}
          <div className="rounded-xl bg-tv-card border border-tv-border p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiZap size={16} className="text-tv-green" />
                <span className="font-mono font-semibold text-tv-text text-sm">AI Price Match</span>
              </div>
              {!priceMatch && (
                <button
                  id="product-price-match"
                  onClick={handlePriceMatch}
                  disabled={loadingPrice}
                  className="font-mono text-xs text-tv-green border border-tv-green/30 px-3 py-1 rounded-full hover:bg-tv-green/10 transition-all"
                >
                  {loadingPrice ? 'Analyzing...' : 'Compare Prices'}
                </button>
              )}
            </div>

            {priceMatch ? (
              <div className="space-y-2">
                <p className="font-mono text-xs text-tv-subtle leading-relaxed">{priceMatch.analysis}</p>
                <div className="flex items-center gap-3">
                  <span className={`badge-new px-3 py-1 rounded-full font-mono text-xs ${
                    priceMatch.verdict === 'great deal' ? 'badge-new' :
                    priceMatch.verdict === 'premium' ? 'badge-used' : 'badge-repurposed'
                  }`}>
                    {priceMatch.verdict?.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs text-tv-green">
                    Save est. {priceMatch.savings_est}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <a
                  href={buildAmazonSearchUrl(product.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono text-tv-subtle hover:text-[#FF9900] transition-colors"
                >
                  <FaAmazon size={12} /> Amazon
                  <FiExternalLink size={10} />
                </a>
                <a
                  href={buildEtsySearchUrl(product.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono text-tv-subtle hover:text-[#F1641E] transition-colors"
                >
                  <SiEtsy size={12} /> Etsy
                  <FiExternalLink size={10} />
                </a>
              </div>
            )}
          </div>

          {/* Shipping note */}
          <div className="flex items-center gap-2 text-tv-subtle font-mono text-xs">
            <FiPackage size={14} />
            Free shipping on orders over $75 · Usually ships in 3–5 business days
          </div>
        </div>
      </div>

      {/* ── Similar Items ── */}
      <section className="mt-20">
        <div className="flex items-center gap-3 mb-6">
          <FiZap size={20} className="text-tv-green" />
          <h2 className="section-title mb-0">
            AI-Suggested <span className="text-tv-green">Similar Items</span>
          </h2>
        </div>
        {loadingSimilar ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square skeleton rounded-xl" />
            ))}
          </div>
        ) : similarItems.length > 0 ? (
          <div className="masonry-grid">
            {similarItems.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="masonry-grid">
            {MOCK_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
