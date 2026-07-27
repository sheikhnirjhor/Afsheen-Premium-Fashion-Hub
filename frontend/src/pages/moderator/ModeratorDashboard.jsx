import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Send, User, Clock, MessageCircle, LogOut, Circle } from 'lucide-react';

const sampleChats = [
  {
    id: 1,
    customer: 'Fatima Rahman',
    lastMessage: 'Can I get a custom size for the lehenga?',
    time: '2 min ago',
    unread: 2,
    status: 'online',
  },
  {
    id: 2,
    customer: 'Nusrat Jahan',
    lastMessage: 'When will my order be delivered?',
    time: '15 min ago',
    unread: 0,
    status: 'online',
  },
  {
    id: 3,
    customer: 'Sabrina Akter',
    lastMessage: 'I need to return an item',
    time: '1 hr ago',
    unread: 1,
    status: 'offline',
  },
];

const sampleMessages = [
  { id: 1, sender: 'customer', text: 'Hi, I\'m interested in the Royal Red Bridal Lehenga.', time: '10:30 AM' },
  { id: 2, sender: 'agent', text: 'Hello Fatima! Great choice. That\'s one of our bestsellers. What size are you looking for?', time: '10:31 AM' },
  { id: 3, sender: 'customer', text: 'I usually wear M, but I\'d like it customized a bit longer. Is that possible?', time: '10:33 AM' },
  { id: 4, sender: 'agent', text: 'Absolutely! We offer custom sizing at no extra charge for bridal outfits. Please share your exact measurements.', time: '10:34 AM' },
  { id: 5, sender: 'customer', text: 'Can I get a custom size for the lehenga?', time: '10:36 AM' },
];

export default function ModeratorDashboard() {
  const [activeChat, setActiveChat] = useState(sampleChats[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(sampleMessages);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'agent',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setMessage('');
  };

  return (
    <div className="h-screen flex bg-cream-50">
      {/* Sidebar - Chat List */}
      <aside className="w-80 bg-white border-r border-cream-200 flex flex-col">
        <div className="p-4 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones size={20} className="text-gold-500" />
            <h2 className="font-serif font-bold text-navy-500">Live Chat</h2>
          </div>
          <Link to="/" className="text-gray-400 hover:text-gray-600"><LogOut size={18} /></Link>
        </div>

        <div className="p-3 border-b border-cream-200">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-3 py-2 bg-cream-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 border border-cream-200"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {sampleChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`w-full p-4 text-left border-b border-cream-100 hover:bg-cream-50 transition ${
                activeChat?.id === chat.id ? 'bg-gold-50 border-l-2 border-l-gold-500' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-navy-500" />
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    chat.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-navy-500 text-sm">{chat.customer}</span>
                    <span className="text-[10px] text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="w-5 h-5 bg-gold-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                    {chat.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-cream-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                <User size={18} className="text-navy-500" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h3 className="font-semibold text-navy-500">{activeChat?.customer}</h3>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <Circle size={8} className="fill-green-500" /> Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={14} />
            Session started 10:30 AM
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-cream-50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${msg.sender === 'agent' ? 'order-1' : ''}`}>
                {msg.sender === 'customer' && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-navy-100 rounded-full flex items-center justify-center">
                      <User size={12} className="text-navy-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">{activeChat?.customer}</span>
                  </div>
                )}
                <div className={`px-4 py-3 rounded-2xl text-sm ${
                  msg.sender === 'agent'
                    ? 'bg-gold-500 text-white rounded-br-sm'
                    : 'bg-white text-navy-500 shadow-sm rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
                <p className={`text-[10px] text-gray-400 mt-1 ${msg.sender === 'agent' ? 'text-right' : ''}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="bg-white border-t border-cream-200 px-6 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 input-luxury"
            />
            <button type="submit" disabled={!message.trim()}
              className="btn-gold px-6 flex items-center gap-2 disabled:opacity-50">
              <Send size={16} />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
