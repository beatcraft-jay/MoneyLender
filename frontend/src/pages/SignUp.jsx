import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Form, Container, Row, Col, Alert } from "react-bootstrap";
import backgroundImage from "../assets/img/background.jpg";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialCode, setSpecialCode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!specialCode) {
      setError("Special code is required to create an account.");
      return;
    }
    // Dummy sign-up logic; replace with actual auth
    if (specialCode === "SECRET123") {
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } else {
      setError("Invalid special code.");
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center vh-100 signin-background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="glass-card p-5 rounded-4 shadow-lg">
              <div className="text-center mb-4">
                <h2 className="fw-bold head-text text-primary mb-2">Create Account</h2>
                <p className="main-text text-muted">Join Julio Financial Services</p>
              </div>
              
              {error && <Alert variant="danger" className="border-0 rounded-3">{error}</Alert>}
              {success && <Alert variant="success" className="border-0 rounded-3">Account created successfully! Redirecting to sign in...</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold main-text">Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="py-3 border-0 rounded-3"
                    style={{ fontSize: '1rem' }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold main-text">Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Create a password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="py-3 border-0 rounded-3"
                    style={{ fontSize: '1rem' }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold main-text">Confirm Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Confirm your password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                    className="py-3 border-0 rounded-3"
                    style={{ fontSize: '1rem' }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold main-text">Special Code</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter special code" 
                    value={specialCode}
                    onChange={(e) => setSpecialCode(e.target.value)}
                    required 
                    className="py-3 border-0 rounded-3"
                    style={{ fontSize: '1rem' }}
                  />
                  <Form.Text className="text-muted small-text">
                    A special code is required to create an account. Contact support if needed.
                  </Form.Text>
                </Form.Group>
                
                <Button 
                  variant="berry" 
                  type="submit" 
                  className="w-100 py-3 fw-semibold btn-berry border-0 rounded-3 mb-4"
                  style={{
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Create Account
                </Button>
                
                <div className="text-center">
                  <p className="main-text mb-0">
                    Already have an account?{" "}
                    <Link 
                      to="/signin" 
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}