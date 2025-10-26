import { Link } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import backgroundImage from "../assets/img/background.jpg";
import logo from "../assets/img/logo.png"; 

export default function Landing() {
  return (
    <div 
      className="d-flex align-items-center justify-content-center vh-100 landing-background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <Container>
        {/* Logo Row */}
        <Row className="justify-content-center mb-4">
          <Col xs="auto">
            <img 
              src={logo} 
              alt="Julio Financial Services Logo" 
              className="logo-img"
              style={{
                maxHeight: '80px',
                width: 'auto'
              }}
            />
          </Col>
        </Row>
        
        {/* Content Card Row */}
        <Row className="justify-content-center text-center">
          <Col md={8} lg={6}>
            <div className="glass-card p-5 rounded-4 shadow-lg">
              <h1 className="display-4 fw-bold mb-4 text-primary text-berry">
                Welcome to
              </h1>
              <h1 className="display-6 fw-bold mb-4 text-berry text-primary">
                Julio Financial Services
              </h1>
              <p className="lead mb-5 main-text">
                Your trusted partner for secure and efficient financial solutions. 
                Manage loans, applicants, and more with ease.
              </p>
              <Link to="/signin">
                <Button 
                  variant="berry" 
                  size="lg" 
                  className="px-5 py-3 fw-semibold btn-berry"
                  style={{
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}