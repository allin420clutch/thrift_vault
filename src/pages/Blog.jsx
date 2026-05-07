import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MOCK_BLOG_POSTS } from '../data/mockData'
import { FiClock, FiUser, FiArrowRight } from 'react-icons/fi'

const CATEGORIES = ['All', 'Garden Tips', 'DIY & Craft', 'Interior Design', 'Sustainability']

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? MOCK_BLOG_POSTS
    : MOCK_BLOG_POSTS.filter(p => p.category === activeCategory)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-sans font-black text-5xl text-tv-text mb-3">
          The <span className="text-tv-green">Vault</span> Blog
        </h1>
        <p className="font-mono text-tv-subtle max-w-xl mx-auto">
          Décor inspiration, sustainability guides, thrift tips, and seller stories from the ThriftVault community.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            id={`blog-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-mono text-sm transition-all border ${
              activeCategory === cat
                ? 'bg-tv-green text-tv-black border-tv-green font-bold'
                : 'border-tv-border text-tv-subtle hover:border-tv-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Post (first) */}
      {filtered[0] && (
        <Link
          to={`/blog/${filtered[0].slug}`}
          id={`blog-featured-${filtered[0].id}`}
          className="group grid md:grid-cols-2 gap-8 mb-12 bg-tv-card border border-tv-border rounded-2xl overflow-hidden hover:border-tv-muted transition-all"
        >
          <div className="aspect-video md:aspect-auto overflow-hidden">
            <img
              src={filtered[0].cover_image}
              alt={filtered[0].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="badge-new">{filtered[0].category}</span>
              <span className="font-mono text-xs text-tv-subtle">Featured</span>
            </div>
            <h2 className="font-sans font-black text-3xl text-tv-text leading-tight mb-4 group-hover:text-tv-green transition-colors">
              {filtered[0].title}
            </h2>
            <p className="font-mono text-tv-subtle text-sm leading-relaxed mb-6">{filtered[0].excerpt}</p>
            <div className="flex items-center gap-4 text-tv-subtle font-mono text-xs mb-6">
              <span className="flex items-center gap-1"><FiUser size={12} />{filtered[0].author}</span>
              <span className="flex items-center gap-1"><FiClock size={12} />{filtered[0].reading_time} min</span>
              <span>{filtered[0].published_at}</span>
            </div>
            <span className="btn-outline inline-flex items-center gap-2 self-start">
              Read Article <FiArrowRight size={16} />
            </span>
          </div>
        </Link>
      )}

      {/* Rest of Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.slice(1).map(post => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            id={`blog-post-${post.id}`}
            className="group bg-tv-card border border-tv-border rounded-xl overflow-hidden hover:border-tv-muted transition-all"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="badge-new text-xs">{post.category}</span>
                <span className="font-mono text-xs text-tv-subtle flex items-center gap-1">
                  <FiClock size={11} />{post.reading_time} min
                </span>
              </div>
              <h3 className="font-sans font-bold text-lg text-tv-text group-hover:text-tv-green transition-colors leading-snug mb-3 line-clamp-2">
                {post.title}
              </h3>
              <p className="font-mono text-xs text-tv-subtle line-clamp-2 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between font-mono text-xs text-tv-subtle">
                <span>{post.author}</span>
                <span>{post.published_at}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="mt-16 text-center glass-green rounded-2xl p-12 border border-tv-green/20">
        <h2 className="font-sans font-black text-3xl text-tv-text mb-2">
          Get Posts Delivered to Your Inbox
        </h2>
        <p className="font-mono text-tv-subtle mb-6">Weekly décor tips, DIY guides, and thrift finds.</p>
        <Link to="/#home-newsletter" className="btn-primary inline-flex items-center gap-2">
          Subscribe Free <FiArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
