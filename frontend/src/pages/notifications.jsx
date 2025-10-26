import { useState } from "react";
import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { Container, Row, Col, Button } from "react-bootstrap";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import backgroundImage from "../assets/img/background.jpg";

// Dummy notifications data
const initialNotifications = [
  {
    id: 1,
    type: "success",
    title: "Loan Approved",
    message: "Loan LN-2024-001 for John Okello has been approved",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false
  },
  {
    id: 2,
    type: "warning",
    title: "Payment Due",
    message: "Payment for loan LN-2024-003 is due in 3 days",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false
  },
  {
    id: 3,
    type: "info",
    title: "New Applicant",
    message: "Sarah Nansubuga has submitted a new loan application",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true
  },
  {
    id: 4,
    type: "success",
    title: "Payment Received",
    message: "Payment of UGX 350,000 received from Grace Namutebi",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true
  },
  {
    id: 5,
    type: "warning",
    title: "Low Balance",
    message: "Sacco account balance is running low",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    read: true
  }
];

function NotificationsContent() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

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
    <div 
      className="w-100 p-2 p-md-4 dashboard-background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        overflow: 'hidden' // Prevent page scrolling
      }}
    >
      <Container fluid className="px-2 px-md-3 h-100">
        {/* Header - Fixed height */}
        <div className="glass-card p-3 p-md-4 rounded-4 shadow-lg mb-3 mb-md-4" style={{ flexShrink: 0 }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 gap-md-0">
            <div className="flex-grow-1">
              <h2 className="fw-bold head-text text-primary mb-1 fs-4 fs-md-3 d-flex align-items-center">
                <Bell size={24} className="me-2" />
                Notifications
              </h2>
              <p className="main-text text-muted mb-0">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </p>
            </div>
            
            <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
              <select 
                className="form-select font-regular glass-input"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ minWidth: '150px' }}
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
              
              {unreadCount > 0 && (
                <Button 
                  variant="berry" 
                  className="font-medium border-0"
                  onClick={markAllAsRead}
                  size="sm"
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List - Flexible height, no scrollbars */}
        <div 
          className="glass-card rounded-4 shadow-lg border-0 d-flex flex-column"
          style={{ 
            height: 'calc(100vh - 200px)',
            overflow: 'hidden'
          }}
        >
          <div className="glass-header p-3 p-md-4 rounded-4 rounded-bottom-0" style={{ flexShrink: 0 }}>
            <h5 className="card-title head-text font-medium mb-0 fs-6">🔔 Recent Notifications</h5>
          </div>
          
          <div 
            className="card-body p-2 p-md-3 flex-grow-1"
            style={{ 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {filteredNotifications.length === 0 ? (
              <div 
                className="text-center d-flex flex-column justify-content-center align-items-center h-100"
                style={{ minHeight: '200px' }}
              >
                <Bell size={40} className="text-muted mb-3" />
                <h4 className="head-text font-medium text-muted fs-5">No notifications</h4>
                <p className="small-text">
                  {filter === "all" 
                    ? "You're all caught up!" 
                    : `No ${filter} notifications`}
                </p>
              </div>
            ) : (
              <div 
                className="h-100"
                style={{ 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Notifications container with hidden scrollbar */}
                <div 
                  className="flex-grow-1"
                  style={{ 
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <div 
                    className="h-100"
                    style={{ 
                      overflowY: 'auto',
                      overflowX: 'hidden',
                      // Hide scrollbar for all browsers
                      scrollbarWidth: 'none', // Firefox
                      msOverflowStyle: 'none', // IE and Edge
                    }}
                  >
                    {/* Webkit scrollbar hide */}
                    <style>
                      {`
                        .hide-scrollbar::-webkit-scrollbar {
                          display: none;
                        }
                      `}
                    </style>
                    <div className="hide-scrollbar space-y-2 space-y-md-2">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`glass-card p-3 rounded-4 border-0 ${
                            !notification.read ? "border-start border-3 border-primary" : ""
                          }`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => !notification.read && markAsRead(notification.id)}
                        >
                          <div className="d-flex align-items-start gap-2 gap-md-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-grow-1 min-width-0">
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <h6 className="font-medium head-text mb-0 fs-6 d-flex align-items-center">
                                  <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                    {notification.title}
                                  </span>
                                  {!notification.read && (
                                    <span className="badge bg-primary ms-2" style={{ fontSize: '0.6rem' }}>New</span>
                                  )}
                                </h6>
                                <small className="small-text text-muted flex-shrink-0 ms-2" style={{ fontSize: '0.75rem' }}>
                                  {formatTime(notification.timestamp)}
                                </small>
                              </div>
                              <p className="font-regular mb-0 main-text small" style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                                {notification.message}
                              </p>
                            </div>
                            
                            <button
                              className="btn btn-sm btn-outline-secondary flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              style={{ padding: '4px 8px' }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Status bar showing number of notifications */}
                <div 
                  className="text-center py-2 border-top mt-2"
                  style={{ 
                    flexShrink: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0 0 1rem 1rem'
                  }}
                >
                  <small className="text-muted">
                    Showing {filteredNotifications.length} of {notifications.length} notifications
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
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