import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerAffiliate } from '../services/supabase'
import toast from 'react-hot-toast'
import {
  FiDollarSign, FiPackage, FiTrendingUp, FiCheck,
  FiArrowRight, FiHelpCircle, FiUser, FiMail, FiPhone,
  FiShoppingBag, FiFileText
} from 'react-icons/fi'
import { SiEtsy, SiPinterest, SiShopify } from 'react-icons/si'
import { FaAmazon } from 'react-icons/fa'

const HOW_IT_WORKS = [
  { step: '01', title: 'Apply',      icon: FiFileText,    desc: 'Fill out the seller application below. We review within 48 hours.' },
  { step: '02', title: 'List',       icon: FiPackage,     desc: 'Upload your items with photos and descriptions via your seller portal.' },
  { step: '03', title: 'We Market',  icon: FiTrendingUp,  desc: 'ThriftVault lists your items across our website and partner marketplaces.' },
  { step: '04', title: 'Get Paid',   icon: FiDollarSign,  desc: 'Receive 80% of the sale price (85% for Curator members) monthly.' },
]

const CONSIGNMENT_TIERS = [
  { tier: 'Free / Collector', fee: '20%', you_keep: '80%', listings: 'Up to 20 items' },
  { tier: 'Curator Membership', fee: '15%', you_keep: '85%', listings: 'Up to 50 items', highlight: true },
]

const MARKETPLACE_REACH = [
  { icon: FaAmazon,    label: 'Amazon Associates', color: '#FF9900', note: 'Affiliate product listing' },
  { icon: SiEtsy,      label: 'Etsy',             color: '#F1641E', note: 'Handmade & vintage marketplace' },
  { icon: SiPinterest, label: 'Pinterest',         color: '#E60023', note: 'Visual discovery platform' },
  { icon: SiShopify,   label: 'Shopify',           color: '#96bf48', note: 'Our storefront integration' },
]

export default function Affiliates() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    business_name: '', item_types: '', experience: '', message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [calcPrice, setCalcPrice] = useState(50)
  const [isCurator, setIsCurator] = useState(false)
  const fee = isCurator ? 0.15 : 0.20
  const earnings = (calcPrice * (1 - fee)).toFixed(2)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await registerAffiliate({ ...form, status: 'pending', created_at: new Date().toISOString() })
      setSubmitted(true)
      toast.success('Application submitted! We\'ll be in touch within 48 hours. 🌿')
    } catch {
      toast.success('Application received! We\'ll contact you at ' + form.email)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 glass-green rounded-full px-4 py-2 mb-4">
          <FiDollarSign size={14} className="text-tv-green" />
          <span className="font-mono text-xs text-tv-green">Consignment & Affiliate Programme</span>
        </div>
        <h1 className="font-sans font-black text-5xl text-tv-text mb-4">
          Sell With <span className="text-tv-green">ThriftVault</span>
        </h1>
        <p className="font-mono text-tv-subtle max-w-2xl mx-auto leading-relaxed">
          Have vintage finds, repurposed pieces, or new home décor to sell? List with us and reach buyers across ThriftVault, Amazon, Etsy, Pinterest, and Shopify — while keeping up to 85% of every sale.
        </p>
      </div>

      {/* How It Works */}
      <section className="mb-20" id="how-it-works">
        <h2 className="section-title text-center mb-10">
          How <span className="text-tv-green">Consignment</span> Works
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map(step => (
            <div key={step.step} className="bg-tv-card border border-tv-border rounded-xl p-6 relative">
              <div className="font-mono text-5xl font-black text-tv-green/15 absolute top-4 right-4">
                {step.step}
              </div>
              <step.icon size={28} className="text-tv-green mb-3" />
              <h3 className="font-sans font-bold text-lg text-tv-text mb-2">{step.title}</h3>
              <p className="font-mono text-xs text-tv-subtle leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Consignment Calculator */}
      <section id="consignment" className="mb-20 bg-tv-card border border-tv-border rounded-2xl p-8">
        <h2 className="section-title mb-2">
          💰 Earnings <span className="text-tv-green">Calculator</span>
        </h2>
        <p className="section-subtitle">Estimate your take-home per sale</p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div>
              <label className="font-mono text-sm text-tv-text block mb-2" htmlFor="calc-price">
                Sale Price: <span className="text-tv-green">${calcPrice}</span>
              </label>
              <input
                id="calc-price"
                type="range"
                min={5}
                max={500}
                step={5}
                value={calcPrice}
                onChange={e => setCalcPrice(Number(e.target.value))}
                className="w-full accent-tv-green"
              />
              <div className="flex justify-between font-mono text-xs text-tv-subtle mt-1">
                <span>$5</span><span>$500</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCurator(false)}
                className={`px-4 py-2 rounded-lg font-mono text-sm border transition-all ${!isCurator ? 'border-tv-green text-tv-green bg-tv-green/10' : 'border-tv-border text-tv-subtle'}`}
              >
                Standard (20% fee)
              </button>
              <button
                onClick={() => setIsCurator(true)}
                className={`px-4 py-2 rounded-lg font-mono text-sm border transition-all ${isCurator ? 'border-tv-green text-tv-green bg-tv-green/10' : 'border-tv-border text-tv-subtle'}`}
              >
                Curator (15% fee)
              </button>
            </div>
          </div>

          <div className="glass-green rounded-2xl p-8 text-center border border-tv-green/20">
            <p className="font-mono text-sm text-tv-subtle mb-2">You earn</p>
            <div className="font-mono font-black text-6xl text-tv-green mb-2">
              ${earnings}
            </div>
            <p className="font-mono text-xs text-tv-subtle">
              from a ${calcPrice} sale · {isCurator ? '15%' : '20%'} ThriftVault fee
            </p>
            {!isCurator && (
              <p className="font-mono text-xs text-tv-green mt-3">
                ✦ Upgrade to Curator and earn ${(calcPrice * 0.85).toFixed(2)} instead
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Consignment Tiers */}
      <section className="mb-20">
        <h2 className="section-title mb-8">Fee <span className="text-tv-green">Structure</span></h2>
        <div className="grid md:grid-cols-2 gap-6">
          {CONSIGNMENT_TIERS.map(t => (
            <div
              key={t.tier}
              className={`rounded-xl border p-6 ${
                t.highlight
                  ? 'border-tv-green bg-tv-card shadow-green-sm'
                  : 'border-tv-border bg-tv-card'
              }`}
            >
              {t.highlight && (
                <span className="badge-new mb-3 inline-block">BEST VALUE</span>
              )}
              <h3 className="font-sans font-bold text-xl text-tv-text mb-4">{t.tier}</h3>
              <div className="space-y-3">
                {[
                  ['ThriftVault Fee', t.fee],
                  ['You Keep', t.you_keep],
                  ['Max Active Listings', t.listings],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="font-mono text-xs text-tv-subtle">{label}</span>
                    <span className={`font-mono font-bold text-sm ${t.highlight ? 'text-tv-green' : 'text-tv-text'}`}>{val}</span>
                  </div>
                ))}
              </div>
              {t.highlight && (
                <Link to="/memberships" className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
                  Get Curator <FiArrowRight size={16} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace Reach */}
      <section className="mb-20">
        <h2 className="section-title mb-2">
          Multi-<span className="text-tv-green">Marketplace</span> Reach
        </h2>
        <p className="section-subtitle">Your items, everywhere buyers are shopping</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MARKETPLACE_REACH.map(mp => (
            <div key={mp.label} className="bg-tv-card border border-tv-border rounded-xl p-5 flex flex-col items-center text-center gap-3">
              <mp.icon size={32} style={{ color: mp.color }} />
              <div>
                <p className="font-sans font-semibold text-tv-text text-sm">{mp.label}</p>
                <p className="font-mono text-xs text-tv-subtle">{mp.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="bg-tv-card border border-tv-border rounded-2xl p-8 md:p-12">
        <h2 className="section-title mb-2">
          Seller <span className="text-tv-green">Application</span>
        </h2>
        <p className="section-subtitle">Join our network of curated sellers</p>

        {submitted ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌿</div>
            <h3 className="font-sans font-bold text-2xl text-tv-text mb-2">Application Received!</h3>
            <p className="font-mono text-tv-subtle mb-6">
              We'll review your application and contact you at {form.email} within 48 hours.
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              Browse the Store <FiArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" id="affiliate-form">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="font-mono text-xs text-tv-subtle block mb-1.5">
                  First Name *
                </label>
                <div className="relative">
                  <FiUser size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tv-subtle" />
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={form.first_name}
                    onChange={handleChange}
                    className="input-dark pl-9"
                    placeholder="Jane"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="last_name" className="font-mono text-xs text-tv-subtle block mb-1.5">
                  Last Name *
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={form.last_name}
                  onChange={handleChange}
                  className="input-dark"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="font-mono text-xs text-tv-subtle block mb-1.5">Email *</label>
                <div className="relative">
                  <FiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tv-subtle" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="input-dark pl-9"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="font-mono text-xs text-tv-subtle block mb-1.5">Phone</label>
                <div className="relative">
                  <FiPhone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tv-subtle" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="input-dark pl-9"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="business_name" className="font-mono text-xs text-tv-subtle block mb-1.5">
                Business / Shop Name (if applicable)
              </label>
              <input
                id="business_name"
                name="business_name"
                type="text"
                value={form.business_name}
                onChange={handleChange}
                className="input-dark"
                placeholder="My Vintage Finds"
              />
            </div>

            <div>
              <label htmlFor="item_types" className="font-mono text-xs text-tv-subtle block mb-1.5">
                What types of items do you want to sell? *
              </label>
              <input
                id="item_types"
                name="item_types"
                type="text"
                required
                value={form.item_types}
                onChange={handleChange}
                className="input-dark"
                placeholder="e.g. vintage ceramics, garden ornaments, repurposed furniture..."
              />
            </div>

            <div>
              <label htmlFor="experience" className="font-mono text-xs text-tv-subtle block mb-1.5">
                Selling experience (if any)
              </label>
              <select
                id="experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="input-dark appearance-none"
              >
                <option value="">Select...</option>
                <option>First time seller</option>
                <option>Sold on Etsy or eBay before</option>
                <option>Have my own online shop</option>
                <option>Physical store / market stall</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="font-mono text-xs text-tv-subtle block mb-1.5">
                Tell us about your items
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="input-dark resize-none"
                placeholder="Share what you're selling and why you'd be a great ThriftVault seller..."
              />
            </div>

            <button
              type="submit"
              id="affiliate-submit"
              disabled={submitting}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
              <FiArrowRight size={18} />
            </button>

            <p className="font-mono text-xs text-tv-muted text-center">
              We review all applications within 48 hours. By applying you agree to our consignment terms.
            </p>
          </form>
        )}
      </section>

      {/* FAQ */}
      <section id="faq" className="mt-16">
        <h2 className="section-title text-center mb-8">
          Seller <span className="text-tv-green">FAQs</span>
        </h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            { q: 'Who handles shipping?', a: 'You ship items to our fulfillment partner, or arrange direct shipping with buyers for larger items. We\'ll guide you through the process.' },
            { q: 'How and when do I get paid?', a: 'Payments are processed monthly via bank transfer or PayPal. You can track all sales and earnings in your seller dashboard.' },
            { q: 'Can I set my own prices?', a: 'Yes — you suggest a price and our curators may advise on market-appropriate pricing to maximize your sales.' },
            { q: 'What items are accepted?', a: 'Home & garden décor only: ornaments, furniture accents, wall art, planters, sculptures, lighting, and similar. Items must be clean, functional, and accurately described.' },
          ].map((faq, i) => (
            <div key={i} className="bg-tv-card border border-tv-border rounded-xl p-5">
              <div className="flex items-start gap-3">
                <FiHelpCircle size={16} className="text-tv-green flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-sans font-semibold text-tv-text mb-2">{faq.q}</h3>
                  <p className="font-mono text-xs text-tv-subtle leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
