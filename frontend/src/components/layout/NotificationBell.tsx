import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

interface Notification {
  _id: string;
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    api.get("/notifications").then((res) => setNotifications(res.data.data.notifications));
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function markRead(n: Notification) {
    if (!n.isRead) {
      await api.put(`/notifications/${n._id}/read`);
      setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)));
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-sand-100"
        aria-label="Notifications"
      >
        <Bell size={18} className="text-ink-400" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-clay-500 text-[10px] font-medium text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 rounded-lg border border-sand-200 bg-white shadow-card">
          <p className="border-b border-sand-200 p-3 text-sm font-medium">Notifications</p>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-ink-300">Aucune notification.</p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  to={n.link || "#"}
                  onClick={() => markRead(n)}
                  className={`block border-b border-sand-100 p-3 text-sm hover:bg-sand-50 ${
                    !n.isRead ? "bg-lagoon-50/50" : ""
                  }`}
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="text-xs text-ink-300">{n.body}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
