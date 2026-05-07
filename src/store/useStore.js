import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // ── Cart ──────────────────────────────────────────────────
  cart: [],
  addToCart: (product) => {
    const existing = get().cart.find(i => i.id === product.id)
    if (existing) {
      set(state => ({
        cart: state.cart.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        ),
      }))
    } else {
      set(state => ({ cart: [...state.cart, { ...product, qty: 1 }] }))
    }
  },
  removeFromCart: (id) => set(state => ({ cart: state.cart.filter(i => i.id !== id) })),
  clearCart: () => set({ cart: [] }),
  cartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.qty, 0),

  // ── Wishlist ──────────────────────────────────────────────
  wishlist: [],
  toggleWishlist: (product) => {
    const in_ = get().wishlist.some(i => i.id === product.id)
    set(state => ({
      wishlist: in_
        ? state.wishlist.filter(i => i.id !== product.id)
        : [...state.wishlist, product],
    }))
  },
  isWishlisted: (id) => get().wishlist.some(i => i.id === id),

  // ── User ──────────────────────────────────────────────────
  user: null,
  membership: 'free', // 'free' | 'collector' | 'curator'
  setUser: (user) => set({ user }),
  setMembership: (tier) => set({ membership: tier }),

  // ── UI ────────────────────────────────────────────────────
  cartOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
}))
