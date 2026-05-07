import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'

const CONDITION_BADGE = {
  'New':        'badge-new',
  'Pre-loved':  'badge-used',
  'Repurposed': 'badge-repurposed',
}

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore()
  const [imgError, setImgError] = useState(false)
  const wishlisted = isWishlisted(product.id)

  const handleCart = (e) => {
    e.preventDefault()
    if (!product.in_stock) return
    addToCart(product)
    toast.success(`${product.title.slice(0, 30)}... added to cart!`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggleWishlist(product)
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️', {
      icon: wishlisted ? '💔' : '❤️',
    })
  }

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return (
    <Link
      to={`/products/${product.id}`}
      id={`product-card-${product.id}`}
      className="product-card group bg-tv-card border border-tv-border rounded-xl overflow-hidden block"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-tv-surface">
        {!imgError ? (
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-tv-muted">
            🏺
          </div>
        )}

        {/* Overlays */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={CONDITION_BADGE[product.condition] || 'badge-new'}>
            {product.condition}
          </span>
          {discount && (
            <span className="bg-tv-rose text-white text-xs font-mono font-bold px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
          {!product.in_stock && (
            <span className="bg-tv-muted text-tv-subtle text-xs font-mono font-bold px-2 py-0.5 rounded">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            id={`wishlist-${product.id}`}
            onClick={handleWishlist}
            className={`p-2 rounded-lg glass transition-all ${
              wishlisted ? 'text-tv-rose' : 'text-tv-subtle hover:text-tv-rose'
            }`}
            aria-label="Toggle wishlist"
          >
            <FiHeart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            id={`quick-view-${product.id}`}
            onClick={(e) => e.preventDefault()}
            className="p-2 rounded-lg glass text-tv-subtle hover:text-tv-green transition-all"
            aria-label="Quick view"
          >
            <FiEye size={16} />
          </button>
        </div>

        {/* Add to Cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            id={`cart-${product.id}`}
            onClick={handleCart}
            disabled={!product.in_stock}
            className={`w-full py-2.5 flex items-center justify-center gap-2 font-mono text-sm font-semibold transition-all ${
              product.in_stock
                ? 'bg-tv-green text-tv-black hover:bg-tv-green-d'
                : 'bg-tv-muted text-tv-subtle cursor-not-allowed'
            }`}
          >
            <FiShoppingCart size={16} />
            {product.in_stock ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-mono text-xs text-tv-subtle mb-1">{product.category}</p>
        <h3 className="font-sans font-semibold text-tv-text text-sm leading-tight mb-2 line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-tv-green">${product.price.toFixed(2)}</span>
            {product.original_price && (
              <span className="font-mono text-xs text-tv-subtle line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>
          {product.seller && product.seller !== 'ThriftVault' && (
            <span className="font-mono text-xs text-tv-subtle">by {product.seller}</span>
          )}
        </div>
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-tv-amber text-xs">{'★'.repeat(Math.round(product.rating))}</span>
            <span className="font-mono text-xs text-tv-subtle">({product.reviews})</span>
          </div>
        )}
      </div>
    </Link>
  )
}
