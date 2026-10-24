import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, Zap } from 'lucide-react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [notifications, setNotifications] = useState([]);

  const addToast = ({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res && res.content) {
        setNotifications(res.content);
      }
      const countRes = await api.getUnreadCount();
      if (countRes && typeof countRes.unreadCount === 'number') {
        setUnreadCount(countRes.unreadCount);
      }
    } catch (e) {
      // ignore
    }
  };

  const markAllRead = async () => {
    try {
      await api.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        unreadCount,
        notifications,
        loadNotifications,
        markAllRead
      }}
    >
      {children}

      {/* Floating Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => {
          let IconComponent = Info;
          let iconColor = '#60a5fa';
          let borderStyle = '1px solid rgba(96, 165, 250, 0.3)';

          if (toast.type === 'success') {
            IconComponent = CheckCircle2;
            iconColor = '#34d399';
            borderStyle = '1px solid rgba(52, 211, 153, 0.4)';
          } else if (toast.type === 'warning' || toast.type === 'anti-snipe') {
            IconComponent = AlertTriangle;
            iconColor = '#fbbf24';
            borderStyle = '1px solid rgba(251, 191, 36, 0.4)';
          } else if (toast.type === 'error' || toast.type === 'outbid') {
            IconComponent = AlertCircle;
            iconColor = '#f87171';
            borderStyle = '1px solid rgba(248, 113, 113, 0.4)';
          }

          return (
            <div
              key={toast.id}
              className="toast glass-panel"
              style={{ border: borderStyle }}
            >
              <div style={{ color: iconColor, marginTop: 2 }}>
                <IconComponent size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>
                  {toast.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {toast.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
