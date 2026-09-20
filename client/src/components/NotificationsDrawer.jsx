import React, { useEffect, useState } from 'react';
import { notificationAPI } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  X, 
  CheckCheck, 
  CreditCard, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  Clock,
  ChevronRight
} from 'lucide-react';

export const NotificationsDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationAPI.getNotifications();
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (id, actionUrl) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (actionUrl) {
        onClose();
        navigate(actionUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'DBT_CREDIT':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'DEFICIENCY':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'SECURITY':
        return <ShieldCheck className="w-4 h-4 text-gov-blue" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gov-blue" />
            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.2 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-gov-blue hover:underline font-semibold flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Loading alerts...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <Bell className="w-10 h-10 text-slate-200 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No Notifications</p>
              <p className="text-[11px] text-slate-400">You're all caught up with MoTA scheme updates!</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleMarkAsRead(n._id, n.actionUrl)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                  n.isRead
                    ? 'bg-white border-slate-200 hover:bg-slate-50'
                    : 'bg-amber-50/40 border-amber-300 shadow-sm hover:bg-amber-50'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-100 flex-shrink-0 mt-0.5">
                  {getTypeIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                    {n.actionUrl && (
                      <span className="text-gov-blue font-bold flex items-center gap-0.5">
                        <span>View</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center text-[10px] text-slate-400">
          MoTA Multi-Channel Notification Dispatcher (In-App • SMS • Push)
        </div>
      </div>
    </div>
  );
};
