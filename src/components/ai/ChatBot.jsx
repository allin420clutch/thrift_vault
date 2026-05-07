import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../../services/gemini'
import { FiMessageSquare, FiX, FiSend, FiMinus, FiZap } from 'react-icons/fi'

const QUICK_PROMPTS = [
  '🔍 Find something like a terracotta pot',
  '💰 Is $45 a good price for a vintage mirror?',
  '🌿 Show me boho garden pieces',
  '♻️ What repurposed items do you have?',
]

function TypingIndicator() {
  return (
    <div className="chat-bot flex items-center gap-1.5 w-fit">
      <span className="w-2 h-2 bg-tv-green rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 bg-tv-green rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 bg-tv-green rounded-full animate-bounce" />
    </div>
  )
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm **VaultBot** 🌿 — ThriftVault's AI shopping assistant.\n\nI can help you find similar items, compare prices, and discover hidden gems. What are you looking for today?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [messages, open, minimized])

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput('')

    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const reply = await sendChatMessage(newMessages, userMsg)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops! Something went wrong. Please try again 🌿",
      }])
    } finally {
      setLoading(false)
    }
  }

  const renderContent = (text) => {
    // Simple markdown-like rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          id="chatbot-open"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-tv-green rounded-full flex items-center justify-center shadow-green-lg hover:scale-110 transition-all duration-300 animate-pulse-green"
          aria-label="Open AI Chat"
        >
          <FiMessageSquare size={22} className="text-tv-black" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div
          id="chatbot-window"
          className={`fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-green-lg border border-tv-border transition-all duration-300 ${
            minimized ? 'h-14' : 'h-[520px]'
          } flex flex-col`}
          style={{ background: '#111111' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-tv-green">
            <div className="flex items-center gap-2">
              <FiZap size={16} className="text-tv-black" />
              <span className="font-mono font-bold text-tv-black text-sm">VaultBot AI</span>
              <span className="w-2 h-2 bg-tv-black rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <button
                id="chatbot-minimize"
                onClick={() => setMinimized(!minimized)}
                className="text-tv-black hover:opacity-70 transition-opacity"
                aria-label={minimized ? 'Expand chat' : 'Minimize chat'}
              >
                <FiMinus size={16} />
              </button>
              <button
                id="chatbot-close"
                onClick={() => setOpen(false)}
                className="text-tv-black hover:opacity-70 transition-opacity"
                aria-label="Close chat"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-tv-green flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <FiZap size={10} className="text-tv-black" />
                      </div>
                    )}
                    <div
                      className={msg.role === 'user' ? 'chat-user' : 'chat-bot'}
                      dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                    />
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-tv-green flex items-center justify-center flex-shrink-0">
                      <FiZap size={10} className="text-tv-black" />
                    </div>
                    <TypingIndicator />
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length === 1 && (
                <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map(p => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="text-xs font-mono text-tv-subtle border border-tv-border rounded-full px-3 py-1 hover:border-tv-green hover:text-tv-green transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-tv-border">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    id="chatbot-input"
                    type="text"
                    placeholder="Ask about any item..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    className="input-dark text-xs py-2 flex-1"
                    disabled={loading}
                  />
                  <button
                    id="chatbot-send"
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="p-2 rounded-lg bg-tv-green text-tv-black hover:bg-tv-green-d transition-all disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <FiSend size={16} />
                  </button>
                </div>
                <p className="font-mono text-[10px] text-tv-muted mt-1.5 text-center">
                  Powered by Gemini AI · ThriftVault
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
