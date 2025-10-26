import { useState, useEffect, useRef } from "react";
import { Accordion, Button, Card, Form, Toast, ToastContainer, Container, Row, Col } from "react-bootstrap";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import { useTheme } from "../components/context/ThemeContext.jsx"; 
import { Settings as SettingsIcon, User, Mail, Phone, MapPin, Lock, Globe, CreditCard, Accessibility, HelpCircle, Share2, RotateCcw, Info, Moon, Sun } from "lucide-react";
import backgroundImage from "../assets/img/background.jpg";

// Mock useAuth hook
function useAuth() {
  return {
    isAuthenticated: true,
    updateProfile: (data) => {
      console.log("Updating profile:", data);
      return true;
    },
    updatePreferences: (prefs) => {
      console.log("Updating preferences:", prefs);
      return true;
    },
  };
}

function Settings() {
  const { isAuthenticated, updateProfile, updatePreferences } = useAuth();
  const { theme, setTheme } = useTheme(); 
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "0712345678",
    address: "123 Kampala road, Kampala, Uganda",
    image: null,
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: {
      loanUpdates: true,
      accountActivity: true,
      promotions: false,
    },
    smsNotifications: {
      loanUpdates: false,
      accountActivity: false,
      promotions: false,
    },
    pushNotifications: {
      loanUpdates: true,
      accountActivity: true,
      promotions: false,
    },
    currency: "UGX",
    fontSize: "medium",
    highContrast: false,
    screenReader: false,
    twoFactorAuth: false,
    autoUpdates: true,
    theme: theme,
  });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: "", type: "success" });
  const fileInputRef = useRef(null);

  const validateProfile = () => {
    const newErrors = {};
    if (!profile.firstName) newErrors.firstName = "First name is required";
    if (!profile.lastName) newErrors.lastName = "Last name is required";
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!profile.phone || !/^\+?\d{10,}$/.test(profile.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Valid phone number is required";
    }
    if (!profile.address) newErrors.address = "Address is required";
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (password.new && password.new.length < 8) {
      newErrors.new = "Password must be at least 8 characters";
    }
    if (password.new && password.new !== password.confirm) {
      newErrors.confirm = "Passwords do not match";
    }
    return newErrors;
  };

  const validateInvite = () => {
    const newErrors = {};
    if (!inviteEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      newErrors.inviteEmail = "Valid email is required";
    }
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateProfile();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    const success = updateProfile(profile);
    setIsSubmitting(false);
    setShowToast({
      show: true,
      message: success ? "Profile updated successfully!" : "Failed to update profile.",
      type: success ? "success" : "danger",
    });
    setErrors({});
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = updatePreferences(preferences);
    setIsSubmitting(false);
    setShowToast({
      show: true,
      message: success ? "Preferences updated successfully!" : "Failed to update preferences.",
      type: success ? "success" : "danger",
    });
    setErrors({});
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validatePassword();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setShowToast({
      show: true,
      message: "Password updated successfully!",
      type: "success",
    });
    setPassword({ current: "", new: "", confirm: "" });
    setErrors({});
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateInvite();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setShowToast({
      show: true,
      message: "Invitation sent successfully!",
      type: "success",
    });
    setInviteEmail("");
    setErrors({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: "Only JPEG or PNG images are allowed" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size must be less than 5MB" });
        return;
      }
      setProfile({ ...profile, image: URL.createObjectURL(file) });
      setErrors({ ...errors, image: "" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 dashboard-background">
        <div className="glass-card p-5 rounded-4 text-center">
          <User size={48} className="text-warning mb-3" />
          <h1 className="h3 mb-2 head-text">Sign In Required</h1>
          <p className="text-muted mb-4 main-text">Please sign in to manage your settings.</p>
          <Button href="/signin" variant="berry" size="lg" className="border-0">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

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
        <Container fluid>
          {/* Header */}
          <div className="glass-card p-4 rounded-4 shadow-lg mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold head-text text-primary mb-1">
                  <SettingsIcon size={24} className="me-2" /> 
                  Settings
                </h2>
                <p className="main-text text-muted mb-0">Manage your account preferences and settings</p>
              </div>
            </div>
          </div>

          {/* Settings Accordion */}
          <div className="glass-card rounded-4 shadow-lg border-0">
            <Accordion defaultActiveKey="0">
              {/* Profile Information */}
              <Accordion.Item className="border-0">
                <Accordion.Header className="glass-header">
                  <User size={20} className="me-2" /> Profile Information
                </Accordion.Header>
                <Accordion.Body className="p-4">
                  <Form onSubmit={handleProfileSubmit}>
                    <Row>
                      <Col md={4} className="text-center mb-4">
                        <img
                          src={profile.image || 'https://via.placeholder.com/100'}
                          alt={`${profile.firstName} ${profile.lastName}`}
                          className="rounded-circle profile-image mb-3"
                          width="100"
                          height="100"
                        />
                        <Form.Group>
                          <Form.Control
                            type="file"
                            name="image"
                            accept="image/jpeg,image/png"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            aria-describedby="imageError"
                            className="glass-input"
                          />
                          {errors.image && (
                            <Form.Text id="imageError" className="text-danger small-text">
                              {errors.image}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={8}>
                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="font-medium head-text">First Name</Form.Label>
                              <Form.Control
                                type="text"
                                value={profile.firstName}
                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                required
                                isInvalid={!!errors.firstName}
                                aria-describedby="firstNameError"
                                className="glass-input"
                              />
                              <Form.Control.Feedback type="invalid" id="firstNameError">
                                {errors.firstName}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="font-medium head-text">Last Name</Form.Label>
                              <Form.Control
                                type="text"
                                value={profile.lastName}
                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                required
                                isInvalid={!!errors.lastName}
                                aria-describedby="lastNameError"
                                className="glass-input"
                              />
                              <Form.Control.Feedback type="invalid" id="lastNameError">
                                {errors.lastName}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="font-medium head-text">Email</Form.Label>
                              <Form.Control
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                required
                                isInvalid={!!errors.email}
                                aria-describedby="emailError"
                                className="glass-input"
                              />
                              <Form.Control.Feedback type="invalid" id="emailError">
                                {errors.email}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="font-medium head-text">Phone</Form.Label>
                              <Form.Control
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                required
                                isInvalid={!!errors.phone}
                                aria-describedby="phoneError"
                                className="glass-input"
                              />
                              <Form.Control.Feedback type="invalid" id="phoneError">
                                {errors.phone}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col xs={12}>
                            <Form.Group className="mb-3">
                              <Form.Label className="font-medium head-text">Address</Form.Label>
                              <Form.Control
                                type="text"
                                value={profile.address}
                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                required
                                isInvalid={!!errors.address}
                                aria-describedby="addressError"
                                className="glass-input"
                              />
                              <Form.Control.Feedback type="invalid" id="addressError">
                                {errors.address}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Button type="submit" variant="berry" disabled={isSubmitting} className="border-0">
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        "Save Profile"
                      )}
                    </Button>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>

              {/* Notification Preferences */}
              <Accordion.Item eventKey="1" className="border-0">
                <Accordion.Header className="glass-header">
                  <Mail size={20} className="me-2" /> Notification Preferences
                </Accordion.Header>
                <Accordion.Body className="p-4">
                  <Form onSubmit={handlePreferencesSubmit}>
                    <Row>
                      <Col md={4}>
                        <h6 className="head-text">📧 Email Notifications</h6>
                        <Form.Check
                          type="switch"
                          label="Loan Updates"
                          checked={preferences.emailNotifications.loanUpdates}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              emailNotifications: { ...preferences.emailNotifications, loanUpdates: e.target.checked },
                            })
                          }
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          label="Account Activity"
                          checked={preferences.emailNotifications.accountActivity}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              emailNotifications: { ...preferences.emailNotifications, accountActivity: e.target.checked },
                            })
                          }
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          label="Promotions"
                          checked={preferences.emailNotifications.promotions}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              emailNotifications: { ...preferences.emailNotifications, promotions: e.target.checked },
                            })
                          }
                          className="mb-3"
                        />
                      </Col>
                      <Col md={4}>
                        <h6 className="head-text">📱 SMS Notifications</h6>
                        <Form.Check
                          type="switch"
                          label="Loan Updates"
                          checked={preferences.smsNotifications.loanUpdates}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              smsNotifications: { ...preferences.smsNotifications, loanUpdates: e.target.checked },
                            })
                          }
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          label="Account Activity"
                          checked={preferences.smsNotifications.accountActivity}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              smsNotifications: { ...preferences.smsNotifications, accountActivity: e.target.checked },
                            })
                          }
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          label="Promotions"
                          checked={preferences.smsNotifications.promotions}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              smsNotifications: { ...preferences.smsNotifications, promotions: e.target.checked },
                            })
                          }
                          className="mb-3"
                        />
                      </Col>
                      <Col md={4}>
                        <h6 className="head-text">🔔 Push Notifications</h6>
                        <Form.Check
                          type="switch"
                          label="Loan Updates"
                          checked={preferences.pushNotifications.loanUpdates}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              pushNotifications: { ...preferences.pushNotifications, loanUpdates: e.target.checked },
                            })
                          }
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          label="Account Activity"
                          checked={preferences.pushNotifications.accountActivity}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              pushNotifications: { ...preferences.pushNotifications, accountActivity: e.target.checked },
                            })
                          }
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          label="Promotions"
                          checked={preferences.pushNotifications.promotions}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              pushNotifications: { ...preferences.pushNotifications, promotions: e.target.checked },
                            })
                          }
                          className="mb-3"
                        />
                      </Col>
                    </Row>
                    <Button type="submit" variant="berry" disabled={isSubmitting} className="border-0">
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        "Save Preferences"
                      )}
                    </Button>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>

              {/* Currency Settings */}
              <Accordion.Item eventKey="2" className="border-0">
                <Accordion.Header className="glass-header">
                  <Globe size={20} className="me-2" /> Currency
                </Accordion.Header>
                <Accordion.Body className="p-4">
                  <Form onSubmit={handlePreferencesSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="font-medium head-text">Preferred Currency</Form.Label>
                      <Form.Select
                        value={preferences.currency}
                        onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                        className="glass-input"
                      >
                        <option value="UGX">Ugandan Shilling (UGX)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </Form.Select>
                    </Form.Group>
                    <Button type="submit" variant="berry" disabled={isSubmitting} className="border-0">
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        "Save Currency"
                      )}
                    </Button>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>

              {/* Accessibility Settings */}
              <Accordion.Item eventKey="3" className="border-0">
                <Accordion.Header className="glass-header">
                  <Accessibility size={20} className="me-2" /> Accessibility
                </Accordion.Header>
                <Accordion.Body className="p-4">
                  <Form onSubmit={handlePreferencesSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="font-medium head-text">Font Size</Form.Label>
                          <Form.Select
                            value={preferences.fontSize}
                            onChange={(e) => setPreferences({ ...preferences, fontSize: e.target.value })}
                            className="glass-input"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="font-medium head-text">Theme</Form.Label>
                          <div className="d-flex align-items-center gap-3">
                            <Sun size={20} className={theme === "light" ? "text-warning" : "text-muted"} />
                            <Form.Check
                              type="switch"
                              checked={theme === "dark"}
                              onChange={(e) => {
                                const newTheme = e.target.checked ? "dark" : "light";
                                setTheme(newTheme);
                                setPreferences({ ...preferences, theme: newTheme });
                              }}
                              className="mb-0"
                            />
                            <Moon size={20} className={theme === "dark" ? "text-primary" : "text-muted"} />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Check
                      type="switch"
                      label="High Contrast Mode"
                      checked={preferences.highContrast}
                      onChange={(e) => setPreferences({ ...preferences, highContrast: e.target.checked })}
                      className="mb-3"
                    />
                    <Form.Check
                      type="switch"
                      label="Screen Reader Support"
                      checked={preferences.screenReader}
                      onChange={(e) => setPreferences({ ...preferences, screenReader: e.target.checked })}
                      className="mb-3"
                    />
                    <Button type="submit" variant="berry" disabled={isSubmitting} className="border-0">
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        "Save Accessibility"
                      )}
                    </Button>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>

              {/* Security Settings */}
              <Accordion.Item eventKey="4" className="border-0">
                <Accordion.Header className="glass-header">
                  <Lock size={20} className="me-2" /> Security
                </Accordion.Header>
                <Accordion.Body className="p-4">
                  <Form onSubmit={handlePasswordSubmit}>
                    <Form.Check
                      type="switch"
                      label="Enable Two-Factor Authentication (2FA)"
                      checked={preferences.twoFactorAuth}
                      onChange={(e) => setPreferences({ ...preferences, twoFactorAuth: e.target.checked })}
                      className="mb-4"
                    />
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="font-medium head-text">Current Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={password.current}
                            onChange={(e) => setPassword({ ...password, current: e.target.value })}
                            autoComplete="current-password"
                            aria-describedby="currentError"
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="font-medium head-text">New Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={password.new}
                            onChange={(e) => setPassword({ ...password, new: e.target.value })}
                            isInvalid={!!errors.new}
                            autoComplete="new-password"
                            aria-describedby="newError"
                            className="glass-input"
                          />
                          <Form.Control.Feedback type="invalid" id="newError">
                            {errors.new}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="font-medium head-text">Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={password.confirm}
                            onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                            isInvalid={!!errors.confirm}
                            autoComplete="new-password"
                            aria-describedby="confirmError"
                            className="glass-input"
                          />
                          <Form.Control.Feedback type="invalid" id="confirmError">
                            {errors.confirm}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Button type="submit" variant="berry" disabled={isSubmitting} className="border-0 me-3">
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                    
                    <Button
                      variant="outline-danger"
                      onClick={() => alert("All active sessions terminated.")}
                    >
                      Terminate All Sessions
                    </Button>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>

              {/* Invite a Friend */}
              <Accordion.Item eventKey="5" className="border-0">
                <Accordion.Header className="glass-header">
                  <Share2 size={20} className="me-2" /> Invite a Friend
                </Accordion.Header>
                <Accordion.Body className="p-4">
                  <Form onSubmit={handleInviteSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="font-medium head-text">Friend's Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        isInvalid={!!errors.inviteEmail}
                        aria-describedby="inviteEmailError"
                        className="glass-input"
                        placeholder="Enter your friend's email address"
                      />
                      <Form.Control.Feedback type="invalid" id="inviteEmailError">
                        {errors.inviteEmail}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" variant="berry" disabled={isSubmitting} className="border-0">
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : (
                        "Send Invitation"
                      )}
                    </Button>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>

              {/* About */}
              <Accordion.Item eventKey="6" className="border-0">
                <Accordion.Header className="glass-header">
                  <Info size={20} className="me-2" /> About
                </Accordion.Header>
                <Accordion.Body className="p-4">
                  <div className="glass-card p-4 rounded-4 border-0 mb-4">
                    <h6 className="head-text font-medium">Julio Financial Services</h6>
                    <p className="small-text mb-2"><strong>Version:</strong> 1.0.0</p>
                    <p className="small-text mb-2"><strong>Creator:</strong> Beatcraft</p>
                    <p className="small-text mb-3">
                      <strong>Description:</strong> Julio Financial Services is a digital platform designed to empower users with seamless loan management.
                    </p>
                    <p className="small-text mb-2">
                      <strong>Contact:</strong> <a href="mailto:support@juliofs.com" className="text-primary">support@juliofs.com</a>
                    </p>
                    <p className="small-text mb-2"><strong>License:</strong> MIT License</p>
                    <p className="small-text">
                      <strong>Learn More:</strong> <a href="https://x.com/_todii" target="_blank" rel="noopener noreferrer" className="text-primary">Visit Beatcraft</a>
                    </p>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Container>

        {/* Toast Notification */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            onClose={() => setShowToast({ ...showToast, show: false })}
            show={showToast.show}
            delay={3000}
            autohide
            bg={showToast.type}
            className="glass-card"
          >
            <Toast.Header className="border-0">
              <strong className="me-auto head-text">
                {showToast.type === "success" ? "✅ Success" : "❌ Error"}
              </strong>
            </Toast.Header>
            <Toast.Body className={showToast.type === "success" ? "text-success" : "text-danger"}>
              {showToast.message}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </DashboardLayout>
  );
}

export default Settings;