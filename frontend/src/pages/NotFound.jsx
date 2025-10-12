import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <div className="mb-4">
          <h1 className="display-1 head-text font-medium text-muted">404</h1>
          <h2 className="head-text font-medium mb-3">Page Not Found</h2>
          <p className="small-text text-muted mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/" className="btn btn-primary d-flex align-items-center gap-2 font-medium">
            <Home size={18} />
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline-secondary d-flex align-items-center gap-2 font-medium"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}