import { useParams, Link } from 'react-router-dom'
import { MOCK_BLOG_POSTS } from '../data/mockData'
import { FiArrowLeft, FiClock, FiUser, FiCalendar } from 'react-icons/fi'
import { SiPinterest } from 'react-icons/si'
import { buildPinItUrl } from '../services/pinterest'

// Mock full content map
const FULL_CONTENT = {
  'style-garden-repurposed-treasures': `
Transforming your garden with repurposed finds is one of the most rewarding creative endeavors. Whether you're hunting at local thrift stores, estate sales, or right here at ThriftVault, the possibilities are truly endless.

**1. Old Watering Cans as Planters**

A vintage enamel watering can — even one with a few rust spots — makes a charming planter for trailing succulents or bright marigolds. The patina only adds to the charm.

**2. Wooden Ladders as Vertical Gardens**

An old wooden ladder leaned against a wall creates instant vertical interest. Use it to display terracotta pots, wind chimes, and hanging baskets at varying heights.

**3. Window Frames as Garden Focal Points**

Salvaged window frames, especially with their glass removed, can be painted and used as trellises for climbing plants like sweet peas or clematis.

**4. Cracked Crockery as Drainage Helpers**

Before discarding a cracked bowl or mug, use it to line the base of larger planters. It improves drainage while keeping the soil in place.

**5. Iron Bedheads as Trellises**

Vintage iron bedheads have beautiful scrollwork that makes them perfect for supporting climbing roses or beans in the vegetable garden.

**6. Mason Jar Lanterns**

Old mason jars with sand and candles create a magical evening ambiance. Group them along a garden path or hang them from tree branches.

**7. Tea Kettle Bird Feeders**

Drill a small drainage hole in an old tea kettle, fill it with birdseed, and hang it upside down in a tree. Utterly charming.

**8. Bicycle Wheels as Décor**

An old bicycle wheel painted and mounted on a fence becomes an unexpected focal point. Thread fairy lights through the spokes for evening magic.

**9. Book Pages for Seed Markers**

Pages from damaged books can be folded into cone shapes and used as biodegradable seed markers in the vegetable garden.

**10. Colanders as Hanging Planters**

A vintage colander already has drainage holes. Line it with moss, fill with potting mix, and hang as a stunning planter for petunias or nasturtiums.

---

The best part of repurposed garden décor is that each piece carries a history. When someone asks about that rust-dappled watering can overflowing with lavender, you get to tell a story.
  `,
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = MOCK_BLOG_POSTS.find(p => p.slug === slug)

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-sans font-bold text-2xl text-tv-text mb-4">Post not found</h2>
        <Link to="/blog" className="btn-outline">← Back to Blog</Link>
      </div>
    )
  }

  const content = FULL_CONTENT[slug] || post.excerpt + '\n\n*Full article coming soon. Subscribe to our newsletter to be notified!*'

  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h3 key={i} className="font-sans font-bold text-xl text-tv-text mt-8 mb-3">{line.slice(2, -2)}</h3>
      }
      if (line.startsWith('---')) {
        return <hr key={i} className="border-tv-border my-8" />
      }
      if (line.trim() === '') return <div key={i} className="mb-4" />
      // inline bold
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <p key={i} className="font-mono text-tv-subtle leading-relaxed text-sm mb-2">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-tv-text">{part}</strong> : part)}
        </p>
      )
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <Link to="/blog" className="inline-flex items-center gap-2 text-tv-subtle hover:text-tv-green font-mono text-sm mb-8 transition-colors">
        <FiArrowLeft size={14} /> Back to Blog
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="badge-new">{post.category}</span>
        </div>
        <h1 className="font-sans font-black text-4xl text-tv-text leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-tv-subtle font-mono text-xs pb-6 border-b border-tv-border">
          <span className="flex items-center gap-1"><FiUser size={12} />{post.author}</span>
          <span className="flex items-center gap-1"><FiCalendar size={12} />{post.published_at}</span>
          <span className="flex items-center gap-1"><FiClock size={12} />{post.reading_time} min read</span>
          <a
            href={buildPinItUrl({ url: window.location.href, media: post.cover_image, description: post.title })}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[#E60023] transition-colors ml-auto"
          >
            <SiPinterest size={12} /> Pin
          </a>
        </div>
      </div>

      {/* Cover Image */}
      <div className="aspect-video rounded-2xl overflow-hidden mb-10">
        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <article className="prose-custom">
        {renderContent(content)}
      </article>

      {/* Tags */}
      <div className="mt-10 pt-6 border-t border-tv-border">
        <div className="flex flex-wrap gap-2">
          {['thrift', 'garden', 'repurposed', 'décor', 'sustainable'].map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-tv-card border border-tv-border font-mono text-xs text-tv-subtle">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Next Post CTA */}
      <div className="mt-12 glass-green rounded-xl p-8 border border-tv-green/20 text-center">
        <h3 className="font-sans font-bold text-xl text-tv-text mb-2">Enjoyed this article?</h3>
        <p className="font-mono text-tv-subtle text-sm mb-4">Subscribe for weekly tips and early access to new arrivals.</p>
        <Link to="/blog" className="btn-primary inline-flex items-center gap-2">
          More Articles →
        </Link>
      </div>
    </div>
  )
}
