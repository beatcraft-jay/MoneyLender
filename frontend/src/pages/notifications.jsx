import { useState } from "react";
import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

// Dummy notifications data
const initialNotifications = [
  {
    id: 1,
    type: "success",
    title: "Loan Approved",
    message: "Loan LN-2024-001 for John Okello has been approved",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false
  },
  {
    id: 2,
    type: "warning",
    title: "Payment Due",
    message: "Payment for loan LN-2024-003 is due in 3 days",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false
  },
  {
    id: 3,
    type: "info",
    title: "New Applicant",
    message: "Sarah Nansubuga has submitted a new loan application",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true
  },
  {
    id: 4,
    type: "success",
    title: "Payment Received",
    message: "Payment of UGX 350,000 received from Grace Namutebi",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true
  },
  {
    id: 5,
    type: "warning",
    title: "Low Balance",
    message: "Sacco account balance is running low",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true
  }
];

function NotificationsContent() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all"); // all, unread, read

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-success" />;
      case "warning":
        return <AlertTriangle size={20} className="text-warning" />;
      case "info":
        return <Info size={20} className="text-info" />;
      default:
        return <Bell size={20} className="text-primary" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container-fluid py-3 px-3 px-md-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="head-text font-medium mb-1">Notifications</h2>
          <p className="small-text">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        
        <div className="d-flex gap-2">
          <select 
            className="form-select font-regular"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          
          {unreadCount > 0 && (
            <button 
              className="btn btn-outline-primary font-medium"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body p-0">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-5">
                  <Bell size={48} className="text-muted mb-3" />
                  <h4 className="head-text font-medium text-muted">No notifications</h4>
                  <p className="small-text">
                    {filter === "all" 
                      ? "You're all caught up!" 
                      : `No ${filter} notifications`}
                  </p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`list-group-item list-group-item-action ${
                        !notification.read ? "bg-light" : ""
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="font-medium mb-1">
                              {notification.title}
                              {!notification.read && (
                                <span className="badge bg-primary ms-2">New</span>
                              )}
                            </h6>
                            <small className="small-text">
                              {formatTime(notification.timestamp)}
                            </small>
                          </div>
                          <p className="font-regular mb-1">
                            {notification.message}
                          </p>
                        </div>
                        
                        <button
                          className="btn btn-sm btn-outline-secondary flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Notifications() {
  return (
    <DashboardLayout>
      <NotificationsContent />
    </DashboardLayout>
  );
}