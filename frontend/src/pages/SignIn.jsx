
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Form, Container, Row, Col, Alert } from "react-bootstrap";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy login logic; replace with actual auth
    if (email && password) {
      // Simulate success; redirect to dashboard or applicants
      window.location.href = "/applicants";
    } else {
      setError("Please enter valid credentials.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-lg border-0 rounded-3">
              <Card.Body className="p-5">
                <h2 className="text-center mb-4 fw-bold">Sign In to Julio Financial</h2>
                {error && <Alert variant="danger">{error}</Alert>}
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
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100 mb-3">
                    Sign In
                  </Button>
                  <div className="text-center">
                    <Link to="/signup" className="text-primary">
                      Don't have an account? Create one
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}