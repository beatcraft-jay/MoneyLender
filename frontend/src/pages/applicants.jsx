import React, { useState } from "react";
import { Modal, Button, Form, Table, Tabs, Tab, Image } from "react-bootstrap";
import { Pencil, Trash2, PlusCircle, Upload, User } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
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
      <div className="w-100">
        <h2 className="head-text font-medium mb-4">Applicants Management</h2>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          justify
        >
          <Tab eventKey="applicants" title="Applicants">
            <div className="d-flex justify-content-end mb-3">
              <Button variant="primary" onClick={() => handleShow()} className="font-medium">
                <PlusCircle className="me-2" size={16} /> Add Applicant
              </Button>
            </div>

            <div className="table-responsive">
              <Table bordered hover className="align-middle">
                <thead className="table-dark text-center">
                  <tr>
                    <th className="font-medium">#</th>
                    <th className="font-medium">Image</th>
                    <th className="font-medium">Name</th>
                    <th className="font-medium">Phone</th>
                    <th className="font-medium">Address</th>
                    <th className="font-medium">Email</th>
                    <th className="font-medium">NIN</th>
                    <th className="font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((a, i) => (
                    <tr key={a.id}>
                      <td>{i + 1}</td>
                      <td className="text-center">
                        {a.image ? (
                          <Image 
                            src={a.image} 
                            alt={a.name}
                            roundedCircle 
                            width={40} 
                            height={40} 
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center"
                               style={{ width: '40px', height: '40px' }}>
                            <User size={20} className="text-muted" />
                          </div>
                        )}
                      </td>
                      <td className="font-regular">{a.name}</td>
                      <td className="font-regular">{a.phone}</td>
                      <td className="font-regular">{a.address}</td>
                      <td className="font-regular">{a.email}</td>
                      <td className="font-regular">{a.nin}</td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          className="me-2 font-medium"
                          onClick={() => handleShow(a)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          className="font-medium"
                          onClick={() => handleDelete(a.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>

          <Tab eventKey="collateral" title="Collateral">
            <div className="table-responsive">
              <Table bordered hover className="align-middle">
                <thead className="table-dark text-center">
                  <tr>
                    <th className="font-medium">#</th>
                    <th className="font-medium">Applicant</th>
                    <th className="font-medium">Type</th>
                    <th className="font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {collateral.map((c, i) => (
                    <tr key={c.id}>
                      <td>{i + 1}</td>
                      <td className="font-regular">{c.applicant}</td>
                      <td className="font-regular">{c.type}</td>
                      <td className="font-regular">{c.value}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>
        </Tabs>

        {/* Modal */}
        <Modal show={showModal} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="head-text font-medium">
              {editingApplicant ? "Edit Applicant" : "Add Applicant"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                          style={{ maxHeight: '200px', objectFit: 'cover' }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 m-1"
                          onClick={handleRemoveImage}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    ) : (
                      <div className="border rounded p-4 text-muted bg-light" style={{ height: '200px' }}>
                        <User size={48} className="mb-2" />
                        <div>No image selected</div>
                      </div>
                    )}
                  </div>

                  {/* File Input */}
                  <Form.Group>
                    <Form.Label className="btn btn-outline-primary cursor-pointer font-medium">
                      <Upload className="me-2" size={16} />
                      Upload Image
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="d-none"
                      />
                    </Form.Label>
                    <Form.Text className="d-block text-muted">
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
                      <Form.Label className="font-medium">
                        {field.label} {field.required && <span className="text-danger">*</span>}
                      </Form.Label>
                      <Form.Control
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="font-regular"
                        required={field.required}
                      />
                    </Form.Group>
                  ))}
                </Form>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} className="font-medium">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} className="font-medium">
              {editingApplicant ? "Update Applicant" : "Add Applicant"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
}