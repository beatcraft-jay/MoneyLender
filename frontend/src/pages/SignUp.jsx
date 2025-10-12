
import { useState } from "react";
import { Button, Card, Form, Container, Row, Col, Alert } from "react-bootstrap";

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
    // Simulate validation of special code (e.g., check if it's "SECRET123")
    if (specialCode === "SECRET123") {
      setSuccess(true);
      setError(null);
      // Redirect to sign-in after success
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } else {
      setError("Invalid special code.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-lg border-0 rounded-3">
              <Card.Body className="p-5">
                <h2 className="text-center mb-4 fw-bold">Create Account</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">Account created successfully! Redirecting to sign in...</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="Enter email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Confirm Password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Special Code</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter special code" 
                      value={specialCode}
                      onChange={(e) => setSpecialCode(e.target.value)}
                      required 
                    />
                    <Form.Text className="text-muted">
                      A special code is required to create an account. Contact support if needed.
                    </Form.Text>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Create Account
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}