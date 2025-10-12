import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bell, User } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

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

  useEffect(() => {
    setTimeout(() => setStats(dummyStats), 800);
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);

  if (!stats) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="w-100">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="head-text font-medium">Dashboard Overview</h2>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 g-md-4 mb-4">
        {[
          { title: "Total Applicants", value: stats.totalApplicants, color: "primary" },
          { title: "Active Loans", value: stats.totalActiveLoans, color: "success" },
          { title: "Outstanding", value: formatCurrency(stats.totalOutstanding), color: "warning" },
          { title: "Completed Loans", value: stats.completedLoans, color: "info" },
        ].map((item, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className={`card border-${item.color} shadow-sm h-100`}>
              <div className="card-body text-center">
                <h6 className="small-text">{item.title}</h6>
                <h3 className="head-text font-medium">{item.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="row g-3 g-md-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header font-medium bg-light">Recent Payments</div>
            <div className="card-body overflow-auto">
              {stats.recentPayments.map((p) => (
                <div key={p._id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                  <div>
                    <h6 className="mb-0 font-medium">{p.applicantName}</h6>
                    <small className="small-text">
                      {p.loanNumber} • {formatDistanceToNow(p._creationTime, { addSuffix: true })}
                    </small>
                  </div>
                  <div className="text-end">
                    <strong className="font-medium">{formatCurrency(p.amount)}</strong>
                    <div className="small-text">{p.paymentMethod}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header font-medium bg-light">Recent Loans</div>
            <div className="card-body overflow-auto">
              {stats.recentLoans.map((loan) => (
                <div key={loan._id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                  <div>
                    <h6 className="mb-0 font-medium">{loan.applicantName}</h6>
                    <small className="small-text">
                      {loan.loanNumber} • {formatDistanceToNow(loan._creationTime, { addSuffix: true })}
                    </small>
                  </div>
                  <div className="text-end">
                    <strong className="font-medium">{formatCurrency(loan.principalAmount)}</strong>
                    <span
                      className={`badge ms-2 font-medium ${
                        loan.status === "Active" ? "bg-success" : "bg-primary"
                      }`}
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
  );
}

// ------------------ SIGN IN ------------------
function SignInScreen({ onSignIn }) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center vh-100"
      style={{ background: "linear-gradient(135deg, #e8f0ff, #ffffff)" }}
    >
      <div className="card shadow-lg p-4 text-center" style={{ width: "22rem" }}>
        <h3 className="head-text font-medium text-primary mb-3">Julio Financial Solutions</h3>
        <p className="small-text mb-4">Loan Management System</p>
        <button className="btn btn-primary w-100 font-medium" onClick={onSignIn}>
          Sign In
        </button>
      </div>
    </div>
  );
}

// ------------------ MAIN COMPONENT ------------------
export default function Index() {
  const { authenticated, loading, setAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"></div>
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