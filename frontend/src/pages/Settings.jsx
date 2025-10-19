import { useState, useEffect, useRef } from "react";
import { Accordion, Button, Card, Form, Toast, ToastContainer } from "react-bootstrap";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import { useTheme } from "../components/context/ThemeContext.jsx"; 
import { Settings as SettingsIcon, User, Mail, Phone, MapPin, Lock, Globe, CreditCard, Accessibility, HelpCircle, Share2, RotateCcw, Info, Moon, Sun } from "lucide-react";

// Mock useAuth hook (as in original)
function useAuth() {
  return {
    isAuthenticated: true,
    updateProfile: (data) => {
      console.log("Updating profile:", data);
      return true; // Mock success
    },
    updatePreferences: (prefs) => {
      console.log("Updating preferences:", prefs);
      return true; // Mock success
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
    image: null, // Removed img1; use null or a default URL
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
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
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
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
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
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <User size={48} className="text-warning mb-3" />
        <h1 className="h3 mb-2">Sign In Required</h1>
        <p className="text-muted mb-4">Please sign in to manage your settings.</p>
        <Button href="/signin" variant="primary" size="lg">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className={`main-text ebg1 ${theme}`}>
      <Card className="shadow">
        <Card.Header className="shadow">
          <Card.Title as="h5" className="mb-0 d-flex align-items-center gap-2">
            <SettingsIcon size={20} /> Settings
          </Card.Title>
        </Card.Header>
        <Card.Body className="p-4">
          <Accordion>
            {/* Profile Information */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <User size={20} className="me-2" /> Profile Information
              </Accordion.Header>
              <Accordion.Body className="accordion">
                <Form onSubmit={handleProfileSubmit}>
                  <div className="text-center mb-4">
                    <img
                      src={profile.image || 'https://via.placeholder.com/100'} // Default placeholder
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="rounded-circle profile-image mb-2"
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
                      />
                      {errors.image && (
                        <Form.Text id="imageError" className="text-danger">
                          {errors.image}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          required
                          isInvalid={!!errors.firstName}
                          aria-describedby="firstNameError"
                        />
                        <Form.Control.Feedback type="invalid" id="firstNameError">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          required
                          isInvalid={!!errors.lastName}
                          aria-describedby="lastNameError"
                        />
                        <Form.Control.Feedback type="invalid" id="lastNameError">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          required
                          isInvalid={!!errors.email}
                          aria-describedby="emailError"
                        />
                        <Form.Control.Feedback type="invalid" id="emailError">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          required
                          isInvalid={!!errors.phone}
                          aria-describedby="phoneError"
                        />
                        <Form.Control.Feedback type="invalid" id="phoneError">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-12">
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          required
                          isInvalid={!!errors.address}
                          aria-describedby="addressError"
                        />
                        <Form.Control.Feedback type="invalid" id="addressError">
                          {errors.address}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
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
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <Mail size={20} className="me-2" /> Notification Preferences
              </Accordion.Header>
              <Accordion.Body className="accordion">
                <Form onSubmit={handlePreferencesSubmit}>
                  <h6>Email Notifications</h6>
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
                  <h6>SMS Notifications</h6>
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
                  <h6>Push Notifications</h6>
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
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
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
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <Globe size={20} className="me-2" /> Currency
              </Accordion.Header>
              <Accordion.Body className="accordion">
                <Form onSubmit={handlePreferencesSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Preferred Currency</Form.Label>
                    <Form.Select
                      value={preferences.currency}
                      onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                    >
                      <option value="UGX">Ugandan Shilling (UGX)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </Form.Select>
                  </Form.Group>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
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

            {/* Payment Options */}
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                <CreditCard size={20} className="me-2" /> Payment Options
              </Accordion.Header>
              <Accordion.Body className="accordion">
                <Form onSubmit={handlePreferencesSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Linked Payment Methods</Form.Label>
                    <Form.Select
                      onChange={(e) => alert(`Selected payment method: ${e.target.value}`)}
                    >
                      <option value="">Select a payment method</option>
                      <option value="mtn">MTN Mobile Money</option>
                      <option value="airtel">Airtel Money</option>
                      <option value="bank">Bank Account</option>
                    </Form.Select>
                  </Form.Group>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      "Add Payment Method"
                    )}
                  </Button>
                </Form>
              </Accordion.Body>
            </Accordion.Item>

            {/* Accessibility Settings */}
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                <Accessibility size={20} className="me-2" /> Accessibility
              </Accordion.Header>
              <Accordion.Body className="accordion">
                <Form onSubmit={handlePreferencesSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Font Size</Form.Label>
                    <Form.Select
                      value={preferences.fontSize}
                      onChange={(e) => setPreferences({ ...preferences, fontSize: e.target.value })}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </Form.Select>
                  </Form.Group>
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
                  <Form.Check
                    type="switch"
                    label={
                      <span className="d-flex align-items-center">
                        {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
                      </span>
                    }
                    checked={theme === "dark"}
                    onChange={(e) => {
                      const newTheme = e.target.checked ? "dark" : "light";
                      setTheme(newTheme);
                      setPreferences({ ...preferences, theme: newTheme });
                    }}
                    className="mb-3"
                    aria-label="Toggle theme"
                  />
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
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
            <Accordion.Item eventKey="5">
              <Accordion.Header>
                <Lock size={20} className="me-2" /> Security
              </Accordion.Header>
              <Accordion.Body className="accordion">
                <Form onSubmit={handlePasswordSubmit}>
                  <Form.Check
                    type="switch"
                    label="Enable Two-Factor Authentication (2FA)"
                    checked={preferences.twoFactorAuth}
                    onChange={(e) => setPreferences({ ...preferences, twoFactorAuth: e.target.checked })}
                    className="mb-3"
                  />
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password.current}
                      onChange={(e) => setPassword({ ...password, current: e.target.value })}
                      autoComplete="current-password"
                      aria-describedby="currentError"
                    />
                    <Form.Control.Feedback type="invalid" id="currentError">
                      {errors.current}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password.new}
                      onChange={(e) => setPassword({ ...password, new: e.target.value })}
                      isInvalid={!!errors.new}
                      autoComplete="new-password"
                      aria-describedby="newError"
                    />
                    <Form.Control.Feedback type="invalid" id="newError">
                      {errors.new}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password.confirm}
                      onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                      isInvalid={!!errors.confirm}
                      autoComplete="new-password"
                      aria-describedby="confirmError"
                    />
                    <Form.Control.Feedback type="invalid" id="confirmError">
                      {errors.confirm}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </Form>
                <hr />
                <Button
                  variant="outline-danger"
                  onClick={() => alert("All active sessions terminated.")}
                  className="mt-2"
                >
                  Terminate All Sessions
                </Button>
              </Accordion.Body>
            </Accordion.Item>

            {/* Help */}
            <Accordion.Item eventKey="6">
              <Accordion.Header>
                <HelpCircle size={20} className="me-2" /> Help
              </Accordion.Header>
              <Accordion.Body className="accordion">
                <p>
                  <a href="/faqs" className="text-primary">Visit our FAQ</a> for common questions.
                </p>
                <p>
                  Contact support via <a href="/support" className="text-primary">Support Messages</a> or email us at{" "}
                  <a href="mailto:support@esacco.com" className="text-primary">support@esacco.com</a>.
                </p>
                <Button variant="primary" href="/forum">
                  Start Live Chat
                </Button>
              </Accordion.Body>
            </Accordion.Item>

            {/* Invite a Friend */}
            <Accordion.Item eventKey="7">
              <Accordion.Header>
                <Share2 size={20} className="me-2" /> Invite a Friend
              </Accordion.Header>
              <Accordion.Body className="accordion">
                <Form onSubmit={handleInviteSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Friend's Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      isInvalid={!!errors.inviteEmail}
                      aria-describedby="inviteEmailError"
                    />
                    <Form.Control.Feedback type="invalid" id="inviteEmailError">
                      {errors.inviteEmail}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
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

            {/* App Updates */}
            <Accordion.Item eventKey="8">
              <Accordion.Header>
                <RotateCcw size={20} className="me-2" /> App Updates
              </Accordion.Header>
              <Accordion.Body className="accordion">
                <Form onSubmit={handlePreferencesSubmit}>
                  <Form.Check
                    type="switch"
                    label="Enable Auto-Updates"
                    checked={preferences.autoUpdates}
                    onChange={(e) => setPreferences({ ...preferences, autoUpdates: e.target.checked })}
                    className="mb-3"
                  />
                  <Button
                    variant="primary"
                    onClick={() => alert("Checking for updates...")}
                  >
                    Check for Updates
                  </Button>
                </Form>
              </Accordion.Body>
            </Accordion.Item>

            {/* About */}
            <Accordion.Item eventKey="9">
              <Accordion.Header>
                <Info size={20} className="me-2" /> About
              </Accordion.Header>
              <Accordion.Body className="accordion">
                <h6>Julio Financial Services</h6>
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Creator:</strong> Beatcraft</p>
                <p><strong>Description:</strong> Julio Financial Services is a digital platform designed to empower users with seamless loan management, including applicants, loans, payments, agreements, and notifications.</p>
                <p><strong>Contact:</strong> <a href="mailto:support@juliofs.com" className="text-primary">support@juliofs.com</a> or <a href="/forum" className="text-primary">Support Messages</a></p>
                <p><strong>License:</strong> MIT License</p>
                <p><strong>Learn More:</strong> <a href="https://x.com/_todii" target="_blank" rel="noopener noreferrer" className="text-primary">Visit Beatcraft</a></p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast({ ...showToast, show: false })}
          show={showToast.show}
          delay={3000}
          autohide
          bg={showToast.type}
        >
          <Toast.Header>
            <strong className="me-auto">{showToast.type === "success" ? "Success" : "Error"}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{showToast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
      {/* Assuming Footer is defined elsewhere; if not, remove or add a stub */}
      {/* <Footer /> */}
    </div>
    </DashboardLayout>
  );
}

export default Settings;