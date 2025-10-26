import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTheme } from "../components/context/ThemeContext.jsx";
import DashboardLayout from "../components/layout/dashboardLayout.jsx";
import backgroundImage from "../assets/img/background.jpg";

// ------------------ AUTH MOCK ------------------
function useAuth() {
  const [authenticated, setAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);
  return { authenticated, loading, setAuthenticated };
}

// ------------------ DUMMY DATA ------------------
const dummyStats = {
  totalApplicants: 1234,
  totalActiveLoans: 87,
  totalOutstanding: 154000000,
  completedLoans: 45,
  recentPayments: [
    {
      _id: 1,
      applicantName: "John Okello",
      loanNumber: "LN-1023",
      _creationTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      amount: 350000,
      paymentMethod: "Mobile Money",
    },
    {
      _id: 2,
      applicantName: "Grace Namutebi",
      loanNumber: "LN-1077",
      _creationTime: new Date(Date.now() - 1000 * 60 * 60 * 10),
      amount: 600000,
      paymentMethod: "Bank Transfer",
    },
  ],
  recentLoans: [
    {
      _id: 1,
      applicantName: "Peter Ssemanda",
      loanNumber: "LN-1101",
      _creationTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      principalAmount: 1200000,
      status: "Active",
    },
    {
      _id: 2,
      applicantName: "Jane Kansiime",
      loanNumber: "LN-1102",
      _creationTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      principalAmount: 800000,
      status: "Completed",
    },
  ],
};

// ------------------ DASHBOARD CONTENT ------------------
function DashboardContent() {
  const [stats, setStats] = useState(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setStats(dummyStats), 800);
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);

  // Quick Actions Handlers
  const handleAddApplicant = () => {
    navigate('/applicants');
    // In a real app, you might want to open a modal or set state to show add form
  };

  const handleProcessLoan = () => {
    navigate('/loans');
    // Navigate to loans page where loan processing can be initiated
  };

  const handleViewReports = () => {
    navigate('/payments');
    // Using payments page as reports for now
  };

  const handleManageUsers = () => {
    navigate('/settings');
    // Navigate to settings where user management might be
  };

  if (!stats) {
    return (
      <div
        className="d-flex justify-content-center align-items-center glass-card p-5 rounded-4"
        style={{ minHeight: "60vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="main-text text-muted">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-100 py-2 p-md-4 dashboard-background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <div className="glass-card p-4 rounded-4 shadow-lg mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="fw-bold head-text text-primary mb-0">Dashboard Overview</h2>
          <div className="text-end">
            <p className="main-text text-muted mb-0">Welcome back!</p>
            <small className="small-text">Here's your financial summary</small>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 g-md-4 mb-4">
        {[
          { 
            title: "Total Applicants", 
            value: stats.totalApplicants.toLocaleString(), 
            color: "primary",
            icon: "👥",
            description: "Registered applicants",
            route: "/applicants"
          },
          { 
            title: "Active Loans", 
            value: stats.totalActiveLoans, 
            color: "success",
            icon: "📈",
            description: "Currently active",
            route: "/loans"
          },
          { 
            title: "Outstanding", 
            value: formatCurrency(stats.totalOutstanding), 
            color: "warning",
            icon: "💰",
            description: "Total outstanding balance",
            route: "/payments"
          },
          { 
            title: "Completed Loans", 
            value: stats.completedLoans, 
            color: "info",
            icon: "✅",
            description: "Successfully completed",
            route: "/loans"
          },
        ].map((item, i) => (
          <div 
            className="col-12 col-sm-6 col-lg-3" 
            key={i}
            onClick={() => navigate(item.route)}
            style={{ cursor: 'pointer' }}
          >
            <div className="glass-card p-4 rounded-4 shadow-sm h-100 border-0 hover-effect">
              <div className="d-flex align-items-center mb-3">
                <span className="fs-2 me-3">{item.icon}</span>
                <div>
                  <h6 className="fw-semibold main-text mb-1 text-muted">{item.title}</h6>
                  <h3 className={`fw-bold text-${item.color} mb-0`}>{item.value}</h3>
                </div>
              </div>
              <p className="small-text text-muted mb-0">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="row g-3 g-md-4">
        {/* Recent Payments */}
        <div className="col-12 col-lg-6">
          <div className="glass-card rounded-4 shadow-sm h-100 border-0">
            <div className="glass-header p-4 rounded-4 rounded-bottom-0 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold head-text text-primary mb-0">
                💳 Recent Payments
              </h5>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate('/payments')}
              >
                View All
              </button>
            </div>
            <div className="card-body p-4">
              <div className="overflow-auto" style={{ maxHeight: "300px" }}>
                {stats.recentPayments.map((p) => (
                  <div
                    key={p._id}
                    className="d-flex justify-content-between align-items-center border-bottom py-3"
                  >
                    <div className="d-flex align-items-center">
                      <div className={`rounded-circle bg-${p.paymentMethod === "Mobile Money" ? "success" : "primary"} d-flex align-items-center justify-content-center me-3`} 
                           style={{ width: '40px', height: '40px' }}>
                        <span className="text-white small fw-bold">
                          {p.paymentMethod === "Mobile Money" ? "M" : "B"}
                        </span>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-semibold main-text">{p.applicantName}</h6>
                        <small className="text-muted small-text">
                          {p.loanNumber} • {formatDistanceToNow(p._creationTime, { addSuffix: true })}
                        </small>
                      </div>
                    </div>
                    <div className="text-end">
                      <strong className="text-success fw-bold">{formatCurrency(p.amount)}</strong>
                      <div className="small-text text-muted">{p.paymentMethod}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Loans */}
        <div className="col-12 col-lg-6">
          <div className="glass-card rounded-4 shadow-sm h-100 border-0">
            <div className="glass-header p-4 rounded-4 rounded-bottom-0 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold head-text text-primary mb-0">
                📋 Recent Loans
              </h5>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate('/loans')}
              >
                View All
              </button>
            </div>
            <div className="card-body p-4">
              <div className="overflow-auto" style={{ maxHeight: "300px" }}>
                {stats.recentLoans.map((loan) => (
                  <div
                    key={loan._id}
                    className="d-flex justify-content-between align-items-center border-bottom py-3"
                  >
                    <div className="d-flex align-items-center">
                      <div className={`rounded-circle bg-${loan.status === "Active" ? "success" : "primary"} d-flex align-items-center justify-content-center me-3`} 
                           style={{ width: '40px', height: '40px' }}>
                        <span className="text-white small fw-bold">
                          {loan.status === "Active" ? "A" : "C"}
                        </span>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-semibold main-text">{loan.applicantName}</h6>
                        <small className="text-muted small-text">
                          {loan.loanNumber} • {formatDistanceToNow(loan._creationTime, { addSuffix: true })}
                        </small>
                      </div>
                    </div>
                    <div className="text-end">
                      <strong className="fw-bold main-text">{formatCurrency(loan.principalAmount)}</strong>
                      <span
                        className={`badge ms-2 ${loan.status === "Active" ? "bg-success" : "bg-primary"}`}
                      >
                        {loan.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4 g-3">
        <div className="col-12">
          <div className="glass-card p-4 rounded-4 shadow-sm border-0">
            <h5 className="fw-bold head-text text-primary mb-3">Quick Actions</h5>
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <button 
                  className="btn btn-berry w-100 py-3 fw-semibold border-0 rounded-3"
                  onClick={handleAddApplicant}
                >
                  👥 Add Applicant
                </button>
              </div>
              <div className="col-6 col-md-3">
                <button 
                  className="btn btn-outline-primary w-100 py-3 fw-semibold rounded-3"
                  onClick={handleProcessLoan}
                >
                  📋 Process Loan
                </button>
              </div>
              <div className="col-6 col-md-3">
                <button 
                  className="btn btn-outline-primary w-100 py-3 fw-semibold rounded-3"
                  onClick={handleViewReports}
                >
                  📊 View Payments
                </button>
              </div>
              <div className="col-6 col-md-3">
                <button 
                  className="btn btn-outline-primary w-100 py-3 fw-semibold rounded-3"
                  onClick={handleManageUsers}
                >
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------ SIGN IN SCREEN ------------------
function SignInScreen({ onSignIn }) {
  const navigate = useNavigate();

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100 signin-background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="glass-card p-5 rounded-4 shadow-lg">
              <div className="text-center mb-4">
                <h2 className="fw-bold head-text text-primary mb-2">Welcome Back</h2>
                <p className="main-text text-muted">Sign in to your account</p>
              </div>
              
              <button 
                className="btn btn-berry w-100 py-3 fw-semibold border-0 rounded-3 mb-4"
                onClick={onSignIn}
                style={{
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                Sign In to Dashboard
              </button>
              
              <div className="text-center">
                <p className="main-text mb-0 small">
                  Don't have an account?{" "}
                  <button 
                    className="btn btn-link text-primary fw-semibold p-0 text-decoration-none"
                    onClick={() => navigate('/signup')}
                  >
                    Create one
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------ MAIN EXPORT ------------------
export default function Index() {
  const { authenticated, loading, setAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center dashboard-background">
        <div className="glass-card p-5 rounded-4 text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="main-text text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <SignInScreen onSignIn={() => setAuthenticated(true)} />;
  }

  return (
    <div className="w-100">
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </div>
  );
}