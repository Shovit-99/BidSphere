import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Clock, AlertTriangle, Trophy, Info } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { INITIAL_NOTIFICATIONS } from '../../services/mockData';

export default function NotificationsPage() {
  const { addToast } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifs = async () => {
    try {
      const res = await api.getNotifications();
      if (res && res.content && res.content.length > 0) {
        setNotifications(res.content);
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } catch (e) {
      setNotifications(INITIAL_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (e) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      addToast({ type: 'info', title: 'Notifications Cleared', message: 'All marked as read.' });
    } catch (e) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const getIcon = (type) => {
    if (type === 'OUTBID') return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    if (type === 'WON' || type === 'AUCTION_WON') return <Trophy className="w-4 h-4 text-amber-500" />;
    return <Info className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time auction activity alerts, outbid warnings, and escrow confirmations.
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs self-start cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-navy-900 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Retrieving notification feed...</p>
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You're completely up to date. Activity alerts and outbid notices will appear here."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n.id)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition cursor-pointer ${
                !n.isRead ? 'bg-amber-50/20 hover:bg-amber-50/40' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs sm:text-sm ${!n.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                    {new Date(n.createdAt || Date.now()).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(n.id);
                }}
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Dismiss"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
