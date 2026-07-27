import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus, Bot, User } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Welcome to Afsheen Premium Fashion Hub! 👋 How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: 2,
      sender: 'bot',
      text: 'I can assist you with product inquiries, sizing recommendations, order tracking, and more.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');

    // Simulated bot response
    setTimeout(() => {
      const botResponses = [
        "Thank you for your message! A team member will be with you shortly. Meanwhile, you can check our FAQ section.",
        "I'd be happy to help! Could you provide more details about your inquiry?",
        "Great question! Let me connect you with a specialist who can assist you better.",
        "Thanks for reaching out! Our average response time is under 5 minutes. Please hold on.",
      ];
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gold-500 text-white rounded-full shadow-luxury-lg flex items-center justify-center hover:bg-gold-600 transition-all duration-300 animate-pulse-gold z-50"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-[360px] sm:w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden z-50 transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-[500px]'
        }`}>
          {/* Header */}
          <div className="bg-navy-500 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                <MessageCircle size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Afsheen Support</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition">
                <Minus size={16} />
              </button>
              <button onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition">
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 h-[370px] overflow-y-auto p-4 space-y-3 bg-cream-50">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot size={14} className="text-gold-600" />
                      </div>
                    )}
                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                      msg.sender === 'user'
                        ? 'bg-gold-500 text-white rounded-br-sm'
                        : 'bg-white text-navy-500 shadow-sm rounded-bl-sm'
                    }`}>
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                        {msg.time}
                      </p>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 bg-navy-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-navy-600" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-t border-cream-100 bg-white flex gap-2 overflow-x-auto scrollbar-hide">
                {['Track Order', 'Size Guide', 'Return Policy', 'Payment Info'].map(action => (
                  <button
                    key={action}
                    onClick={() => {
                      setMessage(action);
                    }}
                    className="flex-shrink-0 px-3 py-1 bg-cream-100 text-navy-500 text-xs rounded-full hover:bg-gold-100 hover:text-gold-700 transition"
                  >
                    {action}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-3 border-t border-cream-100 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 bg-cream-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 border border-cream-200"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="w-10 h-10 bg-gold-500 text-white rounded-full flex items-center justify-center hover:bg-gold-600 transition disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
