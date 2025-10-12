import { useState } from "react";
import { Plus, CreditCard, Calendar, User, CheckCircle } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

// Dummy payments data
const initialPayments = [
  {
    id: 1,
    loanNumber: "LN-2024-001",
    applicantName: "John Okello",
    amount: 879159,
    paymentDate: new Date('2024-03-01'),
    dueDate: new Date('2024-03-01'),
    status: "completed",
    paymentMethod: "Mobile Money",
    reference: "MM123456789"
  },
  {
    id: 2,
    loanNumber: "LN-2024-002",
    applicantName: "Sarah Nansubuga",
    amount: 869882,
    paymentDate: new Date('2024-03-01'),
    dueDate: new Date('2024-03-01'),
    status: "completed",
    paymentMethod: "Bank Transfer",
    reference: "BT987654321"
  },
  {
    id: 3,
    loanNumber: "LN-2024-003",
    applicantName: "Peter Ssemanda",
    amount: 706643,
    paymentDate: null,
    dueDate: new Date('2024-03-05'),
    status: "pending",
    paymentMethod: "",
    reference: ""
  },
  {
    id: 4,
    loanNumber: "LN-2024-001",
    applicantName: "John Okello",
    amount: 879159,
    paymentDate: new Date('2024-02-01'),
    dueDate: new Date('2024-02-01'),
    status: "completed",
    paymentMethod: "Mobile Money",
    reference: "MM123456788"
  }
];

const dummyLoans = [
  {
    _id: "1",
    loanNumber: "LN-2024-001",
    applicantName: "John Okello",
    monthlyPayment: 879159,
    balance: 8791590
  },
  {
    _id: "2",
    loanNumber: "LN-2024-002",
    applicantName: "Sarah Nansubuga",
    monthlyPayment: 869882,
    balance: 4349410
  },
  {
    _id: "3",
    loanNumber: "LN-2024-003",
    applicantName: "Peter Ssemanda",
    monthlyPayment: 706643,
    balance: 16959432
  }
];

function PaymentsContent() {
  const [payments, setPayments] = useState(initialPayments);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filter, setFilter] = useState("all"); // all, completed, pending

  const [paymentForm, setPaymentForm] = useState({
    loanId: "",
    amount: "",
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: "mobile_money",
    reference: ""
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "Not paid";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      completed: { class: "bg-success text-white", label: "Completed" },
      pending: { class: "bg-warning text-dark", label: "Pending" }
    };
    
    const { class: badgeClass, label } = config[status] || config.pending;
    
    return (
      <span className={`badge ${badgeClass} font-medium`}>
        {status === "completed" && <CheckCircle size={12} className="me-1" />}
        {label}
      </span>
    );
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Find the selected loan
    const selectedLoan = dummyLoans.find(loan => loan._id === paymentForm.loanId);
    
    const newPayment = {
      id: Date.now(),
      loanNumber: selectedLoan.loanNumber,
      applicantName: selectedLoan.applicantName,
      amount: parseFloat(paymentForm.amount),
      paymentDate: new Date(paymentForm.paymentDate),
      dueDate: new Date(), // In real app, this would be calculated
      status: "completed",
      paymentMethod: paymentForm.paymentMethod === "mobile_money" ? "Mobile Money" : "Bank Transfer",
      reference: paymentForm.reference
    };

    setPayments(prev => [newPayment, ...prev]);
    setShowPaymentModal(false);
    setPaymentForm({
      loanId: "",
      amount: "",
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: "mobile_money",
      reference: ""
    });

    alert("Payment recorded successfully!");
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === "completed") return payment.status === "completed";
    if (filter === "pending") return payment.status === "pending";
    return true;
  });

  const totalReceived = payments
    .filter(p => p.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingPayments = payments.filter(p => p.status === "pending");

  return (
    <div className="container-fluid py-3 px-3 px-md-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="head-text font-medium mb-1">Payments</h2>
          <p className="small-text">Manage loan payments and transactions</p>
        </div>
        
        <button 
          className="btn btn-primary d-flex align-items-center gap-2 font-medium"
          onClick={() => setShowPaymentModal(true)}
        >
          <Plus size={20} />
          Record Payment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-success shadow-sm">
            <div className="card-body text-center">
              <CreditCard size={24} className="text-success mb-2" />
              <h6 className="small-text">Total Received</h6>
              <h4 className="head-text font-medium text-success">
                {formatCurrency(totalReceived)}
              </h4>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border-primary shadow-sm">
            <div className="card-body text-center">
              <Calendar size={24} className="text-primary mb-2" />
              <h6 className="small-text">Total Payments</h6>
              <h4 className="head-text font-medium text-primary">
                {payments.filter(p => p.status === "completed").length}
              </h4>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border-warning shadow-sm">
            <div className="card-body text-center">
              <User size={24} className="text-warning mb-2" />
              <h6 className="small-text">Pending Payments</h6>
              <h4 className="head-text font-medium text-warning">
                {pendingPayments.length}
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="card-title head-text font-medium mb-0">Payment History</h5>
              
              <select 
                className="form-select font-regular"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">All Payments</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div className="card-body p-0">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-5">
                  <CreditCard size={48} className="text-muted mb-3" />
                  <h4 className="head-text font-medium text-muted">No payments</h4>
                  <p className="small-text mb-3">
                    {filter === "all" 
                      ? "No payments have been recorded yet" 
                      : `No ${filter} payments`}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="font-medium">Loan</th>
                        <th className="font-medium">Applicant</th>
                        <th className="font-medium text-end">Amount</th>
                        <th className="font-medium">Due Date</th>
                        <th className="font-medium">Payment Date</th>
                        <th className="font-medium">Method</th>
                        <th className="font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="font-regular">{payment.loanNumber}</td>
                          <td className="font-regular">{payment.applicantName}</td>
                          <td className="font-regular text-end">{formatCurrency(payment.amount)}</td>
                          <td className="font-regular">{formatDate(payment.dueDate)}</td>
                          <td className="font-regular">{formatDate(payment.paymentDate)}</td>
                          <td className="font-regular">{payment.paymentMethod}</td>
                          <td>{getStatusBadge(payment.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title head-text font-medium">Record Payment</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              
              <form onSubmit={handlePaymentSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label font-medium">Select Loan</label>
                        <select
                          className="form-select font-regular"
                          value={paymentForm.loanId}
                          onChange={(e) => {
                            const loanId = e.target.value;
                            setPaymentForm(prev => ({ 
                              ...prev, 
                              loanId,
                              amount: loanId ? dummyLoans.find(l => l._id === loanId)?.monthlyPayment.toString() || "" : ""
                            }));
                          }}
                          required
                        >
                          <option value="">Choose loan...</option>
                          {dummyLoans.map((loan) => (
                            <option key={loan._id} value={loan._id}>
                              {loan.loanNumber} - {loan.applicantName} (Balance: {formatCurrency(loan.balance)})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label font-medium">Amount (UGX)</label>
                        <input
                          type="number"
                          className="form-control font-regular"
                          value={paymentForm.amount}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label font-medium">Payment Date</label>
                        <input
                          type="date"
                          className="form-control font-regular"
                          value={paymentForm.paymentDate}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label font-medium">Payment Method</label>
                        <select
                          className="form-select font-regular"
                          value={paymentForm.paymentMethod}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          required
                        >
                          <option value="mobile_money">Mobile Money</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="cash">Cash</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="col-12">
                      <div className="form-group">
                        <label className="form-label font-medium">Reference Number</label>
                        <input
                          type="text"
                          className="form-control font-regular"
                          placeholder="Enter transaction reference"
                          value={paymentForm.reference}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, reference: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary font-medium" 
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary font-medium"
                  >
                    Record Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Payments() {
  return (
    <DashboardLayout>
      <PaymentsContent />
    </DashboardLayout>
  );
}