import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Form, Container, Row, Col, Alert } from "react-bootstrap";
import backgroundImage from "../assets/img/background.jpg";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      // Use navigate instead of window.location.href for React Router
      navigate("/dashboard");
    } else {
      setError("Please enter valid credentials.");
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100 py-4 signin-background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <Container fluid>
        <Row className="justify-content-center align-items-center">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg my-3">
              <div className="text-center mb-4">
                <h2 className="fw-bold head-text text-primary mb-2">Welcome Back</h2>
                <p className="main-text text-muted">Sign in to your account</p>
              </div>
              
              {error && (
                <Alert variant="danger" className="border-0 rounded-3 mb-4">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold main-text">Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="py-2 py-md-3 border-0 rounded-3"
                    style={{ fontSize: '1rem' }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold main-text">Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="py-2 py-md-3 border-0 rounded-3"
                    style={{ fontSize: '1rem' }}
                  />
                </Form.Group>
                
                <Button 
                  variant="berry" 
                  type="submit" 
                  className="w-100 py-2 py-md-3 fw-semibold btn-berry border-0 rounded-3 mb-3"
                  style={{
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign In
                </Button>
                
                <div className="text-center">
                  <p className="main-text mb-0 small">
                    Don't have an account?{" "}
                    <Link 
                      to="/signup" 
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Create one
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