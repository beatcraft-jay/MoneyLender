import React, { useState } from "react";
import { Modal, Button, Form, Table, Tabs, Tab, Image, Container, Row, Col } from "react-bootstrap";
import { Pencil, Trash2, PlusCircle, Upload, User } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import backgroundImage from "../assets/img/background.jpg";

const initialApplicants = [
  { 
    id: 1, 
    name: "John Doe", 
    phone: "+256700123456", 
    address: "Kampala", 
    email: "john@example.com",
    nin: "CM123456789",
    image: null 
  },
  { 
    id: 2, 
    name: "Sarah Nansubuga", 
    phone: "+256780654321", 
    address: "Entebbe", 
    email: "sarah@example.com",
    nin: "CM987654321",
    image: null 
  },
];

const initialCollateral = [
  { id: 1, applicant: "John Doe", type: "Land Title", value: "UGX 50,000,000" },
  { id: 2, applicant: "Sarah Nansubuga", type: "Car Logbook", value: "UGX 30,000,000" },
];

export default function Applicants() {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [collateral, setCollateral] = useState(initialCollateral);
  const [showModal, setShowModal] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [activeTab, setActiveTab] = useState("applicants");
  const [formData, setFormData] = useState({ 
    name: "", 
    phone: "", 
    address: "", 
    email: "", 
    nin: "", 
    image: null 
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleShow = (applicant = null) => {
    setEditingApplicant(applicant);
    if (applicant) {
      setFormData(applicant);
      setImagePreview(applicant.image);
    } else {
      setFormData({ name: "", phone: "", address: "", email: "", nin: "", image: null });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.nin) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingApplicant) {
      setApplicants((prev) =>
        prev.map((a) => (a.id === editingApplicant.id ? { ...editingApplicant, ...formData } : a))
      );
    } else {
      setApplicants((prev) => [...prev, { id: Date.now(), ...formData }]);
    }
    setShowModal(false);
    setImagePreview(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this applicant?")) {
      setApplicants((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <DashboardLayout>
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
                <h2 className="fw-bold head-text text-primary mb-1 fs-4 fs-md-3">Applicants Management</h2>
                <p className="main-text text-muted mb-0 d-none d-md-block">Manage applicant profiles and collateral information</p>
                <p className="main-text text-muted mb-0 d-md-none small">Manage applicants and collateral</p>
              </div>
              {/* Responsive Add Button */}
              <Button 
                variant="berry" 
                onClick={() => handleShow()} 
                className="fw-semibold d-flex align-items-center border-0"
                size="lg"
              >
                {/* Show only plus icon on mobile, full text on desktop */}
                <PlusCircle className="d-none d-md-block" size={20} />
                <PlusCircle className="d-md-none" size={16} />
                <span className="d-none d-md-inline ms-2">Add Applicant</span>
              </Button>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="glass-card rounded-4 shadow-lg border-0">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="px-2 px-md-4 pt-3 pt-md-4"
              justify
            >
              <Tab eventKey="applicants" title="👥 Applicants">
                <div className="p-2 p-md-4">
                  {applicants.length === 0 ? (
                    <div className="text-center py-4 py-md-5">
                      <User size={40} className="text-muted mb-3" />
                      <h4 className="head-text font-medium text-muted fs-5">No applicants</h4>
                      <p className="small-text mb-3">No applicants have been added yet</p>
                      <Button 
                        variant="berry" 
                        onClick={() => handleShow()} 
                        className="fw-semibold d-flex align-items-center gap-2 mx-auto border-0"
                        size="sm"
                      >
                        <PlusCircle size={14} />
                        <span>Add Applicant</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="table-responsive" style={{ fontSize: '0.875rem' }}>
                      <Table hover className="align-middle mb-0">
                        <thead>
                          <tr>
                            <th className="font-medium head-text">#</th>
                            <th className="font-medium head-text">Image</th>
                            <th className="font-medium head-text">Name</th>
                            <th className="font-medium head-text d-none d-sm-table-cell">Phone</th>
                            <th className="font-medium head-text d-none d-md-table-cell">Address</th>
                            <th className="font-medium head-text d-none d-lg-table-cell">Email</th>
                            <th className="font-medium head-text">NIN</th>
                            <th className="font-medium head-text">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applicants.map((a, i) => (
                            <tr key={a.id}>
                              <td className="font-regular">{i + 1}</td>
                              <td className="text-center">
                                {a.image ? (
                                  <Image 
                                    src={a.image} 
                                    alt={a.name}
                                    roundedCircle 
                                    width={35} 
                                    height={35} 
                                    style={{ objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center"
                                       style={{ width: '35px', height: '35px' }}>
                                    <User size={16} className="text-muted" />
                                  </div>
                                )}
                              </td>
                              <td className="font-regular">{a.name}</td>
                              <td className="font-regular d-none d-sm-table-cell">{a.phone}</td>
                              <td className="font-regular d-none d-md-table-cell">{a.address}</td>
                              <td className="font-regular d-none d-lg-table-cell">{a.email}</td>
                              <td className="font-regular">
                                <span className="d-inline d-lg-none" style={{ fontSize: '0.75rem' }}>
                                  {a.nin.length > 8 ? `${a.nin.substring(0, 8)}...` : a.nin}
                                </span>
                                <span className="d-none d-lg-inline">{a.nin}</span>
                              </td>
                              <td className="text-center">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  className="me-1 me-md-2 font-medium"
                                  onClick={() => handleShow(a)}
                                >
                                  <Pencil size={12} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  className="font-medium"
                                  onClick={() => handleDelete(a.id)}
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </div>
              </Tab>

              <Tab eventKey="collateral" title="🏠 Collateral">
                <div className="p-2 p-md-4">
                  <div className="table-responsive" style={{ fontSize: '0.875rem' }}>
                    <Table hover className="align-middle mb-0">
                      <thead>
                        <tr>
                          <th className="font-medium head-text">#</th>
                          <th className="font-medium head-text">Applicant</th>
                          <th className="font-medium head-text">Type</th>
                          <th className="font-medium head-text d-none d-sm-table-cell">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collateral.map((c, i) => (
                          <tr key={c.id}>
                            <td className="font-regular">{i + 1}</td>
                            <td className="font-regular">{c.applicant}</td>
                            <td className="font-regular">{c.type}</td>
                            <td className="font-regular d-none d-sm-table-cell">{c.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </Container>

        {/* Modal */}
        <Modal show={showModal} onHide={handleClose} centered size="lg" className="glass-modal">
          <div className="glass-card rounded-4 shadow-lg border-0">
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="head-text font-medium fs-6 fs-md-5">
                {editingApplicant ? "Edit Applicant" : "Add Applicant"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3 p-md-4">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="text-center">
                    {/* Image Preview */}
                    <div className="mb-3">
                      {imagePreview ? (
                        <div className="position-relative d-inline-block">
                          <Image 
                            src={imagePreview} 
                            alt="Preview" 
                            rounded 
                            fluid 
                            style={{ maxHeight: '150px', objectFit: 'cover' }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={handleRemoveImage}
                          >
                            <Trash2 size={10} />
                          </Button>
                        </div>
                      ) : (
                        <div className="border rounded p-3 text-muted bg-light" style={{ height: '150px' }}>
                          <User size={32} className="mb-2" />
                          <div className="small">No image selected</div>
                        </div>
                      )}
                    </div>

                    {/* File Input */}
                    <Form.Group>
                      <Form.Label className="btn btn-outline-primary cursor-pointer font-medium btn-sm">
                        <Upload className="me-1" size={14} />
                        Upload Image
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="d-none"
                        />
                      </Form.Label>
                      <Form.Text className="d-block text-muted small">
                        JPG, PNG, max 5MB
                      </Form.Text>
                    </Form.Group>
                  </div>
                </div>
                
                <div className="col-md-8">
                  <Form>
                    {[
                      { name: "name", label: "Full Name", type: "text", required: true },
                      { name: "phone", label: "Phone Number", type: "tel", required: true },
                      { name: "email", label: "Email Address", type: "email", required: true },
                      { name: "nin", label: "National ID (NIN)", type: "text", required: true },
                      { name: "address", label: "Address", type: "text", required: false }
                    ].map((field, i) => (
                      <Form.Group className="mb-3" key={i}>
                        <Form.Label className="font-medium small">
                          {field.label} {field.required && <span className="text-danger">*</span>}
                        </Form.Label>
                        <Form.Control
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          className="font-regular glass-input"
                          required={field.required}
                          size="sm"
                        />
                      </Form.Group>
                    ))}
                  </Form>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button variant="secondary" onClick={handleClose} className="font-medium btn-sm">
                Cancel
              </Button>
              <Button variant="berry" onClick={handleSubmit} className="font-medium border-0 btn-sm">
                {editingApplicant ? "Update Applicant" : "Add Applicant"}
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}