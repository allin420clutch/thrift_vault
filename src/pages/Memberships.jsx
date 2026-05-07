import { useState } from 'react'
import { MEMBERSHIP_PLANS } from '../data/mockData'
import { FiCheck, FiZap, FiStar, FiUsers, FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'

const PLAN_ICONS = { free: FiUsers, collector: FiStar, curator: FiZap }

export default function Memberships() {
  const [billing, setBilling] = useState('monthly') // 'monthly' | 'annual'
  const [loading, setLoading] = useState(null)

  const getPrice = (plan) => {
    if (plan.price === 0) return '$0'
    const price = billing === 'annual' ? (plan.price * 10).toFixed(2) : plan.price.toFixed(2)
    return `$${price}`
  }

  const getPeriod = (plan) => {
    if (plan.price === 0) return 'forever'
    return billing === 'annual' ? '/year' : '/month'
  }

  const handleCheckout = async (plan) => {
    if (plan.price === 0) {
      toast.success("You're on the Free plan! Create an account to get started.")
      return
    }
    setLoading(plan.id)
    // Stripe integration placeholder
    setTimeout(() => {
      toast('Stripe integration coming soon — add VITE_STRIPE_PUBLISHABLE_KEY to activate!', { icon: '💳' })
      setLoading(null)
    }, 1000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 glass-green rounded-full px-4 py-2 mb-4">
          <FiStar size={14} className="text-tv-green" />
          <span className="font-mono text-xs text-tv-green">Membership Plans</span>
        </div>
        <h1 className="font-sans font-black text-5xl text-tv-text mb-4">
          Choose Your <span className="text-tv-green">Vault</span> Level
        </h1>
        <p className="font-mono text-tv-subtle max-w-xl mx-auto">
          From curious browsers to serious curators — there's a plan that fits your thrifting style.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12" id="billing-toggle">
        <button
          onClick={() => setBilling('monthly')}
          className={`font-mono text-sm px-4 py-2 rounded-lg transition-all ${
            billing === 'monthly' ? 'text-tv-green bg-tv-green/10' : 'text-tv-subtle'
          }`}
        >
          Monthly
        </button>
        <div
          onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
          className="w-12 h-6 bg-tv-card border border-tv-border rounded-full cursor-pointer relative transition-all hover:border-tv-green"
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-tv-green transition-all duration-200 ${
            billing === 'annual' ? 'left-7' : 'left-1'
          }`} />
        </div>
        <button
          onClick={() => setBilling('annual')}
          className={`font-mono text-sm px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            billing === 'annual' ? 'text-tv-green bg-tv-green/10' : 'text-tv-subtle'
          }`}
        >
          Annual
          <span className="badge-new text-xs">Save 17%</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {MEMBERSHIP_PLANS.map(plan => {
          const Icon = PLAN_ICONS[plan.id]
          return (
            <div
              key={plan.id}
              id={`plan-${plan.id}`}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all ${
                plan.highlight
                  ? 'border-tv-green bg-tv-card shadow-green-md scale-105'
                  : 'border-tv-border bg-tv-card hover:border-tv-muted'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-tv-green text-tv-black font-mono font-bold text-xs px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                plan.highlight ? 'bg-tv-green' : 'bg-tv-surface border border-tv-border'
              }`}>
                <Icon size={22} className={plan.highlight ? 'text-tv-black' : 'text-tv-green'} />
              </div>

              <h2 className="font-sans font-black text-2xl text-tv-text mb-1">{plan.name}</h2>
              <p className="font-mono text-xs text-tv-subtle mb-5">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-mono font-black text-4xl text-tv-green">{getPrice(plan)}</span>
                <span className="font-mono text-tv-subtle text-sm">{getPeriod(plan)}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(feat => (
                  <li key={feat} className="flex items-start gap-2">
                    <FiCheck size={15} className="text-tv-green flex-shrink-0 mt-0.5" />
                    <span className="font-mono text-xs text-tv-subtle leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                id={`plan-cta-${plan.id}`}
                onClick={() => handleCheckout(plan)}
                disabled={loading === plan.id}
                className={`w-full flex items-center justify-center gap-2 font-mono font-bold py-3 rounded-xl transition-all active:scale-95 ${
                  plan.highlight
                    ? 'btn-primary'
                    : plan.price === 0
                    ? 'border border-tv-border text-tv-subtle hover:border-tv-green hover:text-tv-green'
                    : 'btn-outline'
                }`}
              >
                {loading === plan.id ? 'Loading...' : plan.cta}
                {plan.price > 0 && <FiArrowRight size={16} />}
              </button>
            </div>
          )
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-tv-card border border-tv-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-tv-border">
          <h2 className="font-sans font-bold text-2xl text-tv-text">Full Feature Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-tv-border">
                <th className="text-left p-4 font-mono text-sm text-tv-subtle">Feature</th>
                {MEMBERSHIP_PLANS.map(p => (
                  <th key={p.id} className="text-center p-4 font-mono text-sm text-tv-text">
                    {p.name}
                    {p.highlight && <span className="ml-1 badge-new">⭐</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {[
                ['Browse inventory',          true,  true,  true  ],
                ['Wishlist & saves',           true,  true,  true  ],
                ['AI chatbot searches',        '5/mo','Unlimited','Unlimited'],
                ['New arrivals early access',  false, '24h early','48h early'],
                ['Order discount',             '—',   '10%', '10%' ],
                ['Consignment fee',            '20%', '20%', '15%' ],
                ['Max consignment listings',   '5',   '20',  '50'  ],
                ['Featured listing slots',     '—',   '—',   '2/mo'],
                ['Analytics dashboard',        false, false, true  ],
                ['Priority support',           false, true,  true  ],
                ['Direct buyer messaging',     false, false, true  ],
              ].map(([feature, ...vals]) => (
                <tr key={String(feature)} className="border-b border-tv-border/50 hover:bg-tv-surface/50 transition-colors">
                  <td className="p-4 text-tv-subtle">{feature}</td>
                  {vals.map((val, i) => (
                    <td key={i} className="p-4 text-center">
                      {val === true  ? <FiCheck size={16} className="mx-auto text-tv-green" /> :
                       val === false ? <span className="text-tv-muted">—</span> :
                       <span className="text-tv-text">{val}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="font-sans font-bold text-2xl text-tv-text text-center mb-8">
          Common Questions
        </h2>
        {[
          {
            q: 'Can I cancel anytime?',
            a: 'Yes — cancel anytime with no fees. Your benefits continue until the end of your billing period.',
          },
          {
            q: 'What is consignment?',
            a: "You submit your items to ThriftVault's inventory. When sold, you receive your share (80% on Free/Collector, 85% on Curator) automatically.",
          },
          {
            q: 'How does the AI chatbot work?',
            a: "It's powered by Google's Gemini AI and trained on ThriftVault's store context. It can find similar items in our inventory, compare prices with Amazon and Etsy, and answer any product questions.",
          },
          {
            q: 'Which marketplaces can I sell on?',
            a: "ThriftVault connects with Amazon Associates, Etsy, Shopify, and Pinterest. Your listed items can appear across all platforms with one submission.",
          },
        ].map((faq, i) => (
          <div key={i} className="mb-4 bg-tv-card border border-tv-border rounded-xl p-5">
            <h3 className="font-sans font-semibold text-tv-text mb-2">{faq.q}</h3>
            <p className="font-mono text-xs text-tv-subtle leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
