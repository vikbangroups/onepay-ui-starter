/**
 * Support/Chat Premium Component
 * Enterprise-grade customer support & live chat
 * Features: Chat history, support tickets, live chat simulation, FAQ
 */

import React, { useState, useRef, useEffect } from 'react';
import '../../styles/support-chat-premium.css';

interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  message: string;
  timestamp: string;
  avatar?: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: string;
  priority: 'low' | 'medium' | 'high';
  created: string;
  lastUpdated: string;
  messages: number;
}

const SupportChatPremium: React.FC = () => {
  // ==================== STATE ====================
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      message: 'Welcome to OnePay Support! How can we assist you today?',
      timestamp: new Date(Date.now() - 5 * 60000).toLocaleString(),
    },
    {
      id: '2',
      type: 'user',
      message: 'Hi, I need help with my recent payment. It shows pending.',
      timestamp: new Date(Date.now() - 4 * 60000).toLocaleString(),
      avatar: '👤',
    },
    {
      id: '3',
      type: 'agent',
      message: 'Thank you for reaching out! I\'d be happy to help. Can you please provide your transaction reference number?',
      timestamp: new Date(Date.now() - 3 * 60000).toLocaleString(),
      avatar: '🤖',
    },
    {
      id: '4',
      type: 'user',
      message: 'Sure, it\'s REF2610007. The amount is ₹10,000.',
      timestamp: new Date(Date.now() - 2 * 60000).toLocaleString(),
      avatar: '👤',
    },
    {
      id: '5',
      type: 'agent',
      message: 'Thank you! I can see your transaction. It appears to be in processing. This typically takes 24-48 hours. You\'ll receive a confirmation email once completed.',
      timestamp: new Date(Date.now() - 1 * 60000).toLocaleString(),
      avatar: '🤖',
    },
  ]);

  const [supportTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT001',
      subject: 'Payment pending for 2 days',
      status: 'in-progress',
      category: 'Payments',
      priority: 'high',
      created: new Date(Date.now() - 2 * 86400000).toLocaleString(),
      lastUpdated: new Date(Date.now() - 30 * 60000).toLocaleString(),
      messages: 5,
    },
    {
      id: 'TKT002',
      subject: 'Unable to add beneficiary',
      status: 'open',
      category: 'Account',
      priority: 'medium',
      created: new Date(Date.now() - 1 * 86400000).toLocaleString(),
      lastUpdated: new Date(Date.now() - 2 * 3600000).toLocaleString(),
      messages: 2,
    },
    {
      id: 'TKT003',
      subject: 'Withdrawal amount received correctly',
      status: 'resolved',
      category: 'Payments',
      priority: 'low',
      created: new Date(Date.now() - 5 * 86400000).toLocaleString(),
      lastUpdated: new Date(Date.now() - 1 * 86400000).toLocaleString(),
      messages: 3,
    },
  ]);

  const [faqItems] = useState([
    {
      id: 'FAQ001',
      question: 'How long does a transfer take?',
      answer: 'Most UPI transfers are instant. NEFT transfers typically take 2-4 hours. RTGS transfers are processed within 30 minutes.',
    },
    {
      id: 'FAQ002',
      question: 'What is the maximum withdrawal limit?',
      answer: 'Your withdrawal limit depends on your account verification status. Standard accounts can withdraw up to ₹1,00,000 per day.',
    },
    {
      id: 'FAQ003',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking "Forgot Password" on the login page. We\'ll send a verification code to your registered email.',
    },
    {
      id: 'FAQ004',
      question: 'Is my money safe with OnePay?',
      answer: 'Yes! OnePay uses bank-level encryption and is fully compliant with RBI guidelines. Your funds are insured up to ₹5 lakhs.',
    },
  ]);

  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'faq'>('chat');
  const [expandedFAQ, setExpandedFAQ] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ==================== AUTO-SCROLL ====================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ==================== HANDLERS ====================

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: ChatMessage = {
      id: String(chatMessages.length + 1),
      type: 'user',
      message: messageInput,
      timestamp: new Date().toLocaleString(),
      avatar: '👤',
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageInput('');

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: String(chatMessages.length + 2),
        type: 'agent',
        message: 'Thank you for your message! Our support team will review and respond shortly.',
        timestamp: new Date().toLocaleString(),
        avatar: '🤖',
      };
      setChatMessages(prev => [...prev, agentResponse]);
    }, 1500);
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { color: string; label: string }> = {
      high: { color: '#fc8181', label: 'High' },
      medium: { color: '#f6ad55', label: 'Medium' },
      low: { color: '#68d391', label: 'Low' },
    };
    return config[priority] || { color: '#a0aec0', label: 'Normal' };
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: string }> = {
      open: { color: '#4299e1', icon: '●' },
      'in-progress': { color: '#f6ad55', icon: '◐' },
      resolved: { color: '#48bb78', icon: '✓' },
      closed: { color: '#cbd5e0', icon: '✕' },
    };
    return config[status] || { color: '#a0aec0', icon: '?' };
  };

  // ==================== RENDER ====================

  return (
    <div className="support-chat-container">
      <div className="support-header">
        <h1>💬 Support & Customer Help Center</h1>
        <p>We're here to help! Chat with our support team or browse FAQs</p>
      </div>

      {/* ==================== TAB NAVIGATION ==================== */}
      <div className="support-tabs">
        <button
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Live Chat
        </button>
        <button
          className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          🎫 Support Tickets ({supportTickets.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          ❓ FAQs
        </button>
      </div>

      {/* ==================== CHAT TAB ==================== */}
      {activeTab === 'chat' && (
        <div className="chat-section">
          <div className="chat-header">
            <div className="agent-info">
              <span className="agent-avatar">🤖</span>
              <div>
                <h3>OnePay Support</h3>
                <p>Average response time: 2 minutes</p>
              </div>
            </div>
            <div className="online-status">
              <span className="status-dot"></span>
              Online
            </div>
          </div>

          <div className="chat-messages">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`message-bubble ${msg.type}`}>
                {msg.avatar && <span className="message-avatar">{msg.avatar}</span>}
                <div className="message-content">
                  <p>{msg.message}</p>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-section">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Type your message here..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="message-input"
              />
              <button className="btn-send" onClick={handleSendMessage}>
                Send
              </button>
            </div>
            <p className="help-text">💡 Available 24/7 | Response within 2 minutes</p>
          </div>
        </div>
      )}

      {/* ==================== TICKETS TAB ==================== */}
      {activeTab === 'tickets' && (
        <div className="tickets-section">
          <div className="tickets-header">
            <h2>Your Support Tickets</h2>
            <button className="btn-new-ticket">+ Create New Ticket</button>
          </div>

          <div className="tickets-list">
            {supportTickets.map(ticket => (
              <div key={ticket.id} className="ticket-item">
                <div className="ticket-header-row">
                  <div className="ticket-title">
                    <h3>{ticket.subject}</h3>
                    <span className="ticket-id">ID: {ticket.id}</span>
                  </div>
                  <div className="ticket-badges">
                    <span
                      className="status-badge"
                      style={{ borderColor: getStatusBadge(ticket.status).color }}
                    >
                      {getStatusBadge(ticket.status).icon} {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                    <span
                      className="priority-badge"
                      style={{ borderColor: getPriorityBadge(ticket.priority).color }}
                    >
                      {getPriorityBadge(ticket.priority).label}
                    </span>
                  </div>
                </div>

                <div className="ticket-details">
                  <span className="detail">📂 Category: {ticket.category}</span>
                  <span className="detail">📅 Created: {ticket.created}</span>
                  <span className="detail">💬 {ticket.messages} messages</span>
                  <span className="detail">🔄 Updated: {ticket.lastUpdated}</span>
                </div>

                <button className="btn-view-ticket">View Details →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== FAQ TAB ==================== */}
      {activeTab === 'faq' && (
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>

          <div className="faq-list">
            {faqItems.map(item => (
              <div key={item.id} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(item.id)}
                >
                  <span className="faq-icon">{expandedFAQ[item.id] ? '▼' : '▶'}</span>
                  <span>{item.question}</span>
                </button>

                {expandedFAQ[item.id] && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="faq-footer">
            <p>💡 Didn't find what you're looking for? <button className="link-btn">Contact us via chat</button></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChatPremium;
