// src/components/layout/DashboardLayout.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Users,
  FileText,
  DollarSign,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sun,
  Moon,
  User as UserIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { useTheme } from "../context/ThemeContext.jsx"; 

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Applicants", href: "/applicants", icon: Users },
  { name: "Loans", href: "/loans", icon: DollarSign },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Agreements", href: "/agreements", icon: FileText },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

const mockNotifications = [
  { id: 1, message: "New loan application received", time: "5 min ago", read: false },
  { id: 2, message: "Payment received from John Doe", time: "1 hour ago", read: false },
  { id: 3, message: "Loan agreement expiring soon", time: "2 hours ago", read: true },
  { id: 4, message: "System maintenance scheduled", time: "1 day ago", read: true },
];

let logo = null;
try {
  logo = new URL("../../assets/img/logo.png", import.meta.url).href;
} catch {
  console.log("Logo not found, using fallback");
}

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => (window.location.href = "/signin");
  const handleLogoClick = () => navigate("/dashboard");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const renderLogo = (size = "60px", clickable = false) => {
    const logoElement = logo ? (
      <img
        src={logo}
        alt="Julio Financial Services"
        style={{ 
          height: size, 
          width: "auto", 
          objectFit: "contain",
          cursor: clickable ? "pointer" : "default"
        }}
        className="mb-2"
      />
    ) : (
      <div
        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-2"
        style={{ 
          width: size, 
          height: size,
          cursor: clickable ? "pointer" : "default"
        }}
      >
        <DollarSign size={parseInt(size) * 0.5} />
      </div>
    );

    return clickable ? (
      <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
        {logoElement}
      </div>
    ) : (
      logoElement
    );
  };

  return (
    <div
      className={`d-flex flex-column min-vh-100 ${
        theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <aside
          className={`bg-dark text-white p-3 position-fixed h-100 d-flex flex-column justify-content-between ${
            mobileOpen ? "d-block" : "d-none d-md-flex"
          }`}
          style={{
            width: 250,
            zIndex: 1050,
            top: 0,
            bottom: 0,
            overflowY: "auto",
          }}
        >
          {/* Top Section */}
          <div>
            <div className="d-flex flex-column align-items-center text-center mb-4 position-relative">
              <Button
                variant="outline-light"
                size="sm"
                className="d-md-none position-absolute top-0 end-0"
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </Button>

              {renderLogo("40px", true)}
              <h5 className="fw-bold mb-0 text-white">Julio Financial Services</h5>
              <small className="text-muted">Loan Management System</small>
            </div>

            <nav className="flex-grow-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`d-flex align-items-center gap-2 mb-3 text-decoration-none ${
                    location.pathname === item.href
                      ? "text-info fw-semibold"
                      : "text-light"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sticky Logout Button */}
          <div className="pt-3 border-top mt-auto">
            <Button
              variant="outline-light"
              size="sm"
              className="w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleLogout}
              style={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(4px)",
              }}
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main
          className="flex-grow-1 d-flex flex-column"
          style={{
            marginLeft: isDesktop ? "250px" : "0",
            transition: "margin-left 0.3s",
            width: isDesktop ? "calc(100% - 250px)" : "100%",
          }}
        >
          {/* Top Navbar */}
          <nav
            className={`navbar navbar-expand-lg shadow-sm px-3 px-md-4 py-2 ${
              theme === "dark" ? "bg-secondary text-light" : "bg-white text-dark"
            }`}
            style={{ position: "sticky", top: 0, zIndex: 1040 }}
          >
            <div className="container-fluid d-flex justify-content-between align-items-center px-0">
              {/* Desktop View */}
              <div className="d-none d-md-flex align-items-center">
                <h5 className="fw-bold mb-0">
                  {location.pathname === "/dashboard" && "Dashboard"}
                  {location.pathname === "/applicants" && "Applicants Management"}
                  {location.pathname === "/loans" && "Loans Management"}
                  {location.pathname === "/payments" && "Payments"}
                  {location.pathname === "/agreements" && "Agreements"}
                  {location.pathname === "/notifications" && "Notifications"}
                  {location.pathname === "/settings" && "Settings"}
                </h5>
              </div>

              {/* Mobile View */}
              <div className="d-md-none w-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  {/* Menu Button - Visible in both light and dark modes */}
                  <Button
                    variant={theme === "dark" ? "outline-light" : "outline-dark"}
                    size="sm"
                    className="p-2"
                    style={{ width: "40px", height: "40px" }}
                    onClick={() => setMobileOpen(true)}
                  >
                    <Menu size={20} />
                  </Button>
                  
                  {/* Centered Clickable Logo */}
                  <div 
                    className="d-flex align-items-center justify-content-center flex-grow-1"
                    onClick={handleLogoClick}
                    style={{ cursor: "pointer" }}
                  >
                    {renderLogo("32px", false)}
                  </div>

                  {/* Empty div for balance - same width as menu button */}
                  <div style={{ width: "40px", height: "40px" }}></div>
                </div>

                {/* Centered Action Buttons - Now including admin image */}
                <div className="d-flex justify-content-center align-items-center gap-3">
                  {/* Notifications Bell in Circle */}
                  <Dropdown show={showNotifications} onToggle={setShowNotifications}>
                    <Dropdown.Toggle
                      variant={theme === "dark" ? "outline-light" : "outline-secondary"}
                      size="sm"
                      className="rounded-circle position-relative p-2"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <Bell size={16} />
                      {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      align="end"
                      style={{ minWidth: "320px", maxHeight: "400px", overflowY: "auto" }}
                    >
                      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <h6 className="mb-0 fw-bold">Notifications</h6>
                        {unreadCount > 0 && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-primary"
                            onClick={markAllAsRead}
                          >
                            Mark all as read
                          </Button>
                        )}
                      </div>

                      {notifications.length === 0 ? (
                        <div className="p-3 text-center text-muted">No notifications</div>
                      ) : (
                        notifications.map((n) => (
                          <Dropdown.Item
                            key={n.id}
                            className={`p-3 border-bottom ${n.read ? "" : "bg-light"}`}
                            onClick={() => markAsRead(n.id)}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <p className="mb-1 small">{n.message}</p>
                                <small className="text-muted">{n.time}</small>
                              </div>
                              {!n.read && <span className="badge bg-primary ms-2">New</span>}
                            </div>
                          </Dropdown.Item>
                        ))
                      )}

                      <div className="p-2 border-top">
                        <Link
                          to="/notifications"
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={() => setShowNotifications(false)}
                        >
                          View All Notifications
                        </Link>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* Theme Toggle */}
                  <Button
                    variant={theme === "dark" ? "outline-light" : "outline-dark"}
                    size="sm"
                    className="rounded-circle p-2"
                    style={{ width: "40px", height: "40px" }}
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  </Button>

                  {/* Admin Image - Same size as other buttons */}
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center ${
                      theme === "dark" ? "bg-primary" : "bg-primary"
                    }`}
                    style={{ 
                      width: "40px", 
                      height: "40px",
                      cursor: "pointer"
                    }}
                  >
                    <UserIcon size={18} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Desktop Action Buttons */}
              <div className="d-none d-md-flex align-items-center gap-3">
                {/* Notifications Bell in Circle */}
                <Dropdown show={showNotifications} onToggle={setShowNotifications}>
                  <Dropdown.Toggle
                    variant={theme === "dark" ? "outline-light" : "outline-secondary"}
                    size="sm"
                    className="rounded-circle position-relative p-2"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    align="end"
                    style={{ minWidth: "320px", maxHeight: "400px", overflowY: "auto" }}
                  >
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                      <h6 className="mb-0 fw-bold">Notifications</h6>
                      {unreadCount > 0 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-primary"
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </Button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="p-3 text-center text-muted">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          className={`p-3 border-bottom ${n.read ? "" : "bg-light"}`}
                          onClick={() => markAsRead(n.id)}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <p className="mb-1 small">{n.message}</p>
                              <small className="text-muted">{n.time}</small>
                            </div>
                            {!n.read && <span className="badge bg-primary ms-2">New</span>}
                          </div>
                        </Dropdown.Item>
                      ))
                    )}

                    <div className="p-2 border-top">
                      <Link
                        to="/notifications"
                        className="btn btn-outline-primary btn-sm w-100"
                        onClick={() => setShowNotifications(false)}
                      >
                        View All Notifications
                      </Link>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>

                <Button
                  variant={theme === "dark" ? "outline-light" : "outline-dark"}
                  size="sm"
                  className="rounded-circle p-2"
                  style={{ width: "40px", height: "40px" }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </Button>

                {/* Admin Image - Same size as other buttons in desktop */}
                <div className="d-flex align-items-center gap-2 ms-2">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <UserIcon size={18} />
                  </div>
                  <span className="d-none d-lg-inline small">Admin</span>
                </div>
              </div>
            </div>
          </nav>

          {/* Page Content */}
          <div
            className="flex-grow-1 overflow-auto"
            style={{ height: "calc(100vh - 70px)"}}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}