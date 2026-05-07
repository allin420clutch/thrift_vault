import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ChatBot from './components/ai/ChatBot'
import Home from './pages/Home'
import Products from './pages/Products'
import Collections from './pages/Collections'
import ProductDetail from './pages/ProductDetail'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Memberships from './pages/Memberships'
import Affiliates from './pages/Affiliates'

export default function App() {
  return (
    <div className="min-h-screen bg-tv-black text-tv-text flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/products"          element={<Products />} />
          <Route path="/products/:id"      element={<ProductDetail />} />
          <Route path="/collections"       element={<Collections />} />
          <Route path="/blog"              element={<Blog />} />
          <Route path="/blog/:slug"        element={<BlogPost />} />
          <Route path="/memberships"       element={<Memberships />} />
          <Route path="/affiliates"        element={<Affiliates />} />
        </Routes>
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}
