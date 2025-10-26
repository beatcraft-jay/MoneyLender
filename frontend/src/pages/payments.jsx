import { useState } from "react";
import { Plus, CreditCard, Calendar, User, CheckCircle } from "lucide-react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import backgroundImage from "../assets/img/background.jpg";

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
  const [filter, setFilter] = useState("all");

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
      <span className={`badge ${badgeClass} font-medium`} style={{ fontSize: '0.7rem' }}>
        {status === "completed" && <CheckCircle size={10} className="me-1" />}
        <span className="d-none d-sm-inline">{label}</span>
        <span className="d-sm-none">{status === "completed" ? "Paid" : "Due"}</span>
      </span>
    );
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    const selectedLoan = dummyLoans.find(loan => loan._id === paymentForm.loanId);
    
    const newPayment = {
      id: Date.now(),
      loanNumber: selectedLoan.loanNumber,
      applicantName: selectedLoan.applicantName,
      amount: parseFloat(paymentForm.amount),
      paymentDate: new Date(paymentForm.paymentDate),
      dueDate: new Date(),
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
    <div 
      className="w-100 p-2 p-md-4 dashboard-background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      <Container fluid className="px-2 px-md-3">
        {/* Header */}
        <div className="glass-card p-3 p-md-4 rounded-4 shadow-lg mb-3 mb-md-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1 me-3">
              <h2 className="fw-bold head-text text-primary mb-1 fs-4 fs-md-3">Payments</h2>
              <p className="main-text text-muted mb-0 d-none d-md-block">Manage loan payments and transactions</p>
              <p className="main-text text-muted mb-0 d-md-none small">Manage payments & transactions</p>
            </div>
            
            {/* Responsive Add Button */}
            <Button 
              variant="berry" 
              className="d-flex align-items-center font-medium border-0"
              onClick={() => setShowPaymentModal(true)}
              size="lg"
            >
              {/* Show only plus icon on mobile, full text on desktop */}
              <Plus className="d-none d-md-block" size={20} />
              <Plus className="d-md-none" size={16} />
              <span className="d-none d-md-inline ms-2">Record Payment</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <Row className="g-2 g-md-3 mb-3 mb-md-4">
          <Col xs={4}>
            <div className="glass-card text-center p-2 p-md-4 rounded-4 border-0">
              <CreditCard size={20} className="text-success mb-1 mb-md-2" />
              <h6 className="small-text" style={{ fontSize: '0.75rem' }}>Total Received</h6>
              <h4 className="head-text font-medium text-success fs-6 fs-md-4">
                {formatCurrency(totalReceived).replace('UGX', '')}
              </h4>
            </div>
          </Col>
          
          <Col xs={4}>
            <div className="glass-card text-center p-2 p-md-4 rounded-4 border-0">
              <Calendar size={20} className="text-primary mb-1 mb-md-2" />
              <h6 className="small-text" style={{ fontSize: '0.75rem' }}>Total Payments</h6>
              <h4 className="head-text font-medium text-primary fs-6 fs-md-4">
                {payments.filter(p => p.status === "completed").length}
              </h4>
            </div>
          </Col>
          
          <Col xs={4}>
            <div className="glass-card text-center p-2 p-md-4 rounded-4 border-0">
              <User size={20} className="text-warning mb-1 mb-md-2" />
              <h6 className="small-text" style={{ fontSize: '0.75rem' }}>Pending</h6>
              <h4 className="head-text font-medium text-warning fs-6 fs-md-4">
                {pendingPayments.length}
              </h4>
            </div>
          </Col>
        </Row>

        {/* Payment History */}
        <div className="glass-card rounded-4 shadow-lg border-0">
          <div className="glass-header p-3 p-md-4 rounded-4 rounded-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <h5 className="card-title head-text font-medium mb-2 mb-md-0 fs-6">💳 Payment History</h5>
            
            <select 
              className="form-select font-regular glass-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: 'auto', fontSize: '0.875rem' }}
            >
              <option value="all">All Payments</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div className="card-body p-2 p-md-4">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-4 py-md-5">
                <CreditCard size={40} className="text-muted mb-3" />
                <h4 className="head-text font-medium text-muted fs-5">No payments</h4>
                <p className="small-text mb-3">
                  {filter === "all" 
                    ? "No payments have been recorded yet" 
                    : `No ${filter} payments`}
                </p>
              </div>
            ) : (
              <div className="table-responsive" style={{ fontSize: '0.875rem' }}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="font-medium head-text">Loan</th>
                      <th className="font-medium head-text d-none d-sm-table-cell">Applicant</th>
                      <th className="font-medium head-text text-end">Amount</th>
                      <th className="font-medium head-text d-none d-md-table-cell">Due Date</th>
                      <th className="font-medium head-text">Payment Date</th>
                      <th className="font-medium head-text d-none d-lg-table-cell">Method</th>
                      <th className="font-medium head-text">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="font-regular">
                          <div>
                            <div>{payment.loanNumber}</div>
                            <div className="d-sm-none small text-muted">{payment.applicantName}</div>
                          </div>
                        </td>
                        <td className="font-regular d-none d-sm-table-cell">{payment.applicantName}</td>
                        <td className="font-regular text-end">
                          <span className="d-inline d-md-none" style={{ fontSize: '0.8rem' }}>
                            {formatCurrency(payment.amount).replace('UGX', '').replace(',', 'K')}
                          </span>
                          <span className="d-none d-md-inline">
                            {formatCurrency(payment.amount)}
                          </span>
                        </td>
                        <td className="font-regular d-none d-md-table-cell">{formatDate(payment.dueDate)}</td>
                        <td className="font-regular">
                          <span className="d-inline d-lg-none" style={{ fontSize: '0.8rem' }}>
                            {formatDate(payment.paymentDate).replace(/ \d{4}/, '')}
                          </span>
                          <span className="d-none d-lg-inline">
                            {formatDate(payment.paymentDate)}
                          </span>
                        </td>
                        <td className="font-regular d-none d-lg-table-cell">{payment.paymentMethod}</td>
                        <td>{getStatusBadge(payment.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Record Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered className="glass-modal">
        <div className="glass-card rounded-4 border-0">
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="head-text font-medium fs-6 fs-md-5">Record Payment</Modal.Title>
          </Modal.Header>
          
          <form onSubmit={handlePaymentSubmit}>
            <Modal.Body className="p-3 p-md-4">
              <Row className="g-2 g-md-3">
                <Col xs={12}>
                  <div className="form-group">
                    <label className="form-label font-medium head-text small">Select Loan</label>
                    <select
                      className="form-select font-regular glass-input"
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
                </Col>
                
                <Col xs={12} sm={6}>
                  <div className="form-group">
                    <label className="form-label font-medium head-text small">Amount (UGX)</label>
                    <input
                      type="number"
                      className="form-control font-regular glass-input"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </div>
                </Col>
                
                <Col xs={12} sm={6}>
                  <div className="form-group">
                    <label className="form-label font-medium head-text small">Payment Date</label>
                    <input
                      type="date"
                      className="form-control font-regular glass-input"
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                      required
                    />
                  </div>
                </Col>
                
                <Col xs={12} sm={6}>
                  <div className="form-group">
                    <label className="form-label font-medium head-text small">Payment Method</label>
                    <select
                      className="form-select font-regular glass-input"
                      value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      required
                    >
                      <option value="mobile_money">Mobile Money</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                </Col>
                
                <Col xs={12} sm={6}>
                  <div className="form-group">
                    <label className="form-label font-medium head-text small">Reference Number</label>
                    <input
                      type="text"
                      className="form-control font-regular glass-input"
                      placeholder="Enter transaction reference"
                      value={paymentForm.reference}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, reference: e.target.value }))}
                      required
                    />
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            
            <Modal.Footer className="border-0">
              <Button 
                variant="secondary" 
                className="font-medium btn-sm"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="berry" 
                className="font-medium border-0 btn-sm"
                type="submit"
              >
                Record Payment
              </Button>
            </Modal.Footer>
          </form>
        </div>
      </Modal>
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