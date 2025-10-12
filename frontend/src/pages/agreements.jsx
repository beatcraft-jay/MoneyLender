import { useState } from "react";
import { Plus, FileText, Download, Eye, User, Calendar } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

// Dummy data for agreements and loans
const dummyLoans = [
  {
    _id: "1",
    loanNumber: "LN-2024-001",
    applicantName: "John Okello",
    applicantId: "1",
    principalAmount: 10000000,
    interestRate: 10,
    termMonths: 12,
    agreementTitle: "Standard Personal Loan",
    agreementContent: `
# LOAN AGREEMENT

**Agreement Number:** LA-2024-001  
**Date:** ${new Date().toLocaleDateString()}

## PARTIES

**Lender:** Julio Financial Solutions  
**Borrower:** John Okello

## LOAN TERMS

1. **Principal Amount:** UGX 10,000,000
2. **Interest Rate:** 10% per annum
3. **Loan Term:** 12 months
4. **Monthly Payment:** UGX 879,159
5. **Total Repayment:** UGX 10,549,908

## TERMS AND CONDITIONS

The Borrower agrees to repay the loan in 12 equal monthly installments of UGX 879,159 commencing on the first day of the following month.

Late payments will attract a penalty of 2% per month on the overdue amount.

## COLLATERAL

Land Title - Estimated Value: UGX 50,000,000

## SIGNATURES

_________________________
**John Okello**
Borrower

_________________________
**Julio Finance**
Lender
    `,
    createdDate: new Date('2024-01-15'),
    status: "active"
  },
  {
    _id: "2",
    loanNumber: "LN-2024-002",
    applicantName: "Sarah Nansubuga",
    applicantId: "2",
    principalAmount: 5000000,
    interestRate: 8,
    termMonths: 6,
    agreementTitle: "Standard Personal Loan",
    agreementContent: `
# LOAN AGREEMENT

**Agreement Number:** LA-2024-002  
**Date:** ${new Date().toLocaleDateString()}

## PARTIES

**Lender:** Julio Financial Solutions  
**Borrower:** Sarah Nansubuga

## LOAN TERMS

1. **Principal Amount:** UGX 5,000,000
2. **Interest Rate:** 8% per annum
3. **Loan Term:** 6 months
4. **Monthly Payment:** UGX 869,882
5. **Total Repayment:** UGX 5,219,292

## TERMS AND CONDITIONS

The Borrower agrees to repay the loan in 6 equal monthly installments of UGX 869,882 commencing on the first day of the following month.

Late payments will attract a penalty of 2% per month on the overdue amount.

## COLLATERAL

Car Logbook - Estimated Value: UGX 30,000,000

## SIGNATURES

_________________________
**Sarah Nansubuga**
Borrower

_________________________
**Julio Finance**
Lender
    `,
    createdDate: new Date('2024-02-01'),
    status: "active"
  }
];

const agreementTemplates = [
  {
    id: "1",
    title: "Standard Personal Loan",
    description: "Basic personal loan agreement for individual borrowers",
    version: "1.0"
  },
  {
    id: "2",
    title: "Business Loan Agreement",
    description: "Comprehensive agreement for business loans",
    version: "2.1"
  },
  {
    id: "3",
    title: "Emergency Loan Agreement",
    description: "Short-term emergency loan agreement",
    version: "1.2"
  }
];

function AgreementsContent() {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewAgreement = (loan) => {
    setSelectedLoan(loan);
  };

  const handleDownloadAgreement = (loan) => {
    // In a real application, this would generate and download a PDF
    const element = document.createElement('a');
    const file = new Blob([loan.agreementContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `agreement-${loan.loanNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container-fluid py-3 px-3 px-md-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="head-text font-medium mb-1">Loan Agreements</h2>
          <p className="small-text d-none d-md-block">Manage and view all loan agreements</p>
        </div>
        
        {/* Create Button - Desktop with text, Mobile circular with icon */}
        <div className="d-flex gap-2">
          <button 
            className="btn btn-primary d-none d-md-flex align-items-center gap-2 font-medium"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={20} />
            Create Agreement
          </button>
          
          <button 
            className="btn btn-primary d-md-none rounded-circle p-2 font-medium"
            style={{ width: '50px', height: '50px' }}
            onClick={() => setShowCreateModal(true)}
            title="Create Agreement"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="card-title head-text font-medium mb-0">Active Loan Agreements</h5>
            </div>
            <div className="card-body">
              {dummyLoans.length === 0 ? (
                <div className="text-center py-5">
                  <FileText size={48} className="text-muted mb-3" />
                  <h4 className="head-text font-medium text-muted">No agreements</h4>
                  <p className="small-text mb-3">No loan agreements have been created yet</p>
                  <button 
                    className="btn btn-primary d-flex align-items-center gap-2 mx-auto font-medium"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Plus size={16} />
                    Create Agreement
                  </button>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {dummyLoans.map((loan) => (
                    <div key={loan._id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                          {/* User Image - Even circle with consistent sizing */}
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                               style={{ 
                                 width: '40px', 
                                 height: '40px',
                                 minWidth: '40px' // Ensure it doesn't shrink
                               }}>
                            <User size={20} />
                          </div>
                          
                          <div className="flex-grow-1">
                            <h6 className="font-medium mb-1">{loan.applicantName}</h6>
                            <p className="small-text mb-1 d-none d-md-block">
                              <strong>Loan:</strong> {loan.loanNumber} • 
                              <strong> Amount:</strong> {formatCurrency(loan.principalAmount)}
                            </p>
                            <p className="small-text mb-0">
                              <Calendar size={14} className="me-1" />
                              Created {formatDate(loan.createdDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="d-flex gap-2">
                          {/* Desktop buttons with text */}
                          <button
                            className="btn btn-outline-primary btn-sm d-none d-md-flex align-items-center gap-1 font-medium"
                            onClick={() => handleViewAgreement(loan)}
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm d-none d-md-flex align-items-center gap-1 font-medium"
                            onClick={() => handleDownloadAgreement(loan)}
                          >
                            <Download size={16} />
                            Download
                          </button>
                          
                          {/* Mobile buttons - circular with icons only */}
                          <button
                            className="btn btn-outline-primary btn-sm d-md-none rounded-circle p-2"
                            style={{ width: '40px', height: '40px' }}
                            onClick={() => handleViewAgreement(loan)}
                            title="View Agreement"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm d-md-none rounded-circle p-2"
                            style={{ width: '40px', height: '40px' }}
                            onClick={() => handleDownloadAgreement(loan)}
                            title="Download Agreement"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Agreement Details Modal */}
      {selectedLoan && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title head-text font-medium">
                  Agreement: {selectedLoan.loanNumber}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedLoan(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="font-medium">{selectedLoan.applicantName}</h6>
                    <p className="small-text mb-0">
                      {selectedLoan.agreementTitle} • {formatCurrency(selectedLoan.principalAmount)}
                    </p>
                  </div>
                  <button
                    className="btn btn-outline-primary d-flex align-items-center gap-1 font-medium"
                    onClick={() => handleDownloadAgreement(selectedLoan)}
                  >
                    <Download size={16} />
                    <span className="d-none d-md-inline">Download PDF</span>
                    <span className="d-md-none">Download</span>
                  </button>
                </div>
                
                <div className="border rounded p-4 bg-light">
                  <pre className="font-regular mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {selectedLoan.agreementContent}
                  </pre>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary font-medium" 
                  onClick={() => setSelectedLoan(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Agreement Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title head-text font-medium">Create New Agreement</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="small-text mb-3">Select an agreement template to get started</p>
                
                <div className="row g-3">
                  {agreementTemplates.map((template) => (
                    <div key={template.id} className="col-md-6">
                      <div className="card h-100 border">
                        <div className="card-body">
                          <div className="d-flex align-items-start gap-2 mb-2">
                            <FileText size={20} className="text-primary mt-1" />
                            <div>
                              <h6 className="font-medium mb-1">{template.title}</h6>
                              <small className="small-text">Version {template.version}</small>
                            </div>
                          </div>
                          <p className="small-text mb-3">{template.description}</p>
                          <button className="btn btn-primary btn-sm font-medium w-100">
                            Use Template
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary font-medium" 
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Agreements() {
  return (
    <DashboardLayout>
      <AgreementsContent />
    </DashboardLayout>
  );
}