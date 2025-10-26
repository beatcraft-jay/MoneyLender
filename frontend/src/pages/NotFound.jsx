import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import backgroundImage from "../assets/img/background.jpg";

export default function NotFound() {
  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center p-3 dashboard-background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="glass-card p-5 rounded-4 shadow-lg text-center" style={{ maxWidth: '500px' }}>
        <div className="mb-4">
          <h1 className="display-1 head-text font-bold text-primary">404</h1>
          <h2 className="head-text font-medium mb-3">Page Not Found</h2>
          <p className="main-text text-muted mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/" className="btn btn-berry d-flex align-items-center gap-2 font-medium border-0">
            <Home size={18} />
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline-primary d-flex align-items-center gap-2 font-medium"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        <div className="mt-4">
          <p className="small-text text-muted">
            Need help? <Link to="/support" className="text-primary">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}