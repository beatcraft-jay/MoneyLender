import { Link } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";

export default function landing() {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h1 className="display-4 fw-bold mb-4">Welcome to Julio Financial Services</h1>
            <p className="lead mb-5">Your trusted partner for secure and efficient financial solutions. Manage loans, applicants, and more with ease.</p>
            <Link to="/signin">
              <Button variant="primary" size="lg" className="px-5 py-3">
                Sign In
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}