import { useState } from "react";
import { 
  Plus, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Trash2, 
  TrendingUp
} from "lucide-react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import DashboardLayout from "../components/layout/dashboardLayout.jsx";
import backgroundImage from "../assets/img/background.jpg";

// Dummy data
const dummyApplicants = [
  { _id: "1", fullName: "John Okello", idNumber: "CM123456", status: "active" },
  { _id: "2", fullName: "Sarah Nansubuga", idNumber: "CM123457", status: "active" },
  { _id: "3", fullName: "Peter Ssemanda", idNumber: "CM123458", status: "active" },
];

const dummyAgreements = [
  { _id: "1", title: "Standard Personal Loan", version: "1.0" },
  { _id: "2", title: "Business Loan Agreement", version: "2.1" },
];

const dummyCollateral = [
  { _id: "1", applicantId: "1", type: "Land Title", estimatedValue: 50000000, status: "available" },
  { _id: "2", applicantId: "2", type: "Car Logbook", estimatedValue: 30000000, status: "available" },
];

const initialLoans = [
  {
    _id: "1",
    loanNumber: "LN-2024-001",
    applicantName: "John Okello",
    status: "pending",
    principalAmount: 10000000,
    interestRate: 10,
    termMonths: 12,
    monthlyPayment: 879159,
    totalAmount: 10549908,
    balance: 10549908,
    agreementTitle: "Standard Personal Loan",
    collateralType: "Land Title"
  },
  {
    _id: "2",
    loanNumber: "LN-2024-002",
    applicantName: "Sarah Nansubuga",
    status: "approved",
    principalAmount: 5000000,
    interestRate: 8,
    termMonths: 6,
    monthlyPayment: 869882,
    totalAmount: 5219292,
    balance: 5219292,
    agreementTitle: "Standard Personal Loan",
    collateralType: "Car Logbook"
  },
  {
    _id: "3",
    loanNumber: "LN-2024-003",
    applicantName: "Peter Ssemanda",
    status: "active",
    principalAmount: 15000000,
    interestRate: 12,
    termMonths: 24,
    monthlyPayment: 706643,
    totalAmount: 16959432,
    balance: 12000000,
    agreementTitle: "Business Loan Agreement",
    collateralType: undefined
  }
];

// Loan form schema validation
const validateLoanForm = (data) => {
  const errors = {};
  
  if (!data.applicantId) errors.applicantId = "Applicant is required";
  if (!data.principalAmount) errors.principalAmount = "Principal amount is required";
  if (!data.interestRate) errors.interestRate = "Interest rate is required";
  if (!data.termMonths) errors.termMonths = "Loan term is required";
  if (!data.agreementId) errors.agreementId = "Agreement is required";
  
  return errors;
};

function LoanForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    applicantId: "",
    principalAmount: "",
    interestRate: "10",
    termMonths: "12",
    collateralId: "",
    agreementId: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState("");

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateLoanForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const principal = parseFloat(formData.principalAmount);
      const interestRate = parseFloat(formData.interestRate);
      const termMonths = parseInt(formData.termMonths);
      const monthlyInterest = interestRate / 100 / 12;
      const monthlyPayment = principal * monthlyInterest * Math.pow(1 + monthlyInterest, termMonths) / 
                           (Math.pow(1 + monthlyInterest, termMonths) - 1);
      
      const selectedApplicantData = dummyApplicants.find(a => a._id === formData.applicantId);
      const selectedAgreement = dummyAgreements.find(a => a._id === formData.agreementId);
      const selectedCollateral = dummyCollateral.find(c => c._id === formData.collateralId);

      const newLoan = {
        _id: Date.now().toString(),
        loanNumber: `LN-2024-${String(initialLoans.length + 1).padStart(3, '0')}`,
        applicantName: selectedApplicantData.fullName,
        status: "pending",
        principalAmount: principal,
        interestRate: interestRate,
        termMonths: termMonths,
        monthlyPayment: Math.round(monthlyPayment),
        totalAmount: Math.round(monthlyPayment * termMonths),
        balance: Math.round(monthlyPayment * termMonths),
        agreementTitle: selectedAgreement.title,
        collateralType: selectedCollateral?.type
      };

      console.log("Creating loan:", newLoan);
      
      if (typeof window !== 'undefined') {
        alert("Loan created successfully!");
      }
      
      setIsSubmitting(false);
      onSuccess(newLoan);
    }, 1000);
  };

  const availableCollateral = selectedApplicant
    ? dummyCollateral.filter(
        (item) => item.applicantId === selectedApplicant && item.status === "available"
      )
    : [];

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-3 mb-md-4">
        <label className="form-label font-medium head-text small">Applicant</label>
        <select
          className={`form-select font-regular glass-input ${errors.applicantId ? 'is-invalid' : ''}`}
          value={formData.applicantId}
          onChange={(e) => {
            handleChange('applicantId', e.target.value);
            setSelectedApplicant(e.target.value);
          }}
        >
          <option value="">Select applicant</option>
          {dummyApplicants
            .filter((a) => a.status === "active")
            .map((applicant) => (
              <option key={applicant._id} value={applicant._id}>
                {applicant.fullName} - {applicant.idNumber}
              </option>
            ))}
        </select>
        {errors.applicantId && <div className="invalid-feedback d-block small-text">{errors.applicantId}</div>}
      </div>

      <Row className="g-2 g-md-3 mb-3 mb-md-4">
        <Col xs={12} sm={6}>
          <div className="form-group">
            <label className="form-label font-medium head-text small">Principal Amount (UGX)</label>
            <input
              type="number"
              className={`form-control font-regular glass-input ${errors.principalAmount ? 'is-invalid' : ''}`}
              placeholder="10000000"
              value={formData.principalAmount}
              onChange={(e) => handleChange('principalAmount', e.target.value)}
            />
            {errors.principalAmount && <div className="invalid-feedback d-block small-text">{errors.principalAmount}</div>}
          </div>
        </Col>

        <Col xs={12} sm={6}>
          <div className="form-group">
            <label className="form-label font-medium head-text small">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              className={`form-control font-regular glass-input ${errors.interestRate ? 'is-invalid' : ''}`}
              placeholder="10"
              value={formData.interestRate}
              onChange={(e) => handleChange('interestRate', e.target.value)}
            />
            {errors.interestRate && <div className="invalid-feedback d-block small-text">{errors.interestRate}</div>}
          </div>
        </Col>

        <Col xs={12} sm={6}>
          <div className="form-group">
            <label className="form-label font-medium head-text small">Term (Months)</label>
            <input
              type="number"
              className={`form-control font-regular glass-input ${errors.termMonths ? 'is-invalid' : ''}`}
              placeholder="12"
              value={formData.termMonths}
              onChange={(e) => handleChange('termMonths', e.target.value)}
            />
            {errors.termMonths && <div className="invalid-feedback d-block small-text">{errors.termMonths}</div>}
          </div>
        </Col>

        <Col xs={12} sm={6}>
          <div className="form-group">
            <label className="form-label font-medium head-text small">Loan Agreement</label>
            <select
              className={`form-select font-regular glass-input ${errors.agreementId ? 'is-invalid' : ''}`}
              value={formData.agreementId}
              onChange={(e) => handleChange('agreementId', e.target.value)}
            >
              <option value="">Select agreement</option>
              {dummyAgreements.map((agreement) => (
                <option key={agreement._id} value={agreement._id}>
                  {agreement.title} (v{agreement.version})
                </option>
              ))}
            </select>
            {errors.agreementId && <div className="invalid-feedback d-block small-text">{errors.agreementId}</div>}
          </div>
        </Col>
      </Row>

      <div className="form-group mb-3 mb-md-4">
        <label className="form-label font-medium head-text small">Collateral (Optional)</label>
        <select
          className="form-select font-regular glass-input"
          value={formData.collateralId}
          onChange={(e) => handleChange('collateralId', e.target.value)}
        >
          <option value="">No collateral</option>
          {availableCollateral.map((item) => (
            <option key={item._id} value={item._id}>
              {item.type} - UGX {item.estimatedValue.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex gap-2 justify-content-end pt-2 pt-md-3">
        <button type="button" className="btn btn-secondary font-medium btn-sm" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-berry font-medium border-0 btn-sm" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Loan"}
        </button>
      </div>
    </form>
  );
}

function LoansContent() {
  const [loans, setLoans] = useState(initialLoans);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-warning text-dark", icon: Clock },
      approved: { class: "bg-info text-white", icon: CheckCircle },
      active: { class: "bg-success text-white", icon: TrendingUp },
      completed: { class: "bg-secondary text-white", icon: CheckCircle },
      defaulted: { class: "bg-danger text-white", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`badge ${config.class} d-flex align-items-center gap-1 font-medium`} style={{ fontSize: '0.7rem' }}>
        <Icon size={12} />
        <span className="d-none d-sm-inline">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        <span className="d-sm-none">{status.charAt(0).toUpperCase()}</span>
      </span>
    );
  };

  const handleApprove = (loanId) => {
    setLoans(prev => prev.map(loan => 
      loan._id === loanId ? { ...loan, status: "approved" } : loan
    ));
    alert("Loan approved successfully!");
  };

  const handleDisburse = (loanId) => {
    setLoans(prev => prev.map(loan => 
      loan._id === loanId ? { ...loan, status: "active" } : loan
    ));
    alert("Loan disbursed successfully!");
  };

  const handleDelete = () => {
    if (!loanToDelete) return;
    setLoans(prev => prev.filter(loan => loan._id !== loanToDelete));
    setShowDeleteModal(false);
    setLoanToDelete(null);
    alert("Loan deleted successfully!");
  };

  const handleCreateSuccess = (newLoan) => {
    setLoans(prev => [newLoan, ...prev]);
    setShowModal(false);
  };

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
      <Container fluid className="px-2 px-md-3">
        {/* Header */}
        <div className="glass-card p-3 p-md-4 rounded-4 shadow-lg mb-3 mb-md-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1 me-3">
              <h2 className="fw-bold head-text text-primary mb-1 fs-4 fs-md-3">💰 Loans Management</h2>
              <p className="main-text text-muted mb-0 d-none d-md-block">Manage loan applications and disbursements</p>
              <p className="main-text text-muted mb-0 d-md-none small">Manage loans and disbursements</p>
            </div>
            {/* Responsive Add Button */}
            <Button 
              variant="berry" 
              className="d-flex align-items-center font-medium border-0"
              onClick={() => setShowModal(true)}
              size="lg"
            >
              {/* Show only plus icon on mobile, full text on desktop */}
              <Plus className="d-none d-md-block" size={20} />
              <Plus className="d-md-none" size={16} />
              <span className="d-none d-md-inline ms-2">Create Loan</span>
            </Button>
          </div>
        </div>

        {/* Loans Grid */}
        {loans.length === 0 ? (
          <div className="glass-card rounded-4 shadow-lg border-0 text-center py-4 py-md-5">
            <DollarSign size={40} className="text-muted mb-3" />
            <h4 className="head-text font-medium text-muted fs-5">No loans yet</h4>
            <p className="small-text mb-3">Create your first loan application</p>
            <Button 
              variant="berry" 
              className="d-flex align-items-center gap-2 mx-auto font-medium border-0"
              onClick={() => setShowModal(true)}
              size="sm"
            >
              <Plus size={14} />
              <span>Create Loan</span>
            </Button>
          </div>
        ) : (
          <Row className="g-3 g-md-4">
            {loans.map((loan) => (
              <Col key={loan._id} xs={12} lg={6} xl={4}>
                <div className="glass-card rounded-4 shadow-sm h-100 border-0 d-flex flex-column">
                  {/* Card Header */}
                  <div className="card-header bg-transparent border-0 pb-2 p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1 me-2">
                        <h5 className="card-title head-text font-medium mb-1 fs-6">{loan.loanNumber}</h5>
                        <p className="small-text mb-0 text-muted">{loan.applicantName}</p>
                      </div>
                      {getStatusBadge(loan.status)}
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="card-body flex-grow-1 p-0">
                    <div className="p-2 p-md-3">
                      <Row className="g-2">
                        <Col xs={6} sm={4}>
                          <div className="text-center p-1 p-md-2">
                            <small className="small-text d-block text-muted mb-1" style={{ fontSize: '0.7rem' }}>Principal</small>
                            <strong className="font-medium head-text d-block" style={{ fontSize: '0.8rem' }}>
                              {formatCurrency(loan.principalAmount).replace('UGX', '')}
                            </strong>
                          </div>
                        </Col>
                        <Col xs={6} sm={4}>
                          <div className="text-center p-1 p-md-2">
                            <small className="small-text d-block text-muted mb-1" style={{ fontSize: '0.7rem' }}>Interest</small>
                            <strong className="font-medium head-text d-block" style={{ fontSize: '0.8rem' }}>{loan.interestRate}%</strong>
                          </div>
                        </Col>
                        <Col xs={6} sm={4}>
                          <div className="text-center p-1 p-md-2">
                            <small className="small-text d-block text-muted mb-1" style={{ fontSize: '0.7rem' }}>Term</small>
                            <strong className="font-medium head-text d-block" style={{ fontSize: '0.8rem' }}>{loan.termMonths}m</strong>
                          </div>
                        </Col>
                        <Col xs={6} sm={4}>
                          <div className="text-center p-1 p-md-2">
                            <small className="small-text d-block text-muted mb-1" style={{ fontSize: '0.7rem' }}>Monthly</small>
                            <strong className="font-medium head-text d-block" style={{ fontSize: '0.8rem' }}>
                              {formatCurrency(loan.monthlyPayment).replace('UGX', '')}
                            </strong>
                          </div>
                        </Col>
                        <Col xs={6} sm={4}>
                          <div className="text-center p-1 p-md-2">
                            <small className="small-text d-block text-muted mb-1" style={{ fontSize: '0.7rem' }}>Total</small>
                            <strong className="font-medium head-text d-block" style={{ fontSize: '0.8rem' }}>
                              {formatCurrency(loan.totalAmount).replace('UGX', '')}
                            </strong>
                          </div>
                        </Col>
                        <Col xs={6} sm={4}>
                          <div className="text-center p-1 p-md-2">
                            <small className="small-text d-block text-muted mb-1" style={{ fontSize: '0.7rem' }}>Balance</small>
                            <strong className="font-medium head-text d-block text-primary" style={{ fontSize: '0.8rem' }}>
                              {formatCurrency(loan.balance).replace('UGX', '')}
                            </strong>
                          </div>
                        </Col>
                        {loan.collateralType && (
                          <Col xs={12}>
                            <div className="text-center p-1 p-md-2 border-top pt-2">
                              <small className="small-text d-block text-muted mb-1" style={{ fontSize: '0.7rem' }}>Collateral</small>
                              <strong className="font-medium head-text d-block" style={{ fontSize: '0.8rem' }}>{loan.collateralType}</strong>
                            </div>
                          </Col>
                        )}
                      </Row>
                    </div>
                  </div>

                  {/* Card Footer - Action Buttons */}
                  <div className="card-footer bg-transparent border-0 pt-2 mt-auto p-3">
                    <div className="d-flex gap-1 gap-md-2">
                      {loan.status === "pending" && (
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="d-flex align-items-center gap-1 font-medium flex-grow-1"
                          onClick={() => handleApprove(loan._id)}
                        >
                          <CheckCircle size={14} />
                          <span className="d-none d-sm-inline">Approve</span>
                          <span className="d-sm-none">OK</span>
                        </Button>
                      )}
                      {loan.status === "approved" && (
                        <Button 
                          variant="berry" 
                          size="sm" 
                          className="d-flex align-items-center gap-1 font-medium flex-grow-1 border-0"
                          onClick={() => handleDisburse(loan._id)}
                        >
                          <DollarSign size={14} />
                          <span className="d-none d-sm-inline">Disburse</span>
                          <span className="d-sm-none">Pay</span>
                        </Button>
                      )}
                      {(loan.status === "pending" || loan.status === "approved") && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="font-medium"
                          onClick={() => {
                            setLoanToDelete(loan._id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Create Loan Modal */}
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="glass-modal">
          <div className="glass-card rounded-4 border-0">
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="head-text font-medium fs-6 fs-md-5">Create New Loan</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3 p-md-4">
              <p className="small-text mb-3">Create a new loan application for an applicant</p>
              <LoanForm 
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowModal(false)}
              />
            </Modal.Body>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="glass-modal">
          <div className="glass-card rounded-4 border-0">
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="head-text font-medium d-flex align-items-center gap-2 fs-6">
                <AlertTriangle className="text-danger" size={18} />
                Delete Loan
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3 p-md-4">
              <p className="font-regular main-text small">Are you sure you want to delete this loan? This action cannot be undone. Note: You cannot delete loans with payment history.</p>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button variant="secondary" className="font-medium btn-sm" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" className="font-medium btn-sm" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function Loans() {
  return (
    <DashboardLayout>
      <LoansContent />
    </DashboardLayout>
  );
}