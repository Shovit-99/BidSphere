import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
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
          let iconColor = '#3b82f6';
          let borderColor = '#bfdbfe';

          if (toast.type === 'success') {
            IconComponent = CheckCircle2;
            iconColor = '#10b981';
            borderColor = '#a7f3d0';
          } else if (toast.type === 'warning' || toast.type === 'anti-snipe') {
            IconComponent = AlertTriangle;
            iconColor = '#f59e0b';
            borderColor = '#fde68a';
          } else if (toast.type === 'error' || toast.type === 'outbid') {
            IconComponent = AlertCircle;
            iconColor = '#ef4444';
            borderColor = '#fecaca';
          }

          return (
            <div
              key={toast.id}
              className="toast"
              style={{ borderLeftWidth: 3, borderLeftColor: iconColor }}
            >
              <div style={{ color: iconColor, marginTop: 2, flexShrink: 0 }}>
                <IconComponent size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 2, color: '#0f172a' }}>
                  {toast.title}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
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
