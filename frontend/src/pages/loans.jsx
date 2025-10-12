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
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

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
    // Clear error when user starts typing
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
    
    // Simulate API call
    setTimeout(() => {
      // Calculate loan details
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

      // In a real app, this would be an API call
      console.log("Creating loan:", newLoan);
      
      // Show success message
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label className="form-label font-medium">Applicant</label>
        <select
          className={`form-select font-regular ${errors.applicantId ? 'is-invalid' : ''}`}
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

      <div className="row g-3">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label font-medium">Principal Amount (UGX)</label>
            <input
              type="number"
              className={`form-control font-regular ${errors.principalAmount ? 'is-invalid' : ''}`}
              placeholder="10000000"
              value={formData.principalAmount}
              onChange={(e) => handleChange('principalAmount', e.target.value)}
            />
            {errors.principalAmount && <div className="invalid-feedback d-block small-text">{errors.principalAmount}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label font-medium">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              className={`form-control font-regular ${errors.interestRate ? 'is-invalid' : ''}`}
              placeholder="10"
              value={formData.interestRate}
              onChange={(e) => handleChange('interestRate', e.target.value)}
            />
            {errors.interestRate && <div className="invalid-feedback d-block small-text">{errors.interestRate}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label font-medium">Term (Months)</label>
            <input
              type="number"
              className={`form-control font-regular ${errors.termMonths ? 'is-invalid' : ''}`}
              placeholder="12"
              value={formData.termMonths}
              onChange={(e) => handleChange('termMonths', e.target.value)}
            />
            {errors.termMonths && <div className="invalid-feedback d-block small-text">{errors.termMonths}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label font-medium">Loan Agreement</label>
            <select
              className={`form-select font-regular ${errors.agreementId ? 'is-invalid' : ''}`}
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
        </div>
      </div>

      <div className="form-group">
        <label className="form-label font-medium">Collateral (Optional)</label>
        <select
          className="form-select font-regular"
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

      <div className="d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-secondary font-medium" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary font-medium" disabled={isSubmitting}>
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
      <span className={`badge ${config.class} d-flex align-items-center gap-1 font-medium`}>
        <Icon size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
    <div className="container-fluid py-3 px-3 px-md-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="head-text font-medium mb-1">Loans Management</h2>
          <p className="small-text">Manage loan applications and disbursements</p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2 font-medium"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Create Loan
        </button>
      </div>

      {loans.length === 0 ? (
        <div className="text-center py-5">
          <DollarSign size={48} className="text-muted mb-3" />
          <h4 className="head-text font-medium text-muted">No loans yet</h4>
          <p className="small-text mb-3">Create your first loan application</p>
          <button 
            className="btn btn-primary d-flex align-items-center gap-2 mx-auto font-medium"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} />
            Create Loan
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {loans.map((loan) => (
            <div key={loan._id} className="col-12">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-transparent">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="card-title head-text font-medium mb-1">{loan.loanNumber}</h5>
                      <p className="small-text mb-0">{loan.applicantName}</p>
                    </div>
                    {getStatusBadge(loan.status)}
                  </div>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-sm-6 col-md-3">
                      <small className="small-text d-block">Principal</small>
                      <strong className="font-medium">{formatCurrency(loan.principalAmount)}</strong>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <small className="small-text d-block">Interest Rate</small>
                      <strong className="font-medium">{loan.interestRate}%</strong>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <small className="small-text d-block">Term</small>
                      <strong className="font-medium">{loan.termMonths} months</strong>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <small className="small-text d-block">Monthly Payment</small>
                      <strong className="font-medium">{formatCurrency(loan.monthlyPayment)}</strong>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <small className="small-text d-block">Total Amount</small>
                      <strong className="font-medium">{formatCurrency(loan.totalAmount)}</strong>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <small className="small-text d-block">Balance</small>
                      <strong className="font-medium text-primary">{formatCurrency(loan.balance)}</strong>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <small className="small-text d-block">Agreement</small>
                      <strong className="font-medium">{loan.agreementTitle}</strong>
                    </div>
                    {loan.collateralType && (
                      <div className="col-sm-6 col-md-3">
                        <small className="small-text d-block">Collateral</small>
                        <strong className="font-medium">{loan.collateralType}</strong>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    {loan.status === "pending" && (
                      <button 
                        className="btn btn-success btn-sm d-flex align-items-center gap-1 font-medium"
                        onClick={() => handleApprove(loan._id)}
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                    )}
                    {loan.status === "approved" && (
                      <button 
                        className="btn btn-primary btn-sm d-flex align-items-center gap-1 font-medium"
                        onClick={() => handleDisburse(loan._id)}
                      >
                        <DollarSign size={16} />
                        Disburse
                      </button>
                    )}
                    {(loan.status === "pending" || loan.status === "approved") && (
                      <button
                        className="btn btn-outline-danger btn-sm font-medium"
                        onClick={() => {
                          setLoanToDelete(loan._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Loan Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title head-text font-medium">Create New Loan</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="small-text mb-3">Create a new loan application for an applicant</p>
                <LoanForm 
                  onSuccess={handleCreateSuccess}
                  onCancel={() => setShowModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title head-text font-medium d-flex align-items-center gap-2">
                  <AlertTriangle className="text-danger" size={20} />
                  Delete Loan
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="font-regular">Are you sure you want to delete this loan? This action cannot be undone. Note: You cannot delete loans with payment history.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary font-medium" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger font-medium" 
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
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