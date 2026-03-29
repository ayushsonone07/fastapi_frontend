import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f4f4f4;
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1e1e2f;
          padding: 15px 40px;
          color: white;
        }
        .logo {
          font-size: 20px;
          font-weight: bold;
        }
        .nav-links {
          display: flex;
          gap: 20px;
        }
        .nav-links a {
          text-decoration: none;
          color: white;
          font-size: 16px;
          padding: 6px 10px;
          border-radius: 5px;
          transition: 0.2s;
        }
        .nav-links a:hover {
          background: #4f46e5;
        }
        .container {
          padding: 40px;
        }
        .card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
      `}</style>

      <div className="navbar">
        <div className="logo">MyApp</div>
        <div className="nav-links">
          <Link to="/">Feed</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </>
  );
}